import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import { Search, Package, User, LogIn, LogOut, ChevronRight, MapPin, Calendar, Weight, Info, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';

// --- Types ---
interface UserData {
  id: number;
  email: string;
  role: 'admin' | 'staff' | 'customer';
  name: string;
}

interface Shipment {
  shipment_id: number;
  tracking_id: string;
  customer_name: string;
  receiver_name: string;
  courier_type: string;
  origin: string;
  destination: string;
  weight_kg: number;
  shipment_date: string;
  eta: string;
}

interface StatusUpdate {
  status_id: number;
  status: string;
  updated_at: string;
  remarks: string;
}

// --- Components ---

const Navbar = ({ user, onLogout }: { user: UserData | null; onLogout: () => void }) => (
  <nav className="bg-dhl-yellow border-b border-black/10 sticky top-0 z-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between h-16 items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-dhl-red text-white font-black text-2xl px-3 py-1 italic tracking-tighter">DHL</div>
          <span className="hidden sm:inline-block font-bold text-dhl-red uppercase tracking-widest text-xs">Express & Logistics</span>
        </Link>
        
        <div className="flex items-center gap-6">
          <Link to="/" className="text-sm font-bold hover:text-dhl-red transition-colors">Track</Link>
          <Link to="/ship" className="text-sm font-bold hover:text-dhl-red transition-colors">Ship</Link>
          {user ? (
            <div className="flex items-center gap-4">
              <Link to="/dashboard" className="flex items-center gap-2 text-sm font-bold bg-white/50 px-3 py-1.5 rounded-full hover:bg-white transition-colors">
                <User size={16} />
                <span>{user.name}</span>
              </Link>
              <button onClick={onLogout} className="text-sm font-bold text-dhl-red hover:underline flex items-center gap-1">
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <Link to="/login" className="flex items-center gap-2 text-sm font-bold bg-dhl-red text-white px-4 py-2 rounded-sm hover:bg-red-700 transition-colors shadow-md">
              <LogIn size={16} />
              <span>Customer Portal</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  </nav>
);

const Footer = () => (
  <footer className="bg-dhl-grey text-white py-12 mt-auto">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="bg-white text-dhl-red font-black text-xl px-2 py-0.5 italic inline-block mb-4">DHL</div>
          <p className="text-gray-400 text-sm">Excellence. Simply delivered.</p>
        </div>
        <div>
          <h4 className="font-bold mb-4 text-dhl-yellow">Help Center</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><a href="#" className="hover:text-white">Customer Service</a></li>
            <li><a href="#" className="hover:text-white">Track & Trace</a></li>
            <li><a href="#" className="hover:text-white">Contact Us</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4 text-dhl-yellow">About Us</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><a href="#" className="hover:text-white">DHL Group</a></li>
            <li><a href="#" className="hover:text-white">Sustainability</a></li>
            <li><a href="#" className="hover:text-white">Careers</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4 text-dhl-yellow">Follow Us</h4>
          <div className="flex gap-4">
            <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-dhl-yellow hover:text-black transition-all cursor-pointer">f</div>
            <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-dhl-yellow hover:text-black transition-all cursor-pointer">t</div>
            <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-dhl-yellow hover:text-black transition-all cursor-pointer">in</div>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 mt-12 pt-8 text-xs text-gray-500 flex flex-col md:flex-row justify-between gap-4">
        <p>© 2026 DHL International GmbH. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-white">Privacy Policy</a>
          <a href="#" className="hover:text-white">Terms of Use</a>
          <a href="#" className="hover:text-white">Cookie Settings</a>
        </div>
      </div>
    </div>
  </footer>
);

const Home = () => {
  const [trackingId, setTrackingId] = useState('');
  const navigate = useNavigate();

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingId.trim()) {
      navigate(`/track/${trackingId.trim()}`);
    }
  };

  return (
    <div className="flex-1">
      {/* Hero Section */}
      <div className="relative h-[500px] bg-black overflow-hidden">
        <img 
          src="https://picsum.photos/seed/logistics/1920/1080" 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
          alt="Logistics background"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" />
        
        <div className="relative max-w-7xl mx-auto px-4 h-full flex flex-col justify-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-2xl"
          >
            <h1 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
              TRACK YOUR <br />
              <span className="text-dhl-yellow italic">SHIPMENT</span>
            </h1>
            <p className="text-xl text-gray-200 mb-8 font-medium">
              Real-time updates for your global logistics. Enter your tracking number below.
            </p>
            
            <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="text" 
                  placeholder="Tracking Number (e.g. DHL123...)" 
                  className="w-full bg-white h-14 pl-12 pr-4 rounded-sm text-lg font-bold focus:outline-none focus:ring-4 focus:ring-dhl-yellow/50 transition-all"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                />
              </div>
              <button 
                type="submit"
                className="bg-dhl-red text-white px-8 h-14 font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg flex items-center justify-center gap-2"
              >
                Track Now <ChevronRight size={20} />
              </button>
            </form>
          </motion.div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 border-t-4 border-dhl-red shadow-sm hover:shadow-xl transition-all group">
            <Package className="text-dhl-red mb-6 group-hover:scale-110 transition-transform" size={48} />
            <h3 className="text-xl font-black mb-4 uppercase">Express Shipping</h3>
            <p className="text-gray-600 mb-6">Time-critical international and domestic shipping services for businesses and individuals.</p>
            <Link to="/ship" className="text-dhl-red font-bold flex items-center gap-1 hover:underline">
              Start Shipping <ChevronRight size={16} />
            </Link>
          </div>
          <div className="bg-white p-8 border-t-4 border-dhl-yellow shadow-sm hover:shadow-xl transition-all group">
            <MapPin className="text-dhl-yellow mb-6 group-hover:scale-110 transition-transform" size={48} />
            <h3 className="text-xl font-black mb-4 uppercase">Global Logistics</h3>
            <p className="text-gray-600 mb-6">Comprehensive supply chain solutions tailored to your industry and business needs.</p>
            <a href="#" className="text-dhl-red font-bold flex items-center gap-1 hover:underline">
              Explore Solutions <ChevronRight size={16} />
            </a>
          </div>
          <div className="bg-white p-8 border-t-4 border-black shadow-sm hover:shadow-xl transition-all group">
            <User className="text-black mb-6 group-hover:scale-110 transition-transform" size={48} />
            <h3 className="text-xl font-black mb-4 uppercase">Business Portal</h3>
            <p className="text-gray-600 mb-6">Manage your shipments, invoices, and reports in one centralized dashboard.</p>
            <Link to="/login" className="text-dhl-red font-bold flex items-center gap-1 hover:underline">
              Login to Portal <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const TrackingResult = () => {
  const { trackingId } = useParams();
  const [data, setData] = useState<{ shipment: Shipment; history: StatusUpdate[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTracking = async () => {
      try {
        const res = await fetch(`/api/track/${trackingId}`);
        if (!res.ok) throw new Error('Shipment not found');
        const json = await res.json();
        setData(json);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTracking();
  }, [trackingId]);

  if (loading) return (
    <div className="flex-1 flex items-center justify-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dhl-red" />
    </div>
  );

  if (error) return (
    <div className="flex-1 max-w-4xl mx-auto px-4 py-20 text-center">
      <AlertCircle className="mx-auto text-dhl-red mb-4" size={64} />
      <h2 className="text-3xl font-black mb-4 uppercase">No Shipment Found</h2>
      <p className="text-gray-600 mb-8">We couldn't find any shipment matching tracking ID: <span className="font-bold">{trackingId}</span></p>
      <Link to="/" className="bg-dhl-red text-white px-8 py-3 font-bold uppercase tracking-widest hover:bg-red-700 transition-all">
        Try Again
      </Link>
    </div>
  );

  const currentStatus = data?.history[0]?.status || 'Unknown';

  return (
    <div className="flex-1 bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4">
        <div className="bg-white shadow-xl rounded-sm overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="bg-dhl-yellow p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-black/60 mb-1">Tracking Number</p>
              <h2 className="text-3xl font-black">{trackingId}</h2>
            </div>
            <div className="bg-black text-dhl-yellow px-6 py-3 rounded-sm font-black text-xl italic">
              {currentStatus.toUpperCase()}
            </div>
          </div>

          <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Details */}
            <div className="lg:col-span-2 space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <div className="bg-gray-100 p-2 rounded-sm"><MapPin className="text-dhl-red" size={20} /></div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase">Origin</p>
                    <p className="font-bold">{data?.shipment.origin}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-gray-100 p-2 rounded-sm"><MapPin className="text-green-600" size={20} /></div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase">Destination</p>
                    <p className="font-bold">{data?.shipment.destination}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-gray-100 p-2 rounded-sm"><Calendar className="text-blue-600" size={20} /></div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase">Shipment Date</p>
                    <p className="font-bold">{data?.shipment.shipment_date}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-gray-100 p-2 rounded-sm"><Clock className="text-orange-600" size={20} /></div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase">Estimated Delivery</p>
                    <p className="font-bold">{data?.shipment.eta || 'TBD'}</p>
                  </div>
                </div>
              </div>

              <hr />

              <div>
                <h3 className="text-xl font-black mb-6 uppercase flex items-center gap-2">
                  <Info size={20} className="text-dhl-red" />
                  Shipment History
                </h3>
                <div className="space-y-8 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
                  {data?.history.map((item, idx) => (
                    <div key={item.status_id} className="relative pl-12">
                      <div className={cn(
                        "absolute left-0 top-1 w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-sm z-10",
                        idx === 0 ? "bg-dhl-red text-white" : "bg-gray-200 text-gray-500"
                      )}>
                        {idx === 0 ? <CheckCircle2 size={20} /> : <Clock size={20} />}
                      </div>
                      <div>
                        <p className="text-sm text-gray-400 font-bold">{new Date(item.updated_at).toLocaleString()}</p>
                        <p className="text-lg font-black uppercase">{item.status}</p>
                        <p className="text-gray-600">{item.remarks}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar Info */}
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 border border-gray-200 rounded-sm">
                <h4 className="font-black uppercase text-sm mb-4">Shipment Info</h4>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Service</span>
                    <span className="font-bold">{data?.shipment.courier_type}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Weight</span>
                    <span className="font-bold">{data?.shipment.weight_kg} kg</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Sender</span>
                    <span className="font-bold">{data?.shipment.customer_name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Receiver</span>
                    <span className="font-bold">{data?.shipment.receiver_name}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-dhl-red text-white p-6 rounded-sm">
                <h4 className="font-black uppercase text-sm mb-2">Need Help?</h4>
                <p className="text-sm mb-4 opacity-80">Our customer service is available 24/7 for any inquiries.</p>
                <button className="w-full bg-white text-dhl-red font-bold py-2 rounded-sm hover:bg-gray-100 transition-colors">
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Login = ({ onLogin }: { onLogin: (user: UserData, token: string) => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
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
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center bg-gray-50 py-20 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white shadow-2xl rounded-sm p-10 border border-gray-200"
      >
        <div className="text-center mb-10">
          <div className="bg-dhl-red text-white font-black text-3xl px-4 py-1 italic inline-block mb-4">DHL</div>
          <h2 className="text-2xl font-black uppercase tracking-tight">Portal Login</h2>
          <p className="text-gray-500 mt-2">Access your logistics dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-dhl-red p-4 rounded-sm text-sm font-bold flex items-center gap-2 border border-red-100">
              <AlertCircle size={18} /> {error}
            </div>
          )}
          <div>
            <label className="block text-xs font-black uppercase text-gray-400 mb-1.5">Email Address</label>
            <input 
              type="email" 
              required
              className="w-full border-2 border-gray-100 bg-gray-50 h-12 px-4 focus:border-dhl-yellow focus:bg-white outline-none transition-all font-bold"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-black uppercase text-gray-400 mb-1.5">Password</label>
            <input 
              type="password" 
              required
              className="w-full border-2 border-gray-100 bg-gray-50 h-12 px-4 focus:border-dhl-yellow focus:bg-white outline-none transition-all font-bold"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-dhl-red text-white h-14 font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Login Now'}
          </button>
        </form>
        
        <div className="mt-8 pt-8 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-400">Default Admin: <span className="font-bold text-gray-600">admin@dhl.com</span> / <span className="font-bold text-gray-600">admin123</span></p>
        </div>
      </motion.div>
    </div>
  );
};

const Dashboard = ({ user, token }: { user: UserData; token: string }) => {
  const [activeTab, setActiveTab] = useState<'register' | 'update'>('register');
  const [customers, setCustomers] = useState<any[]>([]);
  const [receivers, setReceivers] = useState<any[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Form states
  const [shipmentForm, setShipmentForm] = useState({
    customer_id: '',
    receiver_id: '',
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

  useEffect(() => {
    const fetchCustomers = async () => {
      const res = await fetch('/api/customers', { headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) setCustomers(await res.json());
    };
    fetchCustomers();
  }, [token]);

  useEffect(() => {
    if (selectedCustomer) {
      const fetchReceivers = async () => {
        const res = await fetch(`/api/receivers/${selectedCustomer}`, { headers: { 'Authorization': `Bearer ${token}` } });
        if (res.ok) setReceivers(await res.json());
      };
      fetchReceivers();
    } else {
      setReceivers([]);
    }
  }, [selectedCustomer, token]);

  const handleRegisterShipment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await fetch('/api/shipments', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...shipmentForm,
          customer_id: parseInt(shipmentForm.customer_id),
          receiver_id: parseInt(shipmentForm.receiver_id),
          weight_kg: parseFloat(shipmentForm.weight_kg)
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to register shipment');
      setMessage({ type: 'success', text: `Shipment registered! Tracking ID: ${data.tracking_id}` });
      setShipmentForm({ customer_id: '', receiver_id: '', courier_type: 'Standard', origin: '', destination: '', weight_kg: '', eta: '' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      // First find shipment by tracking ID
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
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black uppercase">Dashboard</h1>
            <p className="text-gray-500">Welcome back, <span className="font-bold text-dhl-red">{user.name}</span></p>
          </div>
          <div className="flex bg-white rounded-sm shadow-sm p-1 border border-gray-200">
            <button 
              onClick={() => setActiveTab('register')}
              className={cn(
                "px-6 py-2 font-bold text-sm uppercase transition-all rounded-sm",
                activeTab === 'register' ? "bg-dhl-yellow text-black shadow-sm" : "text-gray-400 hover:text-black"
              )}
            >
              New Shipment
            </button>
            <button 
              onClick={() => setActiveTab('update')}
              className={cn(
                "px-6 py-2 font-bold text-sm uppercase transition-all rounded-sm",
                activeTab === 'update' ? "bg-dhl-yellow text-black shadow-sm" : "text-gray-400 hover:text-black"
              )}
            >
              Update Status
            </button>
          </div>
        </div>

        {message.text && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "p-4 rounded-sm mb-8 font-bold flex items-center gap-3 border",
              message.type === 'success' ? "bg-green-50 text-green-700 border-green-100" : "bg-red-50 text-dhl-red border-red-100"
            )}
          >
            {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            {message.text}
          </motion.div>
        )}

        <div className="bg-white shadow-xl rounded-sm border border-gray-200 p-8">
          {activeTab === 'register' ? (
            <form onSubmit={handleRegisterShipment} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h3 className="font-black uppercase text-lg border-b-2 border-dhl-yellow inline-block mb-2">Sender & Receiver</h3>
                <div>
                  <label className="block text-xs font-black uppercase text-gray-400 mb-1.5">Select Customer</label>
                  <select 
                    required
                    className="w-full border-2 border-gray-100 bg-gray-50 h-12 px-4 focus:border-dhl-yellow outline-none font-bold"
                    value={shipmentForm.customer_id}
                    onChange={(e) => {
                      setShipmentForm({...shipmentForm, customer_id: e.target.value});
                      setSelectedCustomer(e.target.value);
                    }}
                  >
                    <option value="">Choose a customer...</option>
                    {customers.map(c => <option key={c.customer_id} value={c.customer_id}>{c.name} ({c.email})</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-gray-400 mb-1.5">Select Receiver</label>
                  <select 
                    required
                    disabled={!selectedCustomer}
                    className="w-full border-2 border-gray-100 bg-gray-50 h-12 px-4 focus:border-dhl-yellow outline-none font-bold disabled:opacity-50"
                    value={shipmentForm.receiver_id}
                    onChange={(e) => setShipmentForm({...shipmentForm, receiver_id: e.target.value})}
                  >
                    <option value="">Choose a receiver...</option>
                    {receivers.map(r => <option key={r.receiver_id} value={r.receiver_id}>{r.name} - {r.address}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black uppercase text-gray-400 mb-1.5">Courier Type</label>
                    <select 
                      className="w-full border-2 border-gray-100 bg-gray-50 h-12 px-4 focus:border-dhl-yellow outline-none font-bold"
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
                    <label className="block text-xs font-black uppercase text-gray-400 mb-1.5">Weight (kg)</label>
                    <input 
                      type="number" step="0.01" required
                      className="w-full border-2 border-gray-100 bg-gray-50 h-12 px-4 focus:border-dhl-yellow outline-none font-bold"
                      value={shipmentForm.weight_kg}
                      onChange={(e) => setShipmentForm({...shipmentForm, weight_kg: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="font-black uppercase text-lg border-b-2 border-dhl-yellow inline-block mb-2">Route & Schedule</h3>
                <div>
                  <label className="block text-xs font-black uppercase text-gray-400 mb-1.5">Origin Address</label>
                  <input 
                    type="text" required
                    className="w-full border-2 border-gray-100 bg-gray-50 h-12 px-4 focus:border-dhl-yellow outline-none font-bold"
                    value={shipmentForm.origin}
                    onChange={(e) => setShipmentForm({...shipmentForm, origin: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-gray-400 mb-1.5">Destination Address</label>
                  <input 
                    type="text" required
                    className="w-full border-2 border-gray-100 bg-gray-50 h-12 px-4 focus:border-dhl-yellow outline-none font-bold"
                    value={shipmentForm.destination}
                    onChange={(e) => setShipmentForm({...shipmentForm, destination: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-gray-400 mb-1.5">Expected Delivery Date</label>
                  <input 
                    type="date" required
                    className="w-full border-2 border-gray-100 bg-gray-50 h-12 px-4 focus:border-dhl-yellow outline-none font-bold"
                    value={shipmentForm.eta}
                    onChange={(e) => setShipmentForm({...shipmentForm, eta: e.target.value})}
                  />
                </div>
                <div className="pt-4">
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-dhl-red text-white h-14 font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg disabled:opacity-50"
                  >
                    {loading ? 'Processing...' : 'Register Shipment'}
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <form onSubmit={handleUpdateStatus} className="max-w-2xl mx-auto space-y-8">
              <h3 className="font-black uppercase text-lg border-b-2 border-dhl-yellow inline-block mb-2">Update Shipment Progress</h3>
              <div>
                <label className="block text-xs font-black uppercase text-gray-400 mb-1.5">Tracking ID</label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input 
                    type="text" required
                    placeholder="Enter Tracking ID (e.g. DHL...)"
                    className="w-full border-2 border-gray-100 bg-gray-50 h-14 pl-12 pr-4 focus:border-dhl-yellow outline-none font-bold text-lg"
                    value={updateForm.tracking_id}
                    onChange={(e) => setUpdateForm({...updateForm, tracking_id: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-black uppercase text-gray-400 mb-1.5">New Status</label>
                <select 
                  className="w-full border-2 border-gray-100 bg-gray-50 h-14 px-4 focus:border-dhl-yellow outline-none font-bold text-lg"
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
                <label className="block text-xs font-black uppercase text-gray-400 mb-1.5">Remarks / Location</label>
                <textarea 
                  rows={4}
                  placeholder="e.g. Arrived at Mumbai Sorting Facility"
                  className="w-full border-2 border-gray-100 bg-gray-50 p-4 focus:border-dhl-yellow outline-none font-bold"
                  value={updateForm.remarks}
                  onChange={(e) => setUpdateForm({...updateForm, remarks: e.target.value})}
                />
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-dhl-red text-white h-14 font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg disabled:opacity-50"
              >
                {loading ? 'Updating...' : 'Post Status Update'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [user, setUser] = useState<UserData | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('dhl_token'));

  useEffect(() => {
    const savedUser = localStorage.getItem('dhl_user');
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
  }, [token]);

  const handleLogin = (userData: UserData, userToken: string) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('dhl_token', userToken);
    localStorage.setItem('dhl_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('dhl_token');
    localStorage.removeItem('dhl_user');
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col font-sans text-dhl-grey">
        <Navbar user={user} onLogout={handleLogout} />
        
        <main className="flex-1 flex flex-col">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/track/:trackingId" element={<TrackingResult />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route 
              path="/dashboard" 
              element={user && token ? <Dashboard user={user} token={token} /> : <Login onLogin={handleLogin} />} 
            />
            <Route path="/ship" element={
              <div className="flex-1 flex items-center justify-center py-20 px-4">
                <div className="max-w-2xl text-center">
                  <Package className="mx-auto text-dhl-yellow mb-6" size={80} />
                  <h2 className="text-4xl font-black mb-4 uppercase">Ready to Ship?</h2>
                  <p className="text-xl text-gray-600 mb-8">Please login to your business portal to create new shipments and manage your logistics.</p>
                  <Link to="/login" className="bg-dhl-red text-white px-10 py-4 font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-xl">
                    Go to Portal
                  </Link>
                </div>
              </div>
            } />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}
