import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import pg from 'pg';
const { Pool } = pg;
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config({ override: true });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JWT_SECRET = process.env.JWT_SECRET || "clms-pro-secret-key-2026";

if (!process.env.DATABASE_URL) {
  console.error("FATAL: DATABASE_URL environment variable is not set.");
  console.error("Please configure your PostgreSQL connection string in the Secrets panel.");
  process.exit(1);
}

// Database Configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

console.log("Using PostgreSQL database.");

// Database Helper
async function query(text, params = []) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (err) {
    console.error("Query error:", err.message);
    throw err;
  }
}

// Initialize Database Schema
async function initDb() {
  try {
    console.log("Initializing database schema...");
    
    await query(`
      CREATE TABLE IF NOT EXISTS Customer (
        customer_id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        phone VARCHAR(15) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        address TEXT NOT NULL,
        password TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS Receiver (
        receiver_id SERIAL PRIMARY KEY,
        customer_id INTEGER NOT NULL REFERENCES Customer(customer_id) ON DELETE CASCADE,
        name VARCHAR(100) NOT NULL,
        phone VARCHAR(15) NOT NULL,
        address TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS Employee (
        employee_id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        role VARCHAR(50) NOT NULL,
        phone VARCHAR(15) NOT NULL,
        email VARCHAR(100) UNIQUE,
        assigned_route VARCHAR(100),
        password TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS Route (
        route_id SERIAL PRIMARY KEY,
        route_name VARCHAR(100) NOT NULL,
        origin_city VARCHAR(100) NOT NULL,
        destination_city VARCHAR(100) NOT NULL,
        estimated_days INTEGER NOT NULL CHECK (estimated_days > 0)
      );

      CREATE TABLE IF NOT EXISTS Shipment (
        shipment_id SERIAL PRIMARY KEY,
        tracking_id VARCHAR(20) UNIQUE NOT NULL,
        customer_id INTEGER NOT NULL REFERENCES Customer(customer_id),
        receiver_id INTEGER NOT NULL REFERENCES Receiver(receiver_id),
        employee_id INTEGER REFERENCES Employee(employee_id),
        route_id INTEGER REFERENCES Route(route_id),
        courier_type VARCHAR(50) NOT NULL,
        origin VARCHAR(100) NOT NULL,
        destination VARCHAR(100) NOT NULL,
        weight_kg DECIMAL(10,2) NOT NULL CHECK (weight_kg > 0),
        shipment_date DATE NOT NULL,
        eta DATE
      );

      CREATE TABLE IF NOT EXISTS Package (
        package_id SERIAL PRIMARY KEY,
        shipment_id INTEGER NOT NULL REFERENCES Shipment(shipment_id) ON DELETE CASCADE,
        description VARCHAR(400),
        quantity INTEGER NOT NULL CHECK (quantity > 0),
        package_type VARCHAR(50)
      );

      CREATE TABLE IF NOT EXISTS Delivery_Status (
        status_id SERIAL PRIMARY KEY,
        shipment_id INTEGER NOT NULL REFERENCES Shipment(shipment_id) ON DELETE CASCADE,
        status VARCHAR(50) NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        remarks TEXT
      );

      CREATE INDEX IF NOT EXISTS idx_tracking_id ON Shipment(tracking_id);
      CREATE INDEX IF NOT EXISTS idx_customer_id ON Shipment(customer_id);
      CREATE INDEX IF NOT EXISTS idx_receiver_id ON Shipment(receiver_id);
      CREATE INDEX IF NOT EXISTS idx_shipment_status ON Delivery_Status(shipment_id);
    `);
    
    console.log("Database initialization complete.");
  } catch (err) {
    console.error("Database initialization error:", err);
  }
}

