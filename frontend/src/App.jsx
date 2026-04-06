import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import { Search, Package, LogIn, LogOut, ChevronRight, MapPin, Calendar, Info, CheckCircle2, Clock, AlertCircle, LayoutDashboard, Map, Users, Edit2, Trash2, UserPlus, BarChart3 } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from './lib/utils';

// --- Components ---

const Navbar = ({ user, onLogout }) => (
  <nav className="bg-clms-primary text-white border-b border-white/10 sticky top-0 z-50 shadow-lg">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between h-20 items-center">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="bg-clms-secondary text-white font-black text-2xl px-3 py-1 rounded-sm tracking-tighter transform group-hover:scale-105 transition-transform">CLMS</div>
          <div className="flex flex-col">
            <span className="font-black text-lg leading-none tracking-tight">PRO LOGISTICS</span>
            <span className="text-[10px] font-bold text-clms-accent uppercase tracking-[0.2em]">Global Network</span>
          </div>
        </Link>
        
        <div className="flex items-center gap-8">
          <Link to="/" className="text-sm font-bold hover:text-clms-secondary transition-colors uppercase tracking-widest">Track</Link>
          <Link to="/ship" className="text-sm font-bold hover:text-clms-secondary transition-colors uppercase tracking-widest">Ship</Link>
          {user ? (
            <div className="flex items-center gap-6">
              <Link to="/dashboard" className="flex items-center gap-2 text-sm font-bold bg-white/10 px-4 py-2 rounded-full hover:bg-white/20 transition-colors border border-white/20">
                <LayoutDashboard size={16} className="text-clms-secondary" />
                <span>{user.name}</span>
              </Link>
              <button onClick={onLogout} className="text-sm font-bold text-clms-secondary hover:underline flex items-center gap-1">
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <Link to="/login" className="flex items-center gap-2 text-sm font-bold bg-clms-secondary text-white px-6 py-2.5 rounded-sm hover:bg-orange-600 transition-all shadow-xl hover:shadow-clms-secondary/20">
              <LogIn size={16} />
              <span>Client Access</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  </nav>
);

const Footer = () => (
  <footer className="bg-clms-primary text-white py-16 mt-auto border-t border-white/5">
  </footer>
);

const Home = () => {
  const [trackingId, setTrackingId] = useState('');
  const [stats, setStats] = useState({ shipments: 0, customers: 0, routes: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error("Stats fetch error:", err));
  }, []);

  const handleTrack = (e) => {
    e.preventDefault();
    if (trackingId.trim()) {
      navigate(`/track/${trackingId.trim()}`);
    }
  };

  return (
    <div className="flex-1">
      {/* Hero Section */}
      <div className="relative h-[650px] bg-clms-primary overflow-hidden">
        <img 
          src="https://picsum.photos/seed/cargo/1920/1080" 
          className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"
          alt="Logistics background"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-clms-primary/20 via-clms-primary/60 to-clms-primary" />
        
        <div className="relative max-w-7xl mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <div className="inline-block bg-clms-secondary/20 text-clms-secondary px-4 py-1 rounded-full text-xs font-black uppercase tracking-[0.3em] mb-6 border border-clms-secondary/30">
              Next-Gen Logistics
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-white mb-8 leading-[0.9] tracking-tighter">
              BEYOND <br />
              <span className="text-clms-secondary italic">BOUNDARIES.</span>
            </h1>
            <p className="text-xl text-clms-grey mb-12 font-medium max-w-2xl mx-auto">
              Precision tracking and seamless global logistics management for the modern enterprise.
            </p>
            
            <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-0 p-1 bg-white/10 backdrop-blur-md rounded-sm border border-white/20 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-clms-secondary" size={24} />
                <input 
                  type="text" 
                  placeholder="Enter Tracking ID..." 
                  className="w-full bg-transparent h-16 pl-16 pr-6 text-white text-xl font-bold focus:outline-none placeholder:text-white/30"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                />
              </div>
              <button 
                type="submit"
                className="bg-clms-secondary text-white px-10 h-16 font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-2xl flex items-center justify-center gap-3"
              >
                Track <ChevronRight size={20} />
              </button>
            </form>
          </motion.div>
        </div>
      </div>

      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div>
              <div className="text-5xl font-black text-clms-primary mb-2">{stats.shipments}</div>
              <div className="text-xs font-black text-clms-grey uppercase tracking-widest">Shipments Total</div>
            </div>
            <div>
              <div className="text-5xl font-black text-clms-primary mb-2">{stats.customers}</div>
              <div className="text-xs font-black text-clms-grey uppercase tracking-widest">Active Customers</div>
            </div>
            <div>
              <div className="text-5xl font-black text-clms-primary mb-2">{stats.routes}</div>
              <div className="text-xs font-black text-clms-grey uppercase tracking-widest">Active Routes</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TrackingResult = () => {
  const { trackingId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTracking = async () => {
      try {
        const res = await fetch(`/api/track/${trackingId}`);
        if (!res.ok) throw new Error('Shipment not found');
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTracking();
  }, [trackingId]);

  if (loading) return (
    <div className="flex-1 flex items-center justify-center py-20 bg-clms-primary">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-clms-secondary" />
    </div>
  );

  if (error) return (
    <div className="flex-1 max-w-4xl mx-auto px-4 py-32 text-center">
      <AlertCircle className="mx-auto text-clms-secondary mb-8" size={80} />
      <h2 className="text-5xl font-black mb-6 uppercase tracking-tighter">DATA NOT FOUND</h2>
      <p className="text-xl text-clms-grey mb-12">We couldn't locate any shipment records for: <span className="font-black text-clms-primary underline">{trackingId}</span></p>
      <Link to="/" className="bg-clms-primary text-white px-12 py-4 font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-2xl">
        Return Home
      </Link>
    </div>
  );

  const currentStatus = data?.history[0]?.status || 'Unknown';

  return (
    <div className="flex-1 bg-slate-50 py-20">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white shadow-2xl rounded-sm overflow-hidden border border-slate-200"
        >
          {/* Header */}
          <div className="bg-clms-primary p-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-b-8 border-clms-secondary">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-clms-accent mb-2">Shipment Identifier</p>
              <h2 className="text-4xl font-black text-white tracking-tighter">{trackingId}</h2>
            </div>
            <div className="flex flex-col items-end">
              <p className="text-xs font-black uppercase tracking-[0.3em] text-clms-grey mb-2">Current Status</p>
              <div className="bg-clms-secondary text-white px-8 py-3 rounded-sm font-black text-2xl italic tracking-tight">
                {currentStatus.toUpperCase()}
              </div>
            </div>
          </div>

          <div className="p-12 grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* Details */}
            <div className="lg:col-span-2 space-y-12">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                <div className="flex items-start gap-4">
                  <div className="bg-slate-100 p-3 rounded-sm"><MapPin className="text-clms-secondary" size={24} /></div>
                  <div>
                    <p className="text-xs font-black text-clms-grey uppercase tracking-widest mb-1">Origin</p>
                    <p className="font-black text-lg text-clms-primary">{data?.shipment.origin}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-slate-100 p-3 rounded-sm"><MapPin className="text-clms-accent" size={24} /></div>
                  <div>
                    <p className="text-xs font-black text-clms-grey uppercase tracking-widest mb-1">Destination</p>
                    <p className="font-black text-lg text-clms-primary">{data?.shipment.destination}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-slate-100 p-3 rounded-sm"><Calendar className="text-clms-primary" size={24} /></div>
                  <div>
                    <p className="text-xs font-black text-clms-grey uppercase tracking-widest mb-1">Dispatched</p>
                    <p className="font-black text-lg text-clms-primary">{data?.shipment.shipment_date}</p>
                  </div>
                </div>
                 <div className="flex items-start gap-4">
                <div className="bg-slate-100 p-3 rounded-sm">
                  💰
                </div>
                <div>
                  <p className="text-xs font-black text-clms-grey uppercase tracking-widest mb-1">
                    Price
                  </p>
                  <p className="font-black text-lg text-clms-primary">
                    ₹{data?.price?.toFixed(2)}
                  </p>
                </div>
              </div>
                <div className="flex items-start gap-4">
                  <div className="bg-slate-100 p-3 rounded-sm"><Clock className="text-clms-secondary" size={24} /></div>
                  <div>
                    <p className="text-xs font-black text-clms-grey uppercase tracking-widest mb-1">Estimated Arrival</p>
                    <p className="font-black text-lg text-clms-primary">{data?.shipment.eta || 'Calculating...'}</p>
                  </div>
                </div>
              </div>
               
              <div className="h-px bg-slate-100" />

              <div>
                <h3 className="text-2xl font-black mb-10 uppercase tracking-tighter flex items-center gap-3">
                  <Info size={24} className="text-clms-secondary" />
                  Activity Log
                </h3>
                <div className="space-y-12 relative before:absolute before:left-[23px] before:top-2 before:bottom-2 before:w-1 before:bg-slate-100">
                  {data?.history.map((item, idx) => (
                    <div key={item.status_id} className="relative pl-16">
                      <div className={cn(
                        "absolute left-0 top-1 w-12 h-12 rounded-full flex items-center justify-center border-4 border-white shadow-lg z-10 transition-all",
                        idx === 0 ? "bg-clms-secondary text-white scale-110" : "bg-slate-200 text-slate-400"
                      )}>
                        {idx === 0 ? <CheckCircle2 size={24} /> : <Clock size={24} />}
                      </div>
                      <div className={cn(idx === 0 ? "bg-slate-50 p-6 rounded-sm border border-slate-100" : "")}>
                        <p className="text-xs text-clms-grey font-black uppercase tracking-widest mb-1">{new Date(item.updated_at).toLocaleString()}</p>
                        <p className="text-xl font-black uppercase text-clms-primary mb-2">{item.status}</p>
                        <p className="text-clms-grey font-medium">{item.remarks}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar Info */}
            <div className="space-y-8">
              <div className="bg-slate-50 p-8 border border-slate-200 rounded-sm">
                <h4 className="font-black uppercase text-xs tracking-[0.2em] mb-6 text-clms-grey">Manifest Details</h4>
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-clms-grey uppercase">Service</span>
                    <span className="font-black text-clms-primary">{data?.shipment.courier_type}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-clms-grey uppercase">Gross Weight</span>
                    <span className="font-black text-clms-primary">{data?.shipment.weight_kg} KG</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-clms-grey uppercase">Consignor</span>
                    <span className="font-black text-clms-primary">{data?.shipment.customer_name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-clms-grey uppercase">Consignee</span>
                    <span className="font-black text-clms-primary">{data?.shipment.receiver_name}</span>
                  </div>
                </div>
              </div>  
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const ProtectedRoute = ({ user, token, children, allowedRoles }) => {
  if (!user || !token) {
    return <Login onLogin={() => {}} />; // This is a bit hacky, better to use Navigate but I need to pass onLogin
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20 px-4 text-center">
        <AlertCircle size={64} className="text-clms-secondary mb-6" />
        <h2 className="text-4xl font-black uppercase tracking-tighter mb-4">Access Restricted</h2>
        <p className="text-clms-grey max-w-md mx-auto mb-8 font-medium">Your current clearance level ({user.role}) does not permit access to this section. Please contact your administrator if you believe this is an error.</p>
        <Link to="/dashboard" className="bg-clms-primary text-white px-8 py-3 font-black uppercase tracking-widest hover:bg-slate-800 transition-all">
          Back to Dashboard
        </Link>
      </div>
    );
  }
  
  return children;
};

const Login = ({ onLogin, user }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      onLogin(data.user, data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center bg-slate-50 py-32 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white shadow-2xl rounded-sm p-12 border border-slate-200"
      >
        <div className="text-center mb-12">
          <div className="bg-clms-primary text-white font-black text-3xl px-4 py-1 inline-block mb-6">CLMS</div>
          <h2 className="text-3xl font-black uppercase tracking-tighter text-clms-primary">Portal Access</h2>
          <p className="text-clms-grey mt-3 font-medium">Secure authentication for logistics partners</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <div className="bg-red-50 text-clms-secondary p-4 rounded-sm text-sm font-bold flex items-center gap-3 border border-red-100">
              <AlertCircle size={20} /> {error}
            </div>
          )}
          <div>
            <label className="block text-xs font-black uppercase text-clms-grey tracking-widest mb-2">Email or Employee ID</label>
            <input 
              type="text" 
              required
              className="w-full border-2 border-slate-100 bg-slate-50 h-14 px-5 focus:border-clms-secondary focus:bg-white outline-none transition-all font-bold text-clms-primary"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-black uppercase text-clms-grey tracking-widest mb-2">Security Key</label>
            <input 
              type="password" 
              required
              className="w-full border-2 border-slate-100 bg-slate-50 h-14 px-5 focus:border-clms-secondary focus:bg-white outline-none transition-all font-bold text-clms-primary"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-clms-primary text-white h-16 font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-2xl disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Authorize Access'}
          </button>
        </form>
        
        <div className="mt-12 pt-8 border-t border-slate-100 text-center">
          <p className="text-xs text-clms-grey uppercase tracking-widest font-bold">Authorized Personnel Only</p>
          <p className="text-sm mt-2 text-clms-primary font-medium italic">Please use your corporate credentials to log in.</p>
        </div>
      </motion.div>
    </div>
  );
};

const Dashboard = ({ user, token }) => {
  const [activeTab, setActiveTab] = useState(
    user.role === 'admin' ? 'summary' : 
    user.role === 'staff' ? 'register' : 'my-shipments'
  );
  const [customers, setCustomers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [users, setUsers] = useState([]);
  const [myShipments, setMyShipments] = useState([]);
  const [stats, setStats] = useState({ shipments: 0, customers: 0, routes: 0, employees: 0, todayShipments: 0 });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Form states
  const [shipmentForm, setShipmentForm] = useState({
    customer_id: '',
    receiver_name: '',
    receiver_phone: '',
    receiver_address: '',
    courier_type: 'Standard',
    origin: '',
    destination: '',
    weight_kg: '',
    eta: ''
  });

  const [updateForm, setUpdateForm] = useState({
    tracking_id: '',
    status: 'In Transit',
    remarks: ''
  });

  const [routeForm, setRouteForm] = useState({
    route_name: '',
    origin_city: '',
    destination_city: '',
    estimated_days: ''
  });

  const [registerUserForm, setRegisterUserForm] = useState({
    email: '',
    password: '',
    role: 'customer',
    name: '',
    phone: '',
    address: '',
    assigned_route: '',
    employee_role: ''
  });

  const [editingRouteId, setEditingRouteId] = useState(null);

  const fetchRoutes = useCallback(async () => {
    const res = await fetch('/api/admin/routes', { headers: { 'Authorization': `Bearer ${token}` } });
    if (res.ok) setRoutes(await res.json());
  }, [token]);

  const fetchUsers = useCallback(async () => {
    const res = await fetch('/api/admin/users', { headers: { 'Authorization': `Bearer ${token}` } });
    if (res.ok) setUsers(await res.json());
  }, [token]);

  const fetchStats = useCallback(async () => {
    const res = await fetch('/api/stats', { headers: { 'Authorization': `Bearer ${token}` } });
    if (res.ok) setStats(await res.json());
  }, [token]);

  useEffect(() => {
    const fetchInitialData = async () => {
      const headers = { 'Authorization': `Bearer ${token}` };
      
      if (user.role !== 'customer') {
        const resCust = await fetch('/api/customers', { headers });
        if (resCust.ok) setCustomers(await resCust.json());
      }
      if (user.role === 'staff' || user.role === 'employee') {
    const resCust = await fetch('/api/employee', { headers });
    if (resCust.ok) {
      const data = await resCust.json();
      console.log("Customers:", data); // DEBUG
      setCustomers(data);
  }
}
      if (user.role === 'admin') {
        const resEmp = await fetch('/api/admin/employees', { headers });
        if (resEmp.ok) setEmployees(await resEmp.json());
        
        fetchRoutes();
        fetchUsers();
        fetchStats();
      }
      
      if (user.role === 'customer') {
        const resShip = await fetch('/api/my-shipments', { headers });
        if (resShip.ok) setMyShipments(await resShip.json());
      }
    };
    fetchInitialData();
  }, [token, user.role, fetchRoutes, fetchUsers, fetchStats]);

  const handleRegisterShipment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const payload = {
        ...shipmentForm,
        customer_id: shipmentForm.customer_id ? parseInt(shipmentForm.customer_id) : null,
        weight_kg: shipmentForm.weight_kg ? parseFloat(shipmentForm.weight_kg) : 0
      };
      
      console.log("Submitting shipment payload:", payload);

      const res = await fetch('/api/shipments', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to register shipment');
      setMessage({ type: 'success', text: `Shipment registered! Tracking ID: ${data.tracking_id}` });
      setShipmentForm({ 
        customer_id: '', 
        receiver_name: '', 
        receiver_phone: '', 
        receiver_address: '', 
        courier_type: 'Standard', 
        origin: '', 
        destination: '', 
        weight_kg: '', 
        eta: '' 
      });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const trackRes = await fetch(`/api/track/${updateForm.tracking_id}`);
      if (!trackRes.ok) throw new Error('Shipment not found');
      const trackData = await trackRes.json();

      const res = await fetch('/api/status/update', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          shipment_id: trackData.shipment.shipment_id,
          status: updateForm.status,
          remarks: updateForm.remarks
        })
      });
      if (!res.ok) throw new Error('Failed to update status');
      setMessage({ type: 'success', text: 'Status updated successfully!' });
      setUpdateForm({ tracking_id: '', status: 'In Transit', remarks: '' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleRouteSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const url = editingRouteId ? `/api/admin/routes/${editingRouteId}` : '/api/admin/routes';
      const method = editingRouteId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(routeForm)
      });
      if (!res.ok) throw new Error('Failed to save route');
      setMessage({ type: 'success', text: editingRouteId ? 'Route updated!' : 'Route added!' });
      setRouteForm({ route_name: '', origin_city: '', destination_city: '', estimated_days: '' });
      setEditingRouteId(null);
      fetchRoutes();
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRoute = async (routeId) => {
    if (!window.confirm('Are you sure you want to delete this route?')) return;
    try {
      const res = await fetch(`/api/admin/routes/${routeId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to delete route');
      setMessage({ type: 'success', text: 'Route deleted!' });
      fetchRoutes();
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    }
  };

  const handleEditRoute = (route) => {
    setRouteForm({
      route_name: route.route_name,
      origin_city: route.origin_city,
      destination_city: route.destination_city,
      estimated_days: route.estimated_days
    });
    setEditingRouteId(route.route_id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRegisterUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await fetch('/api/admin/register-user', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(registerUserForm)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to register user');
      setMessage({ type: 'success', text: `${registerUserForm.role.toUpperCase()} registered successfully!` });
      setRegisterUserForm({
        email: '', password: '', role: 'customer', name: '', phone: '', address: '', assigned_route: '', employee_role: ''
      });
      if (user.role === 'admin') {
        fetchUsers();
        fetchStats();
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId, type) => {
    if (!window.confirm('Are you sure you want to delete this user? This will also delete related employee/customer records.')) return;
    try {
      const res = await fetch(`/api/admin/users/${userId}?type=${type}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to delete user');
      setMessage({ type: 'success', text: 'User deleted!' });
      fetchUsers();
      fetchStats();
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    }
  };

  return (
    <div className="flex-1 bg-slate-50 py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-8">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter text-clms-primary">Command Center</h1>
            <p className="text-clms-grey font-medium mt-2">Authorized Operator: <span className="text-clms-secondary font-black">{user.name}</span> <span className="text-[10px] bg-clms-primary text-white px-2 py-0.5 rounded-full ml-2 uppercase tracking-widest">{user.role}</span></p>
          </div>
          <div className="flex bg-white rounded-sm shadow-xl p-1.5 border border-slate-200 overflow-x-auto">
            {user.role === 'admin' && (
              <button 
                onClick={() => setActiveTab('summary')}
                className={cn(
                  "px-8 py-3 font-black text-xs uppercase tracking-widest transition-all rounded-sm flex items-center gap-2 whitespace-nowrap",
                  activeTab === 'summary' ? "bg-clms-primary text-white shadow-lg" : "text-clms-grey hover:text-clms-primary"
                )}
              >
                <BarChart3 size={16} /> Summary
              </button>
            )}
            {user.role === 'customer' && (
              <button 
                onClick={() => setActiveTab('my-shipments')}
                className={cn(
                  "px-8 py-3 font-black text-xs uppercase tracking-widest transition-all rounded-sm flex items-center gap-2 whitespace-nowrap",
                  activeTab === 'my-shipments' ? "bg-clms-primary text-white shadow-lg" : "text-clms-grey hover:text-clms-primary"
                )}
              >
                <Package size={16} /> My Shipments
              </button>
            )}
            {user.role !== 'customer' && (
              <>
                <button 
                  onClick={() => setActiveTab('register')}
                  className={cn(
                    "px-8 py-3 font-black text-xs uppercase tracking-widest transition-all rounded-sm flex items-center gap-2 whitespace-nowrap",
                    activeTab === 'register' ? "bg-clms-primary text-white shadow-lg" : "text-clms-grey hover:text-clms-primary"
                  )}
                >
                  <Package size={16} /> New Shipment
                </button>
                <button 
                  onClick={() => setActiveTab('register-user')}
                  className={cn(
                    "px-8 py-3 font-black text-xs uppercase tracking-widest transition-all rounded-sm flex items-center gap-2 whitespace-nowrap",
                    activeTab === 'register-user' ? "bg-clms-primary text-white shadow-lg" : "text-clms-grey hover:text-clms-primary"
                  )}
                >
                  <UserPlus size={16} /> {user.role === 'admin' ? 'Register User' : 'Register Customer'}
                </button>
                <button 
                  onClick={() => setActiveTab('update')}
                  className={cn(
                    "px-8 py-3 font-black text-xs uppercase tracking-widest transition-all rounded-sm flex items-center gap-2 whitespace-nowrap",
                    activeTab === 'update' ? "bg-clms-primary text-white shadow-lg" : "text-clms-grey hover:text-clms-primary"
                  )}
                >
                  <Clock size={16} /> Status Update
                </button>
              </>
            )}
            {(user.role === 'admin' )&& (
              <>
                <button 
                  onClick={() => setActiveTab('admin')}
                  className={cn(
                    "px-8 py-3 font-black text-xs uppercase tracking-widest transition-all rounded-sm flex items-center gap-2 whitespace-nowrap",
                    activeTab === 'admin' ? "bg-clms-primary text-white shadow-lg" : "text-clms-grey hover:text-clms-primary"
                  )}
                >
                  <Users size={16} /> Administration
                </button>
                <button 
                  onClick={() => setActiveTab('routes')}
                  className={cn(
                    "px-8 py-3 font-black text-xs uppercase tracking-widest transition-all rounded-sm flex items-center gap-2 whitespace-nowrap",
                    activeTab === 'routes' ? "bg-clms-primary text-white shadow-lg" : "text-clms-grey hover:text-clms-primary"
                  )}
                >
                  <Map size={16} /> Routes
                </button>
              </>
            )}
          </div>
        </div>
        {(user.role === 'staff' || user.role === 'employee') && (
          <button 
            onClick={() => setActiveTab('customers')}
            className={cn(
              "px-8 py-3 font-black text-xs uppercase tracking-widest transition-all rounded-sm flex items-center gap-2 whitespace-nowrap",
              activeTab === 'customers'
                ? "bg-clms-primary text-white shadow-lg"
                : "text-clms-grey hover:text-clms-primary"
            )}
          >
            <Users size={16} /> Customers
          </button>
        )
        }
        {message.text && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "p-6 rounded-sm mb-12 font-black flex items-center gap-4 border-l-8 shadow-xl",
              message.type === 'success' ? "bg-green-50 text-green-800 border-green-500" : "bg-red-50 text-clms-secondary border-clms-secondary"
            )}
          >
            {message.type === 'success' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
            <span className="text-lg">{message.text}</span>
          </motion.div>
        )}

        <div className="bg-white shadow-2xl rounded-sm border border-slate-200 overflow-hidden">
          {activeTab === 'summary' && user.role === 'admin' && (
            <div className="p-12">
              <h3 className="font-black uppercase text-2xl tracking-tight mb-8 flex items-center gap-3 text-clms-primary">
                <BarChart3 className="text-clms-secondary" /> Operations Summary
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="bg-slate-50 p-8 rounded-sm border border-slate-100">
                  <p className="text-[10px] font-black text-clms-grey uppercase tracking-widest mb-2">Today's Shipments</p>
                  <p className="text-4xl font-black text-clms-primary">{stats.todayShipments}</p>
                </div>
                <div className="bg-slate-50 p-8 rounded-sm border border-slate-100">
                  <p className="text-[10px] font-black text-clms-grey uppercase tracking-widest mb-2">Total Employees</p>
                  <p className="text-4xl font-black text-clms-primary">{stats.employees}</p>
                </div>
                <div className="bg-slate-50 p-8 rounded-sm border border-slate-100">
                  <p className="text-[10px] font-black text-clms-grey uppercase tracking-widest mb-2">Total Customers</p>
                  <p className="text-4xl font-black text-clms-primary">{stats.customers}</p>
                </div>
                <div className="bg-slate-50 p-8 rounded-sm border border-slate-100">
                  <p className="text-[10px] font-black text-clms-grey uppercase tracking-widest mb-2">Total Routes</p>
                  <p className="text-4xl font-black text-clms-primary">{stats.routes}</p>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'customers' && (user.role === 'staff' || user.role === 'employee') && (
  <div className="p-12">
    <h3 className="font-black uppercase text-2xl tracking-tight mb-8 text-clms-primary">
      Customer Details
    </h3>

    {customers.length === 0 ? (
      <p>No customers found</p>
    ) : (
      <div className="overflow-x-auto border border-slate-100 rounded-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b">
              <th className="p-4">ID</th>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Phone</th>
              <th className="p-4">Address</th>
            </tr>
          </thead>
          <tbody>
            {customers.map(c => (
              <tr key={c.customer_id} className="border-b">
                <td className="p-4">{c.customer_id}</td>
                <td className="p-4">{c.name}</td>
                <td className="p-4">{c.email}</td>
                <td className="p-4">{c.phone}</td>
                <td className="p-4">{c.address}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
)}
          {activeTab === 'my-shipments' && user.role === 'customer' && (
            <div className="p-12">
              <h3 className="font-black uppercase text-2xl tracking-tight mb-8 flex items-center gap-3 text-clms-primary">
                <Package className="text-clms-secondary" /> My Active Manifests
              </h3>
              {myShipments.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 rounded-sm border-2 border-dashed border-slate-200">
                  <Package size={48} className="mx-auto text-slate-300 mb-4" />
                  <p className="text-clms-grey font-bold">No shipments found in your account.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {myShipments.map(ship => (
                    <Link key={ship.shipment_id} to={`/track/${ship.tracking_id}`} className="block bg-white p-8 border-2 border-slate-100 rounded-sm hover:border-clms-secondary transition-all group shadow-sm hover:shadow-xl">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <p className="text-[10px] font-black text-clms-grey uppercase tracking-widest mb-1">Tracking ID</p>
                          <h4 className="text-xl font-black text-clms-primary group-hover:text-clms-secondary transition-colors">{ship.tracking_id}</h4>
                        </div>
                        <span className="bg-clms-primary text-white text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest">
                          {ship.current_status || 'Pending'}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                          <p className="text-[10px] font-black text-clms-grey uppercase tracking-widest mb-1">From</p>
                          <p className="font-bold text-sm truncate">{ship.origin}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-clms-grey uppercase tracking-widest mb-1">To</p>
                          <p className="font-bold text-sm truncate">{ship.destination}</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                        <span className="text-xs font-bold text-clms-grey italic">{ship.shipment_date}</span>
                        <div className="flex items-center gap-1 text-clms-secondary font-black text-xs uppercase tracking-widest">
                          View Details <ChevronRight size={14} />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'register' && user.role !== 'customer' && (
            <div className="p-12">
              <form onSubmit={handleRegisterShipment} className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                <div className="space-y-10">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 bg-clms-primary text-white flex items-center justify-center font-black rounded-sm italic">01</div>
                    <h3 className="font-black uppercase text-xl tracking-tight">Entity Selection</h3>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-xs font-black uppercase text-clms-grey tracking-widest mb-2">Sender (Customer)</label>
                      <select 
                        required
                        className="w-full border-2 border-slate-100 bg-slate-50 h-14 px-5 focus:border-clms-secondary outline-none font-bold text-clms-primary"
                        value={shipmentForm.customer_id}
                        onChange={(e) => {
                          setShipmentForm({...shipmentForm, customer_id: e.target.value});
                        }}
                      >
                        <option value="">Select registered customer...</option>
                        {customers.map(c => <option key={c.customer_id} value={c.customer_id}>{c.name} ({c.email})</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase text-clms-grey tracking-widest mb-2">Receiver Name</label>
                      <input 
                        type="text" required
                        placeholder="Full name of consignee"
                        className="w-full border-2 border-slate-100 bg-slate-50 h-14 px-5 focus:border-clms-secondary outline-none font-bold text-clms-primary"
                        value={shipmentForm.receiver_name}
                        onChange={(e) => setShipmentForm({...shipmentForm, receiver_name: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-black uppercase text-clms-grey tracking-widest mb-2">Receiver Phone</label>
                        <input 
                          type="text" required
                          placeholder="Phone number"
                          className="w-full border-2 border-slate-100 bg-slate-50 h-14 px-5 focus:border-clms-secondary outline-none font-bold text-clms-primary"
                          value={shipmentForm.receiver_phone}
                          onChange={(e) => setShipmentForm({...shipmentForm, receiver_phone: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-black uppercase text-clms-grey tracking-widest mb-2">Receiver Address</label>
                        <input 
                          type="text" required
                          placeholder="Delivery address"
                          className="w-full border-2 border-slate-100 bg-slate-50 h-14 px-5 focus:border-clms-secondary outline-none font-bold text-clms-primary"
                          value={shipmentForm.receiver_address}
                          onChange={(e) => setShipmentForm({...shipmentForm, receiver_address: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-black uppercase text-clms-grey tracking-widest mb-2">Service Type</label>
                        <select 
                          className="w-full border-2 border-slate-100 bg-slate-50 h-14 px-5 focus:border-clms-secondary outline-none font-bold text-clms-primary"
                          value={shipmentForm.courier_type}
                          onChange={(e) => setShipmentForm({...shipmentForm, courier_type: e.target.value})}
                        >
                          <option>Standard</option>
                          <option>Express</option>
                          <option>Fragile</option>
                          <option>Document</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-black uppercase text-clms-grey tracking-widest mb-2">Weight (KG)</label>
                        <input 
                          type="number" step="0.01" required
                          className="w-full border-2 border-slate-100 bg-slate-50 h-14 px-5 focus:border-clms-secondary outline-none font-bold text-clms-primary"
                          value={shipmentForm.weight_kg}
                          onChange={(e) => setShipmentForm({...shipmentForm, weight_kg: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-10">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 bg-clms-primary text-white flex items-center justify-center font-black rounded-sm italic">02</div>
                    <h3 className="font-black uppercase text-xl tracking-tight">Logistics Routing</h3>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-xs font-black uppercase text-clms-grey tracking-widest mb-2">Origin Point</label>
                      <input 
                        type="text" required
                        placeholder="City, Country"
                        className="w-full border-2 border-slate-100 bg-slate-50 h-14 px-5 focus:border-clms-secondary outline-none font-bold text-clms-primary"
                        value={shipmentForm.origin}
                        onChange={(e) => setShipmentForm({...shipmentForm, origin: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase text-clms-grey tracking-widest mb-2">Destination Point</label>
                      <input 
                        type="text" required
                        placeholder="City, Country"
                        className="w-full border-2 border-slate-100 bg-slate-50 h-14 px-5 focus:border-clms-secondary outline-none font-bold text-clms-primary"
                        value={shipmentForm.destination}
                        onChange={(e) => setShipmentForm({...shipmentForm, destination: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase text-clms-grey tracking-widest mb-2">Target Delivery Date</label>
                      <input 
                        type="date" required
                        className="w-full border-2 border-slate-100 bg-slate-50 h-14 px-5 focus:border-clms-secondary outline-none font-bold text-clms-primary"
                        value={shipmentForm.eta}
                        onChange={(e) => setShipmentForm({...shipmentForm, eta: e.target.value})}
                      />
                    </div>
                    <div className="pt-6">
                      <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-clms-secondary text-white h-16 font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-2xl disabled:opacity-50"
                      >
                        {loading ? 'Processing...' : 'Authorize Shipment'}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'register-user' && user.role !== 'customer' && (
            <div className="p-12 max-w-4xl mx-auto">
              <form onSubmit={handleRegisterUser} className="space-y-10">
                <div className="text-center mb-12">
                  <h3 className="font-black uppercase text-3xl tracking-tighter text-clms-primary">
                    {user.role === 'admin' ? 'Personnel Registration' : 'Customer Onboarding'}
                  </h3>
                  <p className="text-clms-grey font-medium mt-2">Create new secure accounts for the logistics network</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-xs font-black uppercase text-clms-grey tracking-widest mb-2">Full Name</label>
                    <input 
                      type="text" required
                      className="w-full border-2 border-slate-100 bg-slate-50 h-14 px-5 focus:border-clms-secondary outline-none font-bold text-clms-primary"
                      value={registerUserForm.name}
                      onChange={(e) => setRegisterUserForm({...registerUserForm, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase text-clms-grey tracking-widest mb-2">Email Address</label>
                    <input 
                      type="email" required
                      className="w-full border-2 border-slate-100 bg-slate-50 h-14 px-5 focus:border-clms-secondary outline-none font-bold text-clms-primary"
                      value={registerUserForm.email}
                      onChange={(e) => setRegisterUserForm({...registerUserForm, email: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase text-clms-grey tracking-widest mb-2">Password</label>
                    <input 
                      type="password" required
                      className="w-full border-2 border-slate-100 bg-slate-50 h-14 px-5 focus:border-clms-secondary outline-none font-bold text-clms-primary"
                      value={registerUserForm.password}
                      onChange={(e) => setRegisterUserForm({...registerUserForm, password: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase text-clms-grey tracking-widest mb-2">Phone Number</label>
                    <input 
                      type="text" required
                      className="w-full border-2 border-slate-100 bg-slate-50 h-14 px-5 focus:border-clms-secondary outline-none font-bold text-clms-primary"
                      value={registerUserForm.phone}
                      onChange={(e) => setRegisterUserForm({...registerUserForm, phone: e.target.value})}
                    />
                  </div>
                  {user.role === 'admin' && (
                    <div>
                      <label className="block text-xs font-black uppercase text-clms-grey tracking-widest mb-2">Account Role</label>
                      <select 
                        className="w-full border-2 border-slate-100 bg-slate-50 h-14 px-5 focus:border-clms-secondary outline-none font-bold text-clms-primary"
                        value={registerUserForm.role}
                        onChange={(e) => setRegisterUserForm({...registerUserForm, role: e.target.value})}
                      >
                        <option value="customer">Customer</option>
                        <option value="staff">Staff / Employee</option>
                        <option value="admin">Administrator</option>
                      </select>
                    </div>
                  )}
                  {registerUserForm.role === 'customer' ? (
                    <div className="md:col-span-2">
                      <label className="block text-xs font-black uppercase text-clms-grey tracking-widest mb-2">Physical Address</label>
                      <input 
                        type="text" required
                        className="w-full border-2 border-slate-100 bg-slate-50 h-14 px-5 focus:border-clms-secondary outline-none font-bold text-clms-primary"
                        value={registerUserForm.address}
                        onChange={(e) => setRegisterUserForm({...registerUserForm, address: e.target.value})}
                      />
                    </div>
                  ) : (
                    <>
                      <div>
                        <label className="block text-xs font-black uppercase text-clms-grey tracking-widest mb-2">Employee Role / Title</label>
                        <input 
                          type="text" placeholder="e.g. Dispatcher, Driver"
                          className="w-full border-2 border-slate-100 bg-slate-50 h-14 px-5 focus:border-clms-secondary outline-none font-bold text-clms-primary"
                          value={registerUserForm.employee_role}
                          onChange={(e) => setRegisterUserForm({...registerUserForm, employee_role: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-black uppercase text-clms-grey tracking-widest mb-2">Assigned Route</label>
                        <select 
                          className="w-full border-2 border-slate-100 bg-slate-50 h-14 px-5 focus:border-clms-secondary outline-none font-bold text-clms-primary"
                          value={registerUserForm.assigned_route}
                          onChange={(e) => setRegisterUserForm({...registerUserForm, assigned_route: e.target.value})}
                        >
                          <option value="">No Route Assigned</option>
                          {routes.map(r => <option key={r.route_id} value={r.route_name}>{r.route_name}</option>)}
                        </select>
                      </div>
                    </>
                  )}
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-clms-primary text-white h-16 font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-2xl disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 'Register Account'}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'update' && user.role !== 'customer' && (
            <div className="p-12 max-w-3xl mx-auto">
              <form onSubmit={handleUpdateStatus} className="space-y-10">
                <div className="text-center mb-12">
                  <h3 className="font-black uppercase text-3xl tracking-tighter text-clms-primary">Status Synchronization</h3>
                  <p className="text-clms-grey font-medium mt-2">Update real-time progress for active manifests</p>
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-clms-grey tracking-widest mb-2">Tracking ID</label>
                  <div className="relative">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-clms-secondary" size={24} />
                    <input 
                      type="text" required
                      placeholder="Enter manifest ID..."
                      className="w-full border-2 border-slate-100 bg-slate-50 h-16 pl-16 pr-6 focus:border-clms-secondary outline-none font-black text-xl text-clms-primary"
                      value={updateForm.tracking_id}
                      onChange={(e) => setUpdateForm({...updateForm, tracking_id: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-xs font-black uppercase text-clms-grey tracking-widest mb-2">New Milestone</label>
                    <select 
                      className="w-full border-2 border-slate-100 bg-slate-50 h-16 px-6 focus:border-clms-secondary outline-none font-black text-lg text-clms-primary"
                      value={updateForm.status}
                      onChange={(e) => setUpdateForm({...updateForm, status: e.target.value})}
                    >
                      <option>In Transit</option>
                      <option>Out for Delivery</option>
                      <option>Delivered</option>
                      <option>Delayed</option>
                      <option>Returned</option>
                      <option>Held at Customs</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase text-clms-grey tracking-widest mb-2">Location / Remarks</label>
                    <input 
                      type="text" required
                      placeholder="e.g. London Gateway Hub"
                      className="w-full border-2 border-slate-100 bg-slate-50 h-16 px-6 focus:border-clms-secondary outline-none font-bold text-clms-primary"
                      value={updateForm.remarks}
                      onChange={(e) => setUpdateForm({...updateForm, remarks: e.target.value})}
                    />
                  </div>
                </div>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-clms-primary text-white h-16 font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-2xl disabled:opacity-50"
                >
                  {loading ? 'Synchronizing...' : 'Post Update'}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'admin' && (user.role === 'admin'||user.role==='staff'||user.role==='employee') && (
            <div className="p-12 space-y-16">
              <div>
                <h3 className="font-black uppercase text-2xl tracking-tight mb-8 flex items-center gap-3">
                  <Users className="text-clms-secondary" /> System Users
                </h3>
                <div className="overflow-x-auto border border-slate-100 rounded-sm">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100">
                        <th className="p-4 text-xs font-black uppercase tracking-widest text-clms-grey">ID</th>
                        <th className="p-4 text-xs font-black uppercase tracking-widest text-clms-grey">Name</th>
                        <th className="p-4 text-xs font-black uppercase tracking-widest text-clms-grey">Email</th>
                        <th className="p-4 text-xs font-black uppercase tracking-widest text-clms-grey">Role</th>
                        <th className="p-4 text-xs font-black uppercase tracking-widest text-clms-grey text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(u => (
                        <tr key={`${u.type}-${u.id}`} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                          <td className="p-4 font-bold text-clms-primary">#{u.id}</td>
                          <td className="p-4 font-black">{u.name}</td>
                          <td className="p-4 text-clms-grey font-medium">{u.email}</td>
                          <td className="p-4">
                            <span className={cn(
                              "px-3 py-1 rounded-full text-[10px] font-black uppercase",
                              u.role === 'admin' ? "bg-clms-primary text-white" : 
                              u.role === 'staff' ? "bg-clms-secondary text-white" : "bg-slate-100 text-clms-grey"
                            )}>
                              {u.role}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            {(u.id !== user.id || u.type !== (user.role === 'customer' ? 'customer' : 'employee')) && (
                              <button 
                                onClick={() => handleDeleteUser(u.id, u.type)}
                                className="p-2 text-clms-grey hover:text-clms-secondary hover:bg-red-50 rounded-sm transition-all"
                                title="Delete User"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h3 className="font-black uppercase text-2xl tracking-tight mb-8 flex items-center gap-3">
                  <Users className="text-clms-secondary" /> Personnel Details
                </h3>
                <div className="overflow-x-auto border border-slate-100 rounded-sm">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100">
                        <th className="p-4 text-xs font-black uppercase tracking-widest text-clms-grey">ID</th>
                        <th className="p-4 text-xs font-black uppercase tracking-widest text-clms-grey">Name</th>
                        <th className="p-4 text-xs font-black uppercase tracking-widest text-clms-grey">Role</th>
                        <th className="p-4 text-xs font-black uppercase tracking-widest text-clms-grey">Contact</th>
                        <th className="p-4 text-xs font-black uppercase tracking-widest text-clms-grey">Assigned Route</th>
                      </tr>
                    </thead>
                    <tbody>
                      {employees.map(emp => (
                        <tr key={emp.employee_id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                          <td className="p-4 font-bold text-clms-primary">#{emp.employee_id}</td>
                          <td className="p-4 font-black">{emp.name}</td>
                          <td className="p-4"><span className="bg-slate-100 px-3 py-1 rounded-full text-[10px] font-black uppercase">{emp.role}</span></td>
                          <td className="p-4 text-clms-grey font-medium">{emp.phone}</td>
                          <td className="p-4 font-bold text-clms-accent">{emp.assigned_route || 'Unassigned'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h3 className="font-black uppercase text-2xl tracking-tight mb-8 flex items-center gap-3">
                  <Users className="text-clms-secondary" /> Customer Details
                </h3>
                <div className="overflow-x-auto border border-slate-100 rounded-sm">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100">
                        <th className="p-4 text-xs font-black uppercase tracking-widest text-clms-grey">ID</th>
                        <th className="p-4 text-xs font-black uppercase tracking-widest text-clms-grey">Name</th>
                        <th className="p-4 text-xs font-black uppercase tracking-widest text-clms-grey">Email</th>
                        <th className="p-4 text-xs font-black uppercase tracking-widest text-clms-grey">Phone</th>
                        <th className="p-4 text-xs font-black uppercase tracking-widest text-clms-grey">Address</th>
                      </tr>
                    </thead>
                    <tbody>
                      {customers.map(cust => (
                        <tr key={cust.customer_id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                          <td className="p-4 font-bold text-clms-primary">#{cust.customer_id}</td>
                          <td className="p-4 font-black">{cust.name}</td>
                          <td className="p-4 text-clms-grey font-medium">{cust.email}</td>
                          <td className="p-4 text-clms-grey font-medium">{cust.phone}</td>
                          <td className="p-4 font-bold text-sm">{cust.address}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'routes' && user.role === 'admin' && (
            <div className="p-12 space-y-16">
              <div>
                <div className="flex justify-between items-center mb-8">
                  <h3 className="font-black uppercase text-2xl tracking-tight flex items-center gap-3">
                    <Map className="text-clms-secondary" /> Network Routes
                  </h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-12">
                  <div className="lg:col-span-1 bg-slate-50 p-8 rounded-sm border border-slate-100">
                    <h4 className="font-black uppercase text-sm tracking-widest mb-6 text-clms-primary">
                      {editingRouteId ? 'Edit Route' : 'Add New Route'}
                    </h4>
                    <form onSubmit={handleRouteSubmit} className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-black uppercase text-clms-grey tracking-widest mb-1">Route Name</label>
                        <input 
                          type="text" required placeholder="e.g. Route-003"
                          className="w-full border-2 border-white bg-white h-12 px-4 focus:border-clms-secondary outline-none font-bold text-sm"
                          value={routeForm.route_name}
                          onChange={(e) => setRouteForm({...routeForm, route_name: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase text-clms-grey tracking-widest mb-1">Origin City</label>
                        <input 
                          type="text" required placeholder="e.g. Chennai"
                          className="w-full border-2 border-white bg-white h-12 px-4 focus:border-clms-secondary outline-none font-bold text-sm"
                          value={routeForm.origin_city}
                          onChange={(e) => setRouteForm({...routeForm, origin_city: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase text-clms-grey tracking-widest mb-1">Destination City</label>
                        <input 
                          type="text" required placeholder="e.g. Bangalore"
                          className="w-full border-2 border-white bg-white h-12 px-4 focus:border-clms-secondary outline-none font-bold text-sm"
                          value={routeForm.destination_city}
                          onChange={(e) => setRouteForm({...routeForm, destination_city: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase text-clms-grey tracking-widest mb-1">Est. Days</label>
                        <input 
                          type="number" required
                          className="w-full border-2 border-white bg-white h-12 px-4 focus:border-clms-secondary outline-none font-bold text-sm"
                          value={routeForm.estimated_days}
                          onChange={(e) => setRouteForm({...routeForm, estimated_days: e.target.value})}
                        />
                      </div>
                      <div className="flex gap-2 pt-2">
                        <button 
                          type="submit"
                          className="flex-1 bg-clms-primary text-white h-12 font-black uppercase tracking-widest text-xs hover:bg-slate-800 transition-all"
                        >
                          {editingRouteId ? 'Update' : 'Add Route'}
                        </button>
                        {editingRouteId && (
                          <button 
                            type="button"
                            onClick={() => {
                              setEditingRouteId(null);
                              setRouteForm({ route_name: '', origin_city: '', destination_city: '', estimated_days: '' });
                            }}
                            className="px-4 bg-slate-200 text-clms-grey h-12 font-black uppercase tracking-widest text-xs hover:bg-slate-300 transition-all"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </form>
                  </div>


                  <div className="lg:col-span-2">
                    <div className="overflow-x-auto border border-slate-100 rounded-sm">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-100">
                            <th className="p-4 text-xs font-black uppercase tracking-widest text-clms-grey">Route</th>
                            <th className="p-4 text-xs font-black uppercase tracking-widest text-clms-grey">Path</th>
                            <th className="p-4 text-xs font-black uppercase tracking-widest text-clms-grey">Days</th>
                            <th className="p-4 text-xs font-black uppercase tracking-widest text-clms-grey text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {routes.map(route => (
                            <tr key={route.route_id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                              <td className="p-4 font-black text-clms-primary">{route.route_name}</td>
                              <td className="p-4">
                                <div className="flex items-center gap-2 text-xs font-bold">
                                  <span>{route.origin_city}</span>
                                  <ChevronRight size={12} className="text-clms-secondary" />
                                  <span>{route.destination_city}</span>
                                </div>
                              </td>
                              <td className="p-4 font-black text-clms-accent text-sm">{route.estimated_days}</td>
                              <td className="p-4 text-right">
                                <div className="flex justify-end gap-2">
                                  <button 
                                    onClick={() => handleEditRoute(route)}
                                    className="p-2 text-clms-grey hover:text-clms-primary hover:bg-slate-100 rounded-sm transition-all"
                                    title="Edit Route"
                                  >
                                    <Edit2 size={16} />
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteRoute(route.route_id)}
                                    className="p-2 text-clms-grey hover:text-clms-secondary hover:bg-red-50 rounded-sm transition-all"
                                    title="Delete Route"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
          )}
        </div>
      </div>
    </div>


  );
};

// --- Main App ---

export default function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('clms_token'));

  useEffect(() => {
    const savedUser = localStorage.getItem('clms_user');
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
  }, [token]);

  const handleLogin = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('clms_token', userToken);
    localStorage.setItem('clms_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('clms_token');
    localStorage.removeItem('clms_user');
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col font-sans text-slate-900 bg-white">
        <Navbar user={user} onLogout={handleLogout} />
        
        <main className="flex-1 flex flex-col">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/track/:trackingId" element={<TrackingResult />} />
            <Route path="/login" element={<Login onLogin={handleLogin} user={user} />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute user={user} token={token}>
                  <Dashboard user={user} token={token} />
                </ProtectedRoute>
              } 
            />
            <Route path="/ship" element={
              user ? (
                <div className="flex-1 flex flex-col items-center justify-center py-20 px-4 text-center bg-slate-50">
                  <Package size={64} className="text-clms-secondary mb-6" />
                  <h2 className="text-4xl font-black uppercase tracking-tighter mb-4">Ready to Ship?</h2>
                  <p className="text-clms-grey max-w-md mx-auto mb-8 font-medium">You are already authenticated. Proceed to your command center to register new manifests.</p>
                  <Link to="/dashboard" className="bg-clms-primary text-white px-10 py-4 font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl">
                    Go to Dashboard
                  </Link>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center py-32 px-4 bg-slate-50">
                  <div className="max-w-2xl text-center">
                    <div className="w-24 h-24 bg-clms-primary text-clms-secondary flex items-center justify-center rounded-sm mx-auto mb-8 shadow-2xl transform -rotate-12">
                      <Package size={48} />
                    </div>
                    <h2 className="text-5xl font-black mb-6 uppercase tracking-tighter">Global Shipping</h2>
                    <p className="text-xl text-clms-grey mb-12 font-medium">Access our premium logistics network. Please authenticate to create new manifests and manage global shipments.</p>
                    <Link to="/login" className="bg-clms-primary text-white px-12 py-5 font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-2xl">
                      Partner Login
                    </Link>
                  </div>
                </div>
              )
            } />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}
