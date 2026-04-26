import React, { useState, useEffect } from 'react';
import { 
  Users, 
  LayoutDashboard, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  LogOut,
  User as UserIcon,
  CreditCard
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const INITIAL_CUSTOMERS = [
  { id: '1', account: 'CB-1001', name: 'Nimal Perera', email: 'nimal.p@gmail.com', type: 'Premium', balance: 125050.00 },
  { id: '2', account: 'CB-1002', name: 'Sunil Silva', email: 'sunil.s@outlook.com', type: 'Regular', balance: 45200.00 },
];

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('billing_auth') === 'true');
  const [activeTab, setActiveTab] = useState('customers');
  const [customers, setCustomers] = useState(() => {
    const saved = localStorage.getItem('billing_customers');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [formData, setFormData] = useState({ account: '', name: '', email: '', type: 'Regular', balance: '' });

  useEffect(() => {
    localStorage.setItem('billing_customers', JSON.stringify(customers));
  }, [customers]);

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.account.includes(searchQuery)
  );

  const handleLogin = (e) => {
    e.preventDefault();
    if (e.target.password.value === 'admin123') {
      setIsLoggedIn(true);
      localStorage.setItem('billing_auth', 'true');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('billing_auth');
  };

  const handleAddOrUpdate = (e) => {
    e.preventDefault();
    if (editingCustomer) {
      setCustomers(customers.map(c => c.id === editingCustomer.id ? { ...editingCustomer, ...formData } : c));
    } else {
      setCustomers([...customers, { id: Date.now().toString(), ...formData }]);
    }
    setIsModalOpen(false);
    setEditingCustomer(null);
    setFormData({ account: '', name: '', email: '', type: 'Regular', balance: '' });
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete record?')) {
      setCustomers(customers.filter(c => c.id !== id));
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
        <div className="w-full max-w-[360px] bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
          <h1 className="text-xl font-bold text-slate-900 mb-6">BillingPro Login</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[12px] font-medium text-slate-500">Password</label>
              <input name="password" type="password" required className="w-full border border-slate-200 rounded-lg py-2 px-3 text-[14px] focus:outline-none focus:border-blue-500" placeholder="admin123" />
            </div>
            <button type="submit" className="w-full bg-slate-900 text-white py-2.5 rounded-lg text-sm font-bold">Sign In</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-white text-slate-700 font-sans">
      {/* Sidebar */}
      <aside className="w-60 border-r border-slate-100 flex flex-col p-6">
        <div className="flex items-center gap-2 mb-10 px-2">
          <CreditCard className="w-5 h-5 text-blue-600" />
          <h1 className="text-lg font-bold text-slate-900">BillingPro</h1>
        </div>

        <nav className="flex-1 space-y-1">
          <button onClick={() => setActiveTab('customers')} className={cn("flex items-center gap-3 w-full px-4 py-2 rounded-lg text-[14px] font-medium transition-all", activeTab === 'customers' ? "bg-slate-100 text-slate-900" : "text-slate-500 hover:bg-slate-50")}>
            <Users className="w-4 h-4" /> Customers
          </button>
          <button onClick={() => setActiveTab('dashboard')} className={cn("flex items-center gap-3 w-full px-4 py-2 rounded-lg text-[14px] font-medium transition-all", activeTab === 'dashboard' ? "bg-slate-100 text-slate-900" : "text-slate-500 hover:bg-slate-50")}>
            <LayoutDashboard className="w-4 h-4" /> Overview
          </button>
        </nav>

        <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-2 text-slate-400 hover:text-red-600 rounded-lg transition-all mt-auto text-[14px] font-medium">
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 bg-white">
        <header className="flex items-center justify-between mb-10">
          <h2 className="text-2xl font-bold text-slate-900 capitalize">{activeTab}</h2>
          <div className="flex items-center gap-3">
            <span className="text-[13px] font-medium text-slate-500">Admin</span>
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
              <UserIcon className="w-4 h-4 text-slate-400" />
            </div>
          </div>
        </header>

        {activeTab === 'customers' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="text" placeholder="Search..." className="w-full bg-slate-50 border border-slate-100 rounded-lg py-2 pl-10 pr-4 text-[14px] focus:outline-none focus:border-slate-300" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </div>
              <button onClick={() => { setEditingCustomer(null); setFormData({ account: '', name: '', email: '', type: 'Regular', balance: '' }); setIsModalOpen(true); }} className="bg-slate-900 text-white px-5 py-2 rounded-lg text-[14px] font-bold flex items-center gap-2">
                <Plus className="w-4 h-4" /> Add New
              </button>
            </div>

            <div className="border border-slate-100 rounded-xl overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-[12px] font-bold uppercase tracking-wider border-b border-slate-100">
                    <th className="px-6 py-4">Account</th>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">Balance</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCustomers.length > 0 ? filteredCustomers.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/50 transition-all group">
                      <td className="px-6 py-4 text-[14px] font-medium text-slate-900">{c.account}</td>
                      <td className="px-6 py-4">
                        <p className="text-[14px] font-bold text-slate-900">{c.name}</p>
                        <p className="text-[12px] text-slate-400">{c.email}</p>
                      </td>
                      <td className="px-6 py-4 text-[12px]">
                        <span className={cn("px-2 py-0.5 rounded-full border", c.type === 'Premium' ? "bg-blue-50 text-blue-600 border-blue-100" : "bg-slate-50 text-slate-500 border-slate-100")}>{c.type}</span>
                      </td>
                      <td className="px-6 py-4 text-[14px] font-bold">Rs. {parseFloat(c.balance).toLocaleString()}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                          <button onClick={() => { setEditingCustomer(c); setFormData({ ...c }); setIsModalOpen(true); }} className="p-1.5 hover:bg-slate-100 rounded text-slate-400 hover:text-blue-600"><Edit2 className="w-3.5 h-3.5" /></button>
                          <button onClick={() => handleDelete(c.id)} className="p-1.5 hover:bg-slate-100 rounded text-slate-400 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan={5} className="px-6 py-20 text-center text-slate-400 text-sm italic">No records found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
              <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Balance</p>
              <p className="text-3xl font-bold text-slate-900">Rs. {customers.reduce((acc, c) => acc + parseFloat(c.balance || 0), 0).toLocaleString()}</p>
            </div>
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
              <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-1">Active Customers</p>
              <p className="text-3xl font-bold text-slate-900">{customers.length}</p>
            </div>
          </div>
        )}
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/20 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-8 shadow-xl">
            <h3 className="text-lg font-bold text-slate-900 mb-6">{editingCustomer ? 'Edit' : 'Add'} Customer</h3>
            <form onSubmit={handleAddOrUpdate} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[12px] font-medium text-slate-500">Account ID</label>
                <input required className="w-full border border-slate-200 rounded-lg py-2 px-3 text-[14px]" value={formData.account} onChange={(e) => setFormData({ ...formData, account: e.target.value })} />
              </div>
              <div className="space-y-1">
                <label className="text-[12px] font-medium text-slate-500">Name</label>
                <input required className="w-full border border-slate-200 rounded-lg py-2 px-3 text-[14px]" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div className="space-y-1">
                <label className="text-[12px] font-medium text-slate-500">Email</label>
                <input required type="email" className="w-full border border-slate-200 rounded-lg py-2 px-3 text-[14px]" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[12px] font-medium text-slate-500">Type</label>
                  <select className="w-full border border-slate-200 rounded-lg py-2 px-3 text-[14px]" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                    <option value="Regular">Regular</option>
                    <option value="Premium">Premium</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[12px] font-medium text-slate-500">Balance</label>
                  <input required type="number" className="w-full border border-slate-200 rounded-lg py-2 px-3 text-[14px]" value={formData.balance} onChange={(e) => setFormData({ ...formData, balance: e.target.value })} />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 rounded-lg bg-slate-100 text-[14px] font-bold text-slate-500 hover:bg-slate-200">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 rounded-lg bg-slate-900 text-white text-[14px] font-bold">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
