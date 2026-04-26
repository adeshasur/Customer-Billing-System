import React, { useState, useEffect } from 'react';
import { 
  Users, 
  LayoutDashboard, 
  BarChart3, 
  Settings as SettingsIcon, 
  LogOut, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  CreditCard, 
  TrendingUp, 
  Bell,
  User as UserIcon,
  ChevronRight
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion, AnimatePresence } from 'framer-motion';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Mock initial data if empty
const INITIAL_CUSTOMERS = [
  { id: '1', account: '1001', name: 'John Doe', type: 'Premium', balance: 1250.50 },
  { id: '2', account: '1002', name: 'Jane Smith', type: 'Regular', balance: 450.00 },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('customers');
  const [customers, setCustomers] = useState(() => {
    const saved = localStorage.getItem('billing_customers');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [formData, setFormData] = useState({ account: '', name: '', type: 'Regular', balance: '' });

  useEffect(() => {
    localStorage.setItem('billing_customers', JSON.stringify(customers));
  }, [customers]);

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.account.includes(searchQuery)
  );

  const stats = {
    totalBalance: customers.reduce((acc, c) => acc + parseFloat(c.balance || 0), 0),
    activeCustomers: customers.length,
    avgBalance: customers.length > 0 ? (customers.reduce((acc, c) => acc + parseFloat(c.balance || 0), 0) / customers.length) : 0
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
    setFormData({ account: '', name: '', type: 'Regular', balance: '' });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      setCustomers(customers.filter(c => c.id !== id));
    }
  };

  const SidebarItem = ({ id, icon: Icon, label }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={cn(
        "flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-300 group",
        activeTab === id 
          ? "bg-sky-500/10 text-sky-400 shadow-[inset_0_0_20px_rgba(14,165,233,0.1)]" 
          : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
      )}
    >
      <Icon className={cn("w-5 h-5", activeTab === id ? "text-sky-400" : "text-slate-400 group-hover:text-slate-200")} />
      <span className="font-medium">{label}</span>
      {activeTab === id && (
        <motion.div layoutId="activeTab" className="ml-auto w-1 h-5 bg-sky-400 rounded-full" />
      )}
    </button>
  );

  return (
    <div className="flex min-h-screen bg-[#0f172a] text-slate-200 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 glass border-r border-slate-800 flex flex-col p-6 z-20">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center shadow-lg shadow-sky-500/20">
            <CreditCard className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            BillingPro
          </h1>
        </div>

        <nav className="flex-1 space-y-2">
          <SidebarItem id="dashboard" icon={LayoutDashboard} label="Dashboard" />
          <SidebarItem id="customers" icon={Users} label="Customers" />
          <SidebarItem id="analytics" icon={BarChart3} label="Analytics" />
          <SidebarItem id="settings" icon={SettingsIcon} label="Settings" />
        </nav>

        <div className="pt-6 border-t border-slate-800 mt-auto">
          <button className="flex items-center gap-3 w-full px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-red-500/5 rounded-xl transition-all">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-sky-900/10 via-transparent to-transparent">
        <header className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">
              {activeTab === 'dashboard' && "Overview"}
              {activeTab === 'customers' && "Customer Directory"}
              {activeTab === 'analytics' && "Performance Analytics"}
              {activeTab === 'settings' && "System Settings"}
            </h2>
            <p className="text-slate-400">
              {activeTab === 'dashboard' && "Everything that's happening with your billing system today."}
              {activeTab === 'customers' && "Manage and track all your customer billing records."}
              {activeTab === 'analytics' && "Deep dive into your revenue and customer trends."}
              {activeTab === 'settings' && "Configure your application preferences and security."}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2.5 rounded-xl glass-card hover:bg-slate-800/80 transition-all relative">
              <Bell className="w-5 h-5 text-slate-400" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-sky-500 rounded-full border-2 border-[#0f172a]"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-slate-800">
              <div className="text-right">
                <p className="text-sm font-semibold text-white">Adheesha</p>
                <p className="text-xs text-slate-500">Administrator</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden">
                <UserIcon className="w-6 h-6 text-slate-400" />
              </div>
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'dashboard' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="glass-card p-6 rounded-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 transition-opacity group-hover:opacity-20">
                    <CreditCard className="w-16 h-16" />
                  </div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-sky-500/10 flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-sky-400" />
                    </div>
                    <span className="text-sky-500 text-sm font-bold bg-sky-500/10 px-2 py-0.5 rounded-full">+12.5%</span>
                  </div>
                  <p className="text-slate-400 text-sm font-medium mb-1">Total Balance</p>
                  <p className="text-3xl font-bold text-white">${stats.totalBalance.toLocaleString()}</p>
                </div>
                
                <div className="glass-card p-6 rounded-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 transition-opacity group-hover:opacity-20">
                    <Users className="w-16 h-16" />
                  </div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                      <Users className="w-6 h-6 text-emerald-400" />
                    </div>
                    <span className="text-emerald-500 text-sm font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">+3 new</span>
                  </div>
                  <p className="text-slate-400 text-sm font-medium mb-1">Active Customers</p>
                  <p className="text-3xl font-bold text-white">{stats.activeCustomers}</p>
                </div>

                <div className="glass-card p-6 rounded-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 transition-opacity group-hover:opacity-20">
                    <TrendingUp className="w-16 h-16" />
                  </div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-amber-400" />
                    </div>
                    <span className="text-slate-500 text-sm font-bold bg-slate-500/10 px-2 py-0.5 rounded-full">Stable</span>
                  </div>
                  <p className="text-slate-400 text-sm font-medium mb-1">Avg. Balance</p>
                  <p className="text-3xl font-bold text-white">${stats.avgBalance.toLocaleString()}</p>
                </div>
                
                <div className="col-span-1 md:col-span-2 glass-card p-8 rounded-2xl">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                    Recent Activity
                    <span className="text-xs font-normal text-slate-500 bg-slate-800 px-2 py-1 rounded-md">Last 24 hours</span>
                  </h3>
                  <div className="space-y-6">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-4 group">
                        <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
                          <Plus className="w-5 h-5 text-sky-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-white group-hover:text-sky-400 transition-colors">New Customer Added</p>
                          <p className="text-xs text-slate-500">Customer #100{i} was added to the system</p>
                        </div>
                        <span className="text-xs text-slate-600">2h ago</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass-card p-8 rounded-2xl flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-full bg-sky-500/10 flex items-center justify-center mb-4">
                    <BarChart3 className="w-8 h-8 text-sky-400" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">Quick Report</h3>
                  <p className="text-sm text-slate-500 mb-6">Generate a comprehensive billing report for this month.</p>
                  <button className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold transition-all shadow-lg shadow-sky-900/20">
                    Generate PDF
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'customers' && (
              <>
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
                  <div className="relative w-full md:w-96 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-sky-400 transition-colors" />
                    <input 
                      type="text" 
                      placeholder="Search by name or account..."
                      className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-sky-500/50 transition-all"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <button 
                    onClick={() => { setEditingCustomer(null); setFormData({ account: '', name: '', type: 'Regular', balance: '' }); setIsModalOpen(true); }}
                    className="flex items-center gap-2 bg-sky-600 hover:bg-sky-500 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-sky-900/20 active:scale-95"
                  >
                    <Plus className="w-5 h-5" />
                    Add Customer
                  </button>
                </div>

                <div className="glass-card rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-slate-800/30 text-slate-400 text-sm uppercase tracking-wider">
                          <th className="px-8 py-5 font-semibold">Account #</th>
                          <th className="px-8 py-5 font-semibold">Customer</th>
                          <th className="px-8 py-5 font-semibold">Type</th>
                          <th className="px-8 py-5 font-semibold">Balance</th>
                          <th className="px-8 py-5 font-semibold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {filteredCustomers.length > 0 ? filteredCustomers.map((customer) => (
                          <motion.tr 
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            key={customer.id} 
                            className="hover:bg-slate-800/20 transition-colors group"
                          >
                            <td className="px-8 py-5">
                              <span className="font-mono text-sky-400 bg-sky-400/5 px-2 py-1 rounded border border-sky-400/10">
                                {customer.account}
                              </span>
                            </td>
                            <td className="px-8 py-5">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white">
                                  {customer.name.charAt(0)}
                                </div>
                                <span className="font-semibold text-slate-200">{customer.name}</span>
                              </div>
                            </td>
                            <td className="px-8 py-5">
                              <span className={cn(
                                "px-3 py-1 rounded-full text-xs font-bold border",
                                customer.type === 'Premium' 
                                  ? "bg-amber-500/10 text-amber-500 border-amber-500/20" 
                                  : "bg-slate-500/10 text-slate-400 border-slate-500/20"
                              )}>
                                {customer.type}
                              </span>
                            </td>
                            <td className="px-8 py-5 font-mono text-white font-semibold">
                              ${parseFloat(customer.balance).toFixed(2)}
                            </td>
                            <td className="px-8 py-5 text-right">
                              <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                  onClick={() => { setEditingCustomer(customer); setFormData({ account: customer.account, name: customer.name, type: customer.type, balance: customer.balance }); setIsModalOpen(true); }}
                                  className="p-2 hover:bg-sky-500/10 rounded-lg text-sky-400 transition-all"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => handleDelete(customer.id)}
                                  className="p-2 hover:bg-red-500/10 rounded-lg text-red-400 transition-all"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </motion.tr>
                        )) : (
                          <tr>
                            <td colSpan={5} className="px-8 py-20 text-center text-slate-500">
                              <div className="flex flex-col items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center">
                                  <Users className="w-8 h-8 opacity-20" />
                                </div>
                                <p>No customers found matching your search.</p>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'analytics' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="glass-card p-8 rounded-2xl min-h-[400px] flex flex-col">
                  <h3 className="text-xl font-bold mb-8">Revenue Growth</h3>
                  <div className="flex-1 flex items-end gap-4 px-4">
                    {[40, 65, 45, 90, 75, 55, 80].map((h, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
                        <motion.div 
                          initial={{ height: 0 }}
                          animate={{ height: `${h}%` }}
                          className="w-full bg-sky-500/20 group-hover:bg-sky-500/40 rounded-t-lg transition-all relative"
                        >
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 px-2 py-1 rounded">
                            ${(h * 100).toLocaleString()}
                          </div>
                        </motion.div>
                        <span className="text-[10px] uppercase font-bold text-slate-600">Day {i+1}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="glass-card p-6 rounded-2xl flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm mb-1">Retention Rate</p>
                      <p className="text-2xl font-bold text-white">94.2%</p>
                    </div>
                    <div className="w-12 h-12 rounded-full border-4 border-sky-500/20 border-t-sky-500 rotate-45"></div>
                  </div>
                  <div className="glass-card p-6 rounded-2xl flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm mb-1">New Subscriptions</p>
                      <p className="text-2xl font-bold text-white">128</p>
                    </div>
                    <div className="w-12 h-12 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 -rotate-12"></div>
                  </div>
                  <div className="glass-card p-8 rounded-2xl flex-1">
                    <h3 className="text-lg font-bold mb-4">Top Customers</h3>
                    <div className="space-y-4">
                      {customers.sort((a, b) => b.balance - a.balance).slice(0, 3).map((c, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-slate-600 font-bold">#{i+1}</span>
                            <span className="text-sm font-semibold">{c.name}</span>
                          </div>
                          <span className="text-sm font-mono text-sky-400">${parseFloat(c.balance).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="max-w-2xl space-y-6">
                <div className="glass-card p-8 rounded-2xl">
                  <h3 className="text-xl font-bold mb-6">Account Settings</h3>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between py-4 border-b border-slate-800">
                      <div>
                        <p className="font-semibold">Two-Factor Authentication</p>
                        <p className="text-sm text-slate-500">Add an extra layer of security to your account.</p>
                      </div>
                      <div className="w-12 h-6 bg-sky-600 rounded-full relative cursor-pointer p-1">
                        <div className="w-4 h-4 bg-white rounded-full ml-auto"></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between py-4 border-b border-slate-800">
                      <div>
                        <p className="font-semibold">Email Notifications</p>
                        <p className="text-sm text-slate-500">Receive alerts about billing and system status.</p>
                      </div>
                      <div className="w-12 h-6 bg-slate-800 rounded-full relative cursor-pointer p-1">
                        <div className="w-4 h-4 bg-slate-500 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="glass-card p-8 rounded-2xl">
                  <h3 className="text-xl font-bold mb-6">Database Management</h3>
                  <div className="flex items-center gap-4">
                    <button className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm font-bold transition-all">
                      Backup Database
                    </button>
                    <button className="px-6 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-bold transition-all">
                      Clear Cache
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md glass border border-slate-800 rounded-3xl p-8 shadow-2xl"
            >
              <h3 className="text-2xl font-bold text-white mb-6">
                {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
              </h3>
              <form onSubmit={handleAddOrUpdate} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-400 ml-1">Account Number</label>
                  <input 
                    required 
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-sky-500"
                    placeholder="e.g. 1001"
                    value={formData.account}
                    onChange={(e) => setFormData({ ...formData, account: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-400 ml-1">Customer Name</label>
                  <input 
                    required 
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-sky-500"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-400 ml-1">Account Type</label>
                    <select 
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-sky-500"
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    >
                      <option value="Regular">Regular</option>
                      <option value="Premium">Premium</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-400 ml-1">Initial Balance</label>
                    <input 
                      required 
                      type="number" 
                      step="0.01"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-sky-500"
                      placeholder="0.00"
                      value={formData.balance}
                      onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex gap-4 pt-4">
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 font-bold transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="flex-1 px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold transition-all shadow-lg shadow-sky-900/20"
                  >
                    {editingCustomer ? 'Save Changes' : 'Add Record'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
