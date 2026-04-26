import React, { useState, useEffect } from 'react';
import { 
  Users, 
  LayoutDashboard, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  LogOut,
  Download,
  Filter,
  ChevronRight,
  MoreHorizontal,
  Bell,
  CheckCircle2,
  AlertCircle,
  FileText,
  History,
  Activity,
  ArrowUpRight,
  Settings,
  CreditCard,
  Target,
  Search as SearchIcon,
  Globe,
  Database
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion, AnimatePresence } from 'framer-motion';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const INITIAL_CUSTOMERS = [
  { id: '1', account: 'BP-1001', name: 'Alexander Perera', email: 'alex@billingpro.io', type: 'Premium', balance: 125050.00, vatEnabled: true, city: 'Colombo' },
  { id: '2', account: 'BP-1002', name: 'Julian Silva', email: 'julian@billingpro.io', type: 'Standard', balance: 45200.00, vatEnabled: false, city: 'Kandy' },
];

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('billing_auth') === 'true');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [customers, setCustomers] = useState(() => JSON.parse(localStorage.getItem('billing_customers')) || INITIAL_CUSTOMERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    localStorage.setItem('billing_customers', JSON.stringify(customers));
  }, [customers]);

  const addNotification = (message) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message }]);
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 3000);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 font-sans">
        <div className="w-full max-w-[400px]">
          <div className="mb-8 text-center">
            <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Database className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">BillingPro Console</h1>
            <p className="text-slate-500 text-sm mt-1">Enterprise Asset Management</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
            <form onSubmit={(e) => {
              e.preventDefault();
              if (e.target.password.value === 'admin123') {
                setIsLoggedIn(true);
                localStorage.setItem('billing_auth', 'true');
              }
            }} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Access Token</label>
                <input name="password" type="password" required className="w-full border border-slate-200 rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:border-indigo-500 transition-all bg-slate-50/50" placeholder="••••••••" />
              </div>
              <button type="submit" className="w-full bg-indigo-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-all">Sign In</button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-white text-slate-900 font-sans">
      {/* Notifications */}
      <div className="fixed top-6 right-6 z-[100] space-y-2">
        <AnimatePresence>
          {notifications.map(n => (
            <motion.div key={n.id} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="px-4 py-3 rounded-lg shadow-lg border border-slate-200 bg-white flex items-center gap-3 min-w-[240px]">
              <CheckCircle2 className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-semibold text-slate-700">{n.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Professional Sidebar */}
      <aside className="w-64 bg-slate-50 border-r border-slate-200 flex flex-col z-20">
        <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-200">
          <div className="w-7 h-7 bg-indigo-600 rounded flex items-center justify-center">
            <Globe className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-sm font-bold text-slate-900 tracking-tight">BILLINGPRO</h1>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
            { id: 'customers', icon: Users, label: 'Customers' },
            { id: 'invoices', icon: FileText, label: 'Invoices' },
            { id: 'payments', icon: CreditCard, label: 'Payments' },
            { id: 'activity', icon: Activity, label: 'Logs' },
          ].map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={cn("flex items-center gap-3 w-full px-3 py-2 rounded-lg transition-all text-sm font-medium", activeTab === item.id ? "bg-white text-indigo-600 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-900 hover:bg-slate-100")}>
              <item.icon className={cn("w-4 h-4", activeTab === item.id ? "text-indigo-600" : "text-slate-400")} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-200">
          <button onClick={() => setIsLoggedIn(false)} className="flex items-center gap-3 w-full px-3 py-2 text-slate-500 hover:text-red-600 rounded-lg transition-all text-sm font-medium group">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Interface */}
      <main className="flex-1 flex flex-col min-w-0 bg-white">
        <header className="h-16 flex items-center justify-between px-8 border-b border-slate-200">
          <div className="flex items-center gap-4">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">{activeTab}</h2>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-slate-900 transition-all"><Bell className="w-5 h-5" /></button>
            <div className="h-4 w-px bg-slate-200 mx-2"></div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400">AD</div>
              <span className="text-xs font-bold text-slate-700">Administrator</span>
            </div>
          </div>
        </header>

        <div className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto space-y-8">
            
            {activeTab === 'dashboard' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {[
                    { label: 'Total Revenue', value: 'Rs. 452,050.00', trend: '+12%', icon: Target },
                    { label: 'Active Clients', value: customers.length, trend: 'Stable', icon: Users },
                    { label: 'Pending Bills', value: 'Rs. 12,500.00', trend: '-2%', icon: FileText },
                    { label: 'Efficiency', value: '94.2%', trend: '+0.4%', icon: Activity },
                  ].map((stat, i) => (
                    <div key={i} className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-slate-50 rounded-lg"><stat.icon className="w-4 h-4 text-slate-500" /></div>
                        <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full", stat.trend.includes('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400')}>{stat.trend}</span>
                      </div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                      <p className="text-xl font-bold text-slate-900 mt-1">{stat.value}</p>
                    </div>
                  ))}
                </div>
                
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900">Recent Activity</h3>
                    <button className="text-xs font-bold text-indigo-600 hover:underline">View All</button>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-all">
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center"><Plus className="w-4 h-4 text-indigo-600" /></div>
                          <div>
                            <p className="text-sm font-semibold text-slate-900">Customer Registered</p>
                            <p className="text-xs text-slate-500">BP-100{i} node initialized by Admin</p>
                          </div>
                        </div>
                        <span className="text-xs text-slate-400">2 hours ago</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'customers' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="relative flex-1 max-w-md group">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                    <input type="text" placeholder="Search registry..." className="w-full border border-slate-200 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-indigo-500 transition-all shadow-sm" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                  </div>
                  <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-all shadow-sm">
                    <Plus className="w-4 h-4" /> New Customer
                  </button>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200">
                        <th className="px-6 py-4">Account</th>
                        <th className="px-6 py-4">Name</th>
                        <th className="px-6 py-4">Email</th>
                        <th className="px-6 py-4 text-right">Balance</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {customers.map((c) => (
                        <tr key={c.id} className="hover:bg-slate-50/50 transition-all">
                          <td className="px-6 py-4 text-xs font-bold text-slate-400">#{c.account}</td>
                          <td className="px-6 py-4 text-sm font-semibold text-slate-900">{c.name}</td>
                          <td className="px-6 py-4 text-sm text-slate-500">{c.email}</td>
                          <td className="px-6 py-4 text-right text-sm font-bold text-slate-900">Rs. {parseFloat(c.balance).toLocaleString()}</td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button className="p-1.5 hover:bg-slate-100 rounded transition-all"><Edit2 className="w-3.5 h-3.5 text-slate-400" /></button>
                              <button className="p-1.5 hover:bg-red-50 rounded transition-all"><Trash2 className="w-3.5 h-3.5 text-slate-400 hover:text-red-600" /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Other tabs as placeholders but professional */}
            {['invoices', 'payments', 'activity'].includes(activeTab) && (
              <div className="py-20 text-center bg-slate-50 border border-slate-200 border-dashed rounded-xl">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em]">Data Module: {activeTab}</p>
                <p className="text-xs text-slate-300 mt-2 font-medium">Loading professional enterprise data set...</p>
              </div>
            )}

          </div>
        </div>
      </main>

      {/* Clean Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/20 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-[480px] bg-white border border-slate-200 rounded-xl p-8 shadow-2xl">
              <h3 className="text-lg font-bold text-slate-900 mb-6">New Entry</h3>
              <form onSubmit={(e) => { e.preventDefault(); addNotification('Node Added'); setIsModalOpen(false); }} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Account #</label>
                    <input required className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 bg-slate-50/30" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
                    <input required className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 bg-slate-50/30" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
                  <input required type="email" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 bg-slate-50/30" />
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-50 rounded-lg border border-slate-200 transition-all">Cancel</button>
                  <button type="submit" className="flex-1 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 rounded-lg transition-all shadow-sm">Save Entry</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