async function startServer() {
  await initDb();
  
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // Auth Middleware
  const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  };

  function calculatePrice(weight) {
  const base = 100;
  const perKg = 25;
  return base + (weight * perKg);
}

  // API Routes
  app.get("/api/stats", async (req, res) => {
    try {
      const shipmentsCount = await query("SELECT COUNT(*) as count FROM Shipment");
      const customersCount = await query("SELECT COUNT(*) as count FROM Customer");
      const routesCount = await query("SELECT COUNT(*) as count FROM Route");
      const employeesCount = await query("SELECT COUNT(*) as count FROM Employee");
      
      const today = new Date().toISOString().split('T')[0];
      const todayShipments = await query("SELECT COUNT(*) as count FROM Shipment WHERE shipment_date::text LIKE $1", [`${today}%`]);

      const stats = {
        shipments: parseInt(shipmentsCount.rows[0]?.count || 0),
        customers: parseInt(customersCount.rows[0]?.count || 0),
        routes: parseInt(routesCount.rows[0]?.count || 0),
        employees: parseInt(employeesCount.rows[0]?.count || 0),
        todayShipments: parseInt(todayShipments.rows[0]?.count || 0)
      };
      console.log("Stats response:", stats);
      res.json(stats);
    } catch (err) {
      console.error("Stats error:", err);
      res.status(500).json({ message: "Database error" });
    }
  });

  app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;
    try {
      // First check Employee table (by email or name or ID)
      let result = await query("SELECT * FROM Employee WHERE email = $1", [email]);
      
      let user = result.rows[0];
      let role = user ? user.role.toLowerCase() : null;
      let id = user ? user.employee_id : null;
      let name = user ? user.name : null;
      let userEmail = user ? user.email : null;

      if (!user) {
        // Check Customer table
        result = await query("SELECT * FROM Customer WHERE email = $1", [email]);
        user = result.rows[0];
        if (user) {
          role = 'customer';
          id = user.customer_id;
          name = user.name;
          userEmail = user.email;
        }
      }
      
      if (!user) {
        console.log(`Login: User not found for: ${email}`);
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Check password
      let isMatch = false;
      if (user.password.startsWith('$2')) {
        isMatch = bcrypt.compareSync(password, user.password);
      } else {
        isMatch = password === user.password;
      }

      if (isMatch) {
        const token = jwt.sign({ id, email: userEmail || email, role }, JWT_SECRET, { expiresIn: '24h' });
        res.json({ token, user: { id, email: userEmail || email, role, name } });
      } else {
        console.log(`Login: Password mismatch for user: ${email}`);
        res.status(401).json({ message: "Invalid credentials" });
      }
    } catch (err) {
      console.error("Login error:", err);
      res.status(500).json({ message: "Database error: " + err.message });
    }
  });

  app.get("/api/track/:trackingId", async (req, res) => {
    const { trackingId } = req.params;
    try {
      const shipmentRes = await query(`
        SELECT s.*, c.name as customer_name, r.name as receiver_name 
        FROM Shipment s
        JOIN Customer c ON s.customer_id = c.customer_id
        JOIN Receiver r ON s.receiver_id = r.receiver_id
        WHERE s.tracking_id = $1
      `, [trackingId]);

      const shipment = shipmentRes.rows[0];
    
      if (!shipment) return res.status(404).json({ message: "Shipment not found" });

        const price = calculatePrice(shipment.weight_kg);

      const historyRes = await query("SELECT * FROM Delivery_Status WHERE shipment_id = $1 ORDER BY updated_at DESC", [shipment.shipment_id]);
      res.json({ shipment, history: historyRes.rows,price});
    } catch (err) {
      res.status(500).json({ message: "Database error" });
    }
  });

  app.post("/api/shipments", authenticateToken, async (req, res) => {
    if (req.user.role === 'customer') return res.sendStatus(403);
   if (req.user.role === 'driver' || req.user.role === 'dispatcher') {
  return res.status(403).json({
    message: "Driver or dispatcher cannot place an order"
  });
}

    
    const { 
      customer_id, 
      receiver_name, 
      receiver_phone, 
      receiver_address, 
      courier_type, 
      origin, 
      destination, 
      weight_kg, 
      eta, 
      packages: pkgList 
    } = req.body;

     const employee_id=req.user.id;
    const tracking_id = "CLMS" + Math.random().toString(36).substring(2, 10).toUpperCase();
    const shipment_date = new Date().toISOString().split('T')[0];
    
    const routeResult = await query(
  "SELECT route_id FROM Route WHERE origin_city=$1 AND destination_city=$2",
  [origin, destination]
);

let route_id = routeResult.rows[0]?.route_id;

    try {
      // 1. Create the Receiver record first
      const receiverResult = await query(`
        INSERT INTO Receiver (customer_id, name, phone, address)
        VALUES ($1, $2, $3, $4)
        RETURNING receiver_id
      `, [customer_id, receiver_name, receiver_phone, receiver_address]);

      const receiver_id = receiverResult.rows[0].receiver_id;

      if (!route_id) {
  const today = new Date();
  const etaDate = new Date(eta);

  const diffTime = etaDate - today;
  const estimated_days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const routeRes = await query(
    `INSERT INTO route (route_name, origin_city, destination_city, estimated_days)
     VALUES ($1, $2, $3, $4)
     RETURNING route_id`,
    [
      `${origin}-${destination}`,
      origin,
      destination,
      estimated_days > 0 ? estimated_days : 1 // safety
    ]
  );

  route_id = routeRes.rows[0].route_id;
}
      // 2. Create the Shipment using the new receiver_id
      const result = await query(`
        INSERT INTO Shipment (tracking_id, customer_id, receiver_id,employee_id,route_id,courier_type, origin, destination, weight_kg, shipment_date, eta)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9,$10,$11)
        RETURNING shipment_id
      `, [tracking_id, customer_id, receiver_id,employee_id,route_id,courier_type, origin, destination, weight_kg, shipment_date, eta || null]);

      const shipmentId = result.rows[0].shipment_id;
      const price=calculatePrice(weight_kg);
      // Initial status
      await query("INSERT INTO Delivery_Status (shipment_id, status, remarks) VALUES ($1, $2, $3)", [
        shipmentId,
        "Pending",
        "Shipment registered and awaiting pickup."
      ]);

      // Add packages
      if (pkgList && Array.isArray(pkgList)) {
        for (const p of pkgList) {
          await query("INSERT INTO Package (shipment_id, description, quantity, package_type) VALUES ($1, $2, $3, $4)", [
            shipmentId, p.description, p.quantity, p.package_type
          ]);
        }
      }

      res.json({ tracking_id, shipment_id: shipmentId});
    } catch (err) {
      res.status(500).json({ message: "Database error" });
    }
  });

  app.get("/api/customers", authenticateToken, async (req, res) => {
    const result = await query("SELECT * FROM Customer");
    res.json(result.rows);
  });

   app.get("/api/employee", authenticateToken, async (req, res) => {
    const result = await query("SELECT * FROM Customer");
    res.json(result.rows);
  });

  app.get("/api/receivers/:customerId", authenticateToken, async (req, res) => {
    const result = await query("SELECT * FROM Receiver WHERE customer_id = $1", [req.params.customerId]);
    res.json(result.rows);
  });

  app.post("/api/status/update", authenticateToken, async (req, res) => {
    if (req.user.role === 'customer') return res.sendStatus(403);
    const { shipment_id, status, remarks } = req.body;
    
    try {
      await query("INSERT INTO Delivery_Status (shipment_id, status, remarks) VALUES ($1, $2, $3)", [
        shipment_id,
        status,
        remarks
      ]);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ message: "Database error" });
    }
  });

  // Admin Routes
  app.get("/api/my-shipments", authenticateToken, async (req, res) => {
    try {
      let customerId;
      if (req.user.role === 'customer') {
        customerId = req.user.id;
      } else {
        return res.status(403).json({ message: "Use tracking for specific shipments" });
      }

      const result = await query(`
        SELECT s.*, c.name as customer_name, r.name as receiver_name,
        (SELECT status FROM Delivery_Status WHERE shipment_id = s.shipment_id ORDER BY updated_at DESC LIMIT 1) as current_status
        FROM Shipment s
        JOIN Customer c ON s.customer_id = c.customer_id
        JOIN Receiver r ON s.receiver_id = r.receiver_id
        WHERE s.customer_id = $1
        ORDER BY s.shipment_date DESC
      `, [customerId]);
      
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ message: "Database error" });
    }
  });



  app.get("/api/admin/employees", authenticateToken, async (req, res) => {
    if (req.user.role !== 'admin') return res.sendStatus(403);
    const result = await query("SELECT * FROM Employee");
    res.json(result.rows);
  });


  app.get("/api/admin/routes", authenticateToken, async (req, res) => {
    if (req.user.role !== 'admin') return res.sendStatus(403);
    const result = await query("SELECT * FROM Route ORDER BY route_id DESC");
    res.json(result.rows);
  });

  app.post("/api/admin/routes", authenticateToken, async (req, res) => {
    if (req.user.role !== 'admin') return res.sendStatus(403);
    const { route_name, origin_city, destination_city, estimated_days } = req.body;
    try {
      await query(
        "INSERT INTO Route (route_name, origin_city, destination_city, estimated_days) VALUES ($1, $2, $3, $4)",
        [route_name, origin_city, destination_city, parseInt(estimated_days)]
      );
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ message: "Database error" });
    }
  });

  app.put("/api/admin/routes/:routeId", authenticateToken, async (req, res) => {
    if (req.user.role !== 'admin') return res.sendStatus(403);
    const { route_name, origin_city, destination_city, estimated_days } = req.body;
    try {
      await query(
        "UPDATE Route SET route_name = $1, origin_city = $2, destination_city = $3, estimated_days = $4 WHERE route_id = $5",
        [route_name, origin_city, destination_city, parseInt(estimated_days), req.params.routeId]
      );
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ message: "Database error" });
    }
  });

  app.delete("/api/admin/routes/:routeId", authenticateToken, async (req, res) => {
    if (req.user.role !== 'admin') return res.sendStatus(403);
    try {
      await query("DELETE FROM Route WHERE route_id = $1", [req.params.routeId]);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ message: "Database error" });
    }
  });

  // User Management
  app.get("/api/admin/users", authenticateToken, async (req, res) => {
    if (req.user.role !== 'admin') return res.sendStatus(403);
    try {
      const customers = await query("SELECT customer_id as id, email, 'customer' as role, name, phone FROM Customer");
      const employees = await query("SELECT employee_id as id, COALESCE(email, phone) as email, role, name, phone FROM Employee");
      
      const allUsers = [
        ...customers.rows.map(r => ({ ...r, type: 'customer' })),
        ...employees.rows.map(r => ({ ...r, type: 'employee' }))
      ];
      
      console.log("Users response count:", allUsers.length);
      res.json(allUsers);
    } catch (err) {
      console.error("Users list error:", err);
      res.status(500).json({ message: "Database error" });
    }
  });

  app.delete("/api/admin/users/:id", authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: "Only admin allowed" });
  }

  const { type } = req.query;
  const id = req.params.id;

  try {

    // 👇 If deleting employee → no change needed
    if (type === 'employee') {
      await query("DELETE FROM Employee WHERE employee_id = $1", [id]);
      return res.json({ success: true });
    }

    // 👇 If deleting customer → apply logic

    // 1️⃣ Check all shipments delivered
    const check = await query(`
      SELECT COUNT(*) 
      FROM Shipment s
      WHERE s.customer_id = $1
      AND NOT EXISTS (
        SELECT 1 FROM Delivery_Status d
        WHERE d.shipment_id = s.shipment_id
        AND d.status = 'Delivered'
      )
    `, [id]);

    if (parseInt(check.rows[0].count) > 0) {
      return res.status(400).json({
        message: "Cannot delete: Some shipments are not delivered"
      });
    }

    // 2️⃣ Delete dependent data (VERY IMPORTANT)

    // Delivery_Status
    await query(`
      DELETE FROM Delivery_Status 
      WHERE shipment_id IN (
        SELECT shipment_id FROM Shipment WHERE customer_id = $1
      )
    `, [id]);

    // Package (if exists)
    await query(`
      DELETE FROM Package 
      WHERE shipment_id IN (
        SELECT shipment_id FROM Shipment WHERE customer_id = $1
      )
    `, [id]);

    // Shipment
    await query(`DELETE FROM Shipment WHERE customer_id = $1`, [id]);

    // 3️⃣ Delete Customer
    await query(`DELETE FROM Customer WHERE customer_id = $1`, [id]);

    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ message: "Database error: " + err.message });
  }
});

  app.post("/api/admin/register-user", authenticateToken, async (req, res) => {

   const { email, password, role, name, phone, address, assigned_route, employee_role } = req.body;

  //  Only admin or employee can access
  if (!['admin', 'employee','staff'].includes(req.user.role)) {
    return res.status(403).json({ message: "Access denied" });
  }

  //  Employee can only create customers
  if (req.user.role === 'employee' && role !== 'customer'&&req.user.role==='staff') {
    return res.status(403).json({ message: "Employees or Staff can only register customers" });
  }


    try {
      const hashedPassword = bcrypt.hashSync(password, 10);

      if (role === 'customer') {
        await query(
          "INSERT INTO Customer (name, phone, email, address, password) VALUES ($1, $2, $3, $4, $5)",
          [name, phone, email, address, hashedPassword]
        );
      } else {
        await query(
          "INSERT INTO Employee (name, role, phone, email, assigned_route, password) VALUES ($1, $2, $3, $4, $5, $6)",
          [name, employee_role || role, phone, email, assigned_route, hashedPassword]
        );
      }

      res.json({ success: true });
    } catch (err) {
      if (err.message.includes('unique') || err.message.includes('UNIQUE')) {
        return res.status(400).json({ message: "Email already exists" });
      }
      res.status(500).json({ message: "Database error: " + err.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
      root: path.join(process.cwd(), 'frontend')
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
