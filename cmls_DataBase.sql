CREATE DATABASE project;

CREATE TABLE Customer (
    customer_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    address TEXT NOT NULL,
	password VARCHAR(20) NOT NULL
);

CREATE TABLE Receiver (
    receiver_id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    address TEXT NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES Customer(customer_id) ON DELETE CASCADE
);

CREATE TABLE Employee (
    employee_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    assigned_route VARCHAR(100),
	password VARCHAR(20) NOT NULL
);


CREATE TABLE Route (
    route_id SERIAL PRIMARY KEY,
    route_name VARCHAR(100) NOT NULL,
    origin_city VARCHAR(100) NOT NULL,
    destination_city VARCHAR(100) NOT NULL,
    estimated_days INTEGER NOT NULL CHECK (estimated_days > 0)
);

CREATE TABLE Shipment (
    shipment_id SERIAL PRIMARY KEY,
    tracking_id VARCHAR(20) UNIQUE NOT NULL,
    customer_id INTEGER NOT NULL,
    receiver_id INTEGER NOT NULL,
    employee_id INTEGER NOT NULL,
    route_id INTEGER NOT NULL,
    courier_type VARCHAR(50) NOT NULL,
    origin VARCHAR(100) NOT NULL,
    destination VARCHAR(100) NOT NULL,
    weight_kg DECIMAL(6,2) NOT NULL CHECK (weight_kg > 0),
    shipment_date DATE NOT NULL,
    eta DATE,
    FOREIGN KEY (customer_id) REFERENCES Customer(customer_id),
    FOREIGN KEY (receiver_id) REFERENCES Receiver(receiver_id),
    FOREIGN KEY (employee_id) REFERENCES Employee(employee_id),
    FOREIGN KEY (route_id) REFERENCES Route(route_id)
);

CREATE TABLE Package (
    package_id SERIAL PRIMARY KEY,
    shipment_id INTEGER NOT NULL,
    description VARCHAR(400),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    package_type VARCHAR(50),
    FOREIGN KEY (shipment_id) REFERENCES Shipment(shipment_id) ON DELETE CASCADE
);

CREATE TABLE Delivery_Status (
    status_id SERIAL PRIMARY KEY,
    shipment_id INTEGER NOT NULL,
    status VARCHAR(50) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    remarks TEXT,
    FOREIGN KEY (shipment_id) REFERENCES Shipment(shipment_id) ON DELETE CASCADE
);

SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public';

CREATE INDEX idx_tracking_id ON Shipment(tracking_id);
CREATE INDEX idx_customer_id ON Shipment(customer_id);
CREATE INDEX idx_receiver_id ON Shipment(receiver_id);
CREATE INDEX idx_shipment_status ON Delivery_Status(shipment_id);

-- drop database

-- INSERT INTO Customer (name, phone, email, address, password)
-- VALUES ('Kiran Kumar', '9876543210', 'kiran@email.com', 'Kerala','2005');

-- INSERT INTO Receiver (customer_id, name, phone, address)
-- VALUES (1, 'Rahul', '9123456780', 'Bangalore');

-- INSERT INTO Employee (name, role, phone)
-- VALUES ('Ravi', 'Delivery Agent', '9000000000');

-- INSERT INTO Route (route_name, origin_city, destination_city, estimated_days)
-- VALUES ('KER-BLR', 'Kerala', 'Bangalore', 2);

-- INSERT INTO Shipment (
--     tracking_id, customer_id, receiver_id, employee_id, route_id,
--     courier_type, origin, destination, weight_kg, shipment_date, eta
-- )
-- VALUES (
--     'TRK123', 1, 1, 1, 1,
--     'Standard', 'Kerala', 'Bangalore', 2.5, CURRENT_DATE, CURRENT_DATE + INTERVAL '2 days'
-- );

-- INSERT INTO Delivery_Status (shipment_id, status)
-- VALUES (1, 'Pending');

-- ALTER TABLE customer
-- ADD COLUMN password varchar NOT NULL;
-- delete from customer;
 select * from customer;
 select * from employee;
 select * from route;
 select * from shipment;


 -- SELECT email, password FROM employee;