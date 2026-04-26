import React, { useState, useEffect } from 'react';
import { 
  Users, 
  PlusCircle, 
  Search, 
  CreditCard, 
  TrendingUp, 
  Trash2, 
  Edit, 
  LogOut,
  LayoutDashboard,
  Settings,
  Bell,
  User
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const App = () => {
  const [customers, setCustomers] = useState(() => {
    const saved = localStorage.getItem('customers');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  
  const [formData, setFormData] = useState({
    accountNumber: '',
    name: '',
    address: '',
    phone: '',
    email: '',
    type: 'Savings',
    balance: ''
  });

  useEffect(() => {
    localStorage.setItem('customers', JSON.stringify(customers));
  }, [customers]);

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.accountNumber.toString().includes(searchTerm)
  );

  const stats = {
    totalBalance: customers.reduce((acc, c) => acc + parseFloat(c.balance || 0), 0),
    activeCustomers: customers.length,
    averageBalance: customers.length ? (customers.reduce((acc, c) => acc + parseFloat(c.balance || 0), 0) / customers.length).toFixed(2) : 0
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingCustomer) {
      setCustomers(customers.map(c => c.id === editingCustomer.id ? { ...formData, id: c.id } : c));
      setEditingCustomer(null);
    } else {
      setCustomers([...customers, { ...formData, id: Date.now() }]);
    }
    setShowModal(false);
    setFormData({ accountNumber: '', name: '', address: '', phone: '', email: '', type: 'Savings', balance: '' });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      setCustomers(customers.filter(c => c.id !== id));
    }
  };

  const startEdit = (customer) => {
    setEditingCustomer(customer);
    setFormData(customer);
    setShowModal(true);
  };

  return (
    <div className="flex min-h-screen text-slate-200 font-sans">
      {/* Sidebar */}
      <aside className="w-64 glass border-r border-slate-800 flex flex-col p-6 hidden md:flex">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
            <CreditCard className="text-white" size={24} />
          </div>
          <h1 className="text-xl font-bold tracking-tight">Billing<span className="text-primary-500">Pro</span></h1>
        </div>
        
        <nav className="flex-1 space-y-2">
          <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" active />
          <NavItem icon={<Users size={20} />} label="Customers" />
          <NavItem icon={<TrendingUp size={20} />} label="Analytics" />
          <NavItem icon={<Settings size={20} />} label="Settings" />
        </nav>

        <div className="pt-6 border-t border-slate-800">
          <button className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 md:p-12 overflow-auto">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-1">Welcome Back</h2>
            <p className="text-slate-400">Here's what's happening with your billing system today.</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-white transition-colors"><Bell size={22} /></button>
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
              <User size={20} />
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatCard 
            title="Total Balance" 
            value={`$${stats.totalBalance.toLocaleString()}`} 
            icon={<CreditCard className="text-primary-400" />}
            trend="+12.5%"
          />
          <StatCard 
            title="Active Customers" 
            value={stats.activeCustomers} 
            icon={<Users className="text-emerald-400" />}
            trend="+3 new"
          />
          <StatCard 
            title="Avg. Balance" 
            value={`$${stats.averageBalance}`} 
            icon={<TrendingUp className="text-amber-400" />}
            trend="Stable"
          />
        </div>

        {/* Action Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Search by name or account..."
              className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => {
              setEditingCustomer(null);
              setFormData({ accountNumber: '', name: '', address: '', phone: '', email: '', type: 'Savings', balance: '' });
              setShowModal(true);
            }}
            className="flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white px-6 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-primary-500/20"
          >
            <PlusCircle size={20} />
            Add Customer
          </button>
        </div>

        {/* Table */}
        <div className="glass rounded-2xl overflow-hidden border border-slate-800">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800/50 border-b border-slate-700">
                <th className="px-6 py-4 font-semibold text-slate-300">Account #</th>
                <th className="px-6 py-4 font-semibold text-slate-300">Customer</th>
                <th className="px-6 py-4 font-semibold text-slate-300">Type</th>
                <th className="px-6 py-4 font-semibold text-slate-300 text-right">Balance</th>
                <th className="px-6 py-4 font-semibold text-slate-300 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              <AnimatePresence>
                {filteredCustomers.map((customer) => (
                  <motion.tr 
                    key={customer.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="hover:bg-slate-800/30 transition-colors group"
                  >
                    <td className="px-6 py-4 text-slate-400 font-mono">#{customer.accountNumber}</td>
                    <td className="px-6 py-4">
                      <div className="font-semibold">{customer.name}</div>
                      <div className="text-xs text-slate-500">{customer.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        customer.type === 'Savings' ? 'bg-primary-500/10 text-primary-400' : 'bg-amber-500/10 text-amber-400'
                      }`}>
                        {customer.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-emerald-400">
                      ${parseFloat(customer.balance).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => startEdit(customer)}
                          className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-all"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(customer.id)}
                          className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
              {filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                    No customers found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg glass rounded-2xl p-8 shadow-2xl"
            >
              <h3 className="text-2xl font-bold mb-6">
                {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm text-slate-400">Account Number</label>
                    <input 
                      required name="accountNumber" value={formData.accountNumber} onChange={handleInputChange}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary-500/50 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm text-slate-400">Account Type</label>
                    <select 
                      name="type" value={formData.type} onChange={handleInputChange}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary-500/50 outline-none transition-all"
                    >
                      <option>Savings</option>
                      <option>Current</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm text-slate-400">Full Name</label>
                  <input 
                    required name="name" value={formData.name} onChange={handleInputChange}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary-500/50 outline-none transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm text-slate-400">Phone</label>
                    <input 
                      name="phone" value={formData.phone} onChange={handleInputChange}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary-500/50 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm text-slate-400">Balance ($)</label>
                    <input 
                      required type="number" name="balance" value={formData.balance} onChange={handleInputChange}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary-500/50 outline-none transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm text-slate-400">Email Address</label>
                  <input 
                    type="email" name="email" value={formData.email} onChange={handleInputChange}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary-500/50 outline-none transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm text-slate-400">Address</label>
                  <textarea 
                    name="address" value={formData.address} onChange={handleInputChange}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary-500/50 outline-none transition-all h-20"
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <button 
                    type="button" 
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-6 py-2.5 rounded-xl border border-slate-800 hover:bg-slate-800 transition-all font-semibold"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 bg-primary-600 hover:bg-primary-500 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-primary-500/20"
                  >
                    {editingCustomer ? 'Save Changes' : 'Create Record'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const NavItem = ({ icon, label, active = false }) => (
  <button className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all ${
    active ? 'bg-primary-500/10 text-primary-400' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
  }`}>
    {icon}
    <span className="font-medium">{label}</span>
  </button>
);

const StatCard = ({ title, value, icon, trend }) => (
  <div className="glass-card p-6 rounded-2xl">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-800">
        {React.cloneElement(icon, { size: 24 })}
      </div>
      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
        trend.startsWith('+') ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-500/10 text-slate-400'
      }`}>
        {trend}
      </span>
    </div>
    <div className="text-slate-400 text-sm font-medium mb-1">{title}</div>
    <div className="text-2xl font-bold text-white tracking-tight">{value}</div>
  </div>
);

export default App;
