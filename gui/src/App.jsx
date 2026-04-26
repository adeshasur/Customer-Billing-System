import React, { useState, useEffect, useMemo } from 'react';
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
  PieChart,
  HelpCircle,
  Shield,
  Activity,
  ArrowUpRight,
  Zap,
  Settings,
  CreditCard,
  Target,
  Layers,
  Sparkles
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AreaChart, 
  Area, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const INITIAL_CUSTOMERS = [
  { id: '1', account: 'BP-1001', name: 'Alexander Perera', email: 'alex@billingpro.io', type: 'Premium', balance: 125050.00, vatEnabled: true, city: 'Colombo' },
  { id: '2', account: 'BP-1002', name: 'Julian Silva', email: 'julian@billingpro.io', type: 'Standard', balance: 45200.00, vatEnabled: false, city: 'Kandy' },
];

const CHART_DATA = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 6000 },
  { name: 'Apr', value: 8000 },
  { name: 'May', value: 7000 },
  { name: 'Jun', value: 9000 },
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
      <div className="min-h-screen bg-[#F6F8FA] flex items-center justify-center p-6 font-sans">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-[420px]">
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl rotate-3">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">BillingPro</h1>
            <p className="text-slate-500 text-sm mt-2 font-medium">Ultra-Premium Finance Console</p>
          </div>
          <div className="bg-white border border-slate-100 rounded-[3rem] p-10 shadow-[0_30px_60px_rgba(0,0,0,0.05)]">
            <form onSubmit={(e) => {
              e.preventDefault();
              if (e.target.password.value === 'admin123') {
                setIsLoggedIn(true);
                localStorage.setItem('billing_auth', 'true');
                addNotification('Access Granted');
              }
            }} className="space-y-8">
              <div className="space-y-3">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Authentication Key</label>
                <input name="password" type="password" required className="w-full border border-slate-100 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-50/50 transition-all bg-slate-50/30" placeholder="••••••••" />
              </div>
              <button type="submit" className="w-full bg-slate-900 text-white py-4.5 rounded-2xl text-sm font-bold active:scale-[0.98] transition-all shadow-xl shadow-indigo-200">Initialize Session</button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-slate-900 font-sans">
      {/* Notifications */}
      <div className="fixed top-8 right-8 z-[100] space-y-3 pointer-events-none">
        <AnimatePresence>
          {notifications.map(n => (
            <motion.div key={n.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="px-6 py-4 rounded-3xl shadow-2xl flex items-center gap-4 min-w-[300px] border border-white bg-white/80 backdrop-blur-xl">
              <div className="w-8 h-8 bg-indigo-50 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-indigo-600" />
              </div>
              <span className="text-sm font-bold text-slate-900">{n.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Luxury Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-100 flex flex-col p-8 z-20">
        <div className="flex items-center gap-4 mb-16 px-2">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 rotate-3 group cursor-pointer hover:rotate-0 transition-all">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-black text-slate-900 tracking-tighter italic">BillingPro</h1>
        </div>

        <nav className="flex-1 space-y-2">
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'Analytics' },
            { id: 'customers', icon: Users, label: 'Registry' },
            { id: 'invoices', icon: FileText, label: 'Ledger' },
            { id: 'payments', icon: CreditCard, label: 'Capital' },
            { id: 'activity', icon: Activity, label: 'History' },
          ].map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={cn("flex items-center gap-4 w-full px-5 py-3.5 rounded-2xl transition-all group", activeTab === item.id ? "bg-indigo-50/50 text-indigo-600 font-bold" : "text-slate-400 hover:text-slate-900 hover:bg-slate-50")}>
              <item.icon className={cn("w-5 h-5 transition-transform group-hover:scale-110", activeTab === item.id ? "text-indigo-600" : "text-slate-300")} />
              <span className="text-[14.5px]">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="pt-8 border-t border-slate-50 mt-auto">
          <div className="bg-slate-50 p-6 rounded-[2rem] mb-8">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Storage Node</p>
            <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-600 w-[64%]" />
            </div>
            <p className="text-[10px] font-bold text-slate-400 mt-3">6.4GB / 10GB Active</p>
          </div>
          <button onClick={() => setIsLoggedIn(false)} className="flex items-center gap-4 w-full px-5 py-3.5 text-slate-400 hover:text-red-500 rounded-2xl transition-all font-bold group">
            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Sign exit
          </button>
        </div>
      </aside>

      {/* Content Engine */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <header className="h-24 flex items-center justify-between px-12 z-10">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">{activeTab} // environment</span>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight capitalize">{activeTab === 'dashboard' ? 'Overview Console' : activeTab}</h2>
          </div>
          <div className="flex items-center gap-6">
            <button className="w-12 h-12 flex items-center justify-center bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all">
              <Bell className="w-5 h-5 text-slate-400" />
            </button>
            <div className="h-12 w-[1px] bg-slate-100"></div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-slate-900">Administrator</p>
                <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Active Status</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-100 to-indigo-50 border border-indigo-100 flex items-center justify-center font-black text-indigo-400">
                AD
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 px-12 pb-12 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.3 }} className="max-w-7xl mx-auto">
              
              {activeTab === 'dashboard' && (
                <div className="space-y-10 py-4">
                  {/* Luxury Bento Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 bg-slate-900 p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-600/10 blur-[100px] -mr-48 -mt-48 group-hover:bg-indigo-600/20 transition-all"></div>
                      <div className="relative z-10 flex flex-col h-full justify-between">
                        <div>
                          <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Capital Velocity</p>
                          <h3 className="text-5xl font-black text-white tracking-tighter mb-4">Rs. {customers.reduce((acc, c) => acc + parseFloat(c.balance || 0), 0).toLocaleString()}</h3>
                          <div className="flex items-center gap-2 text-indigo-400 text-sm font-bold">
                            <ArrowUpRight className="w-4 h-4" /> 18.4% Increment
                          </div>
                        </div>
                        <div className="h-[180px] w-full mt-10">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={CHART_DATA}>
                              <defs>
                                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                </linearGradient>
                              </defs>
                              <Area type="monotone" dataKey="value" stroke="#6366f1" fillOpacity={1} fill="url(#colorValue)" strokeWidth={4} />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-8">
                      <div className="bg-white border border-slate-100 p-10 rounded-[3.5rem] shadow-sm flex flex-col justify-between group cursor-pointer hover:border-indigo-100 transition-all">
                        <div>
                          <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Target className="w-6 h-6 text-indigo-600" />
                          </div>
                          <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Target Yield</p>
                          <p className="text-2xl font-black text-slate-900 tracking-tight">84% Efficiency</p>
                        </div>
                        <div className="mt-8 pt-8 border-t border-slate-50 flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-400">Details</span>
                          <ChevronRight className="w-4 h-4 text-slate-300" />
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-indigo-600 to-violet-600 p-10 rounded-[3.5rem] shadow-xl text-white group cursor-pointer active:scale-95 transition-all">
                        <div className="flex items-center justify-between mb-8">
                          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                            <Zap className="w-6 h-6 text-white" />
                          </div>
                        </div>
                        <h4 className="text-lg font-black tracking-tight mb-2">Pro Deployment</h4>
                        <p className="text-white/70 text-xs font-bold leading-relaxed">Execute capital allocation protocols instantly.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'customers' && (
                <div className="space-y-12 py-4">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="relative flex-1 w-full max-w-xl group">
                      <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                      <input type="text" placeholder="Query identity registry..." className="w-full bg-white border border-slate-100 rounded-[2rem] py-5 pl-16 pr-8 text-[15px] font-medium focus:outline-none focus:ring-4 focus:ring-indigo-50/50 transition-all shadow-sm" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                    </div>
                    <button onClick={() => setIsModalOpen(true)} className="w-full md:w-auto flex items-center justify-center gap-3 px-10 py-5 bg-slate-900 text-white rounded-[2rem] text-sm font-black uppercase tracking-widest shadow-2xl shadow-indigo-100 hover:bg-black active:scale-95 transition-all">
                      <Plus className="w-5 h-5" /> Initialize Node
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {customers.map((c, i) => (
                      <motion.div key={c.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }} className="bg-white border border-slate-100 p-10 rounded-[3.5rem] shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-full -mr-12 -mt-12 group-hover:bg-indigo-50 transition-all"></div>
                        <div className="flex items-center gap-6 mb-10 relative z-10">
                          <div className="w-16 h-16 rounded-[1.5rem] bg-slate-50 border border-slate-100 flex items-center justify-center text-xl font-black text-slate-300 uppercase">
                            {c.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <h4 className="text-lg font-black text-slate-900 tracking-tight truncate max-w-[150px]">{c.name}</h4>
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{c.account}</p>
                          </div>
                        </div>
                        <div className="space-y-4 relative z-10">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-400 font-bold">Tier</span>
                            <span className={cn("text-[10px] font-black px-3 py-1 rounded-lg border uppercase tracking-widest", c.type === 'Premium' ? "bg-indigo-50 text-indigo-600 border-indigo-100" : "bg-slate-50 text-slate-400 border-slate-100")}>{c.type}</span>
                          </div>
                          <div className="flex justify-between items-center text-sm pt-4 border-t border-slate-50">
                            <span className="text-slate-400 font-bold">Capital</span>
                            <span className="text-lg font-black text-slate-900 tracking-tighter">Rs. {parseFloat(c.balance).toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="mt-10 pt-8 border-t border-slate-50 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                          <div className="flex gap-2">
                            <button className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all"><Edit2 className="w-4 h-4 text-slate-400" /></button>
                            <button className="p-3 bg-slate-50 hover:bg-red-50 rounded-2xl transition-all group/del"><Trash2 className="w-4 h-4 text-slate-400 group-hover/del:text-red-500" /></button>
                          </div>
                          <button className="flex items-center gap-2 text-xs font-black text-indigo-600 uppercase tracking-widest">Profile <ChevronRight className="w-4 h-4" /></button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Modular views for other tabs */}
              {['invoices', 'payments', 'activity'].includes(activeTab) && (
                <div className="flex flex-col items-center justify-center py-48 bg-white border border-slate-100 rounded-[4rem] shadow-sm mt-10">
                  <div className="w-24 h-24 bg-indigo-50 rounded-[2rem] flex items-center justify-center mb-10 shadow-inner">
                    <Layers className="w-10 h-10 text-indigo-200 animate-pulse" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-300 uppercase tracking-[0.3em] mb-4 italic">Environment Node: {activeTab}</h3>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Optimizing hyper-fidelity interface modules...</p>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Luxury Entry Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-slate-900/10 backdrop-blur-2xl">
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 40 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 40 }} className="w-full max-w-[540px] bg-white border border-slate-100 rounded-[4rem] p-16 shadow-[0_80px_160px_rgba(0,0,0,0.15)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-indigo-50 rounded-full -mr-48 -mt-48"></div>
              <h3 className="text-3xl font-black text-slate-900 mb-12 tracking-tight uppercase italic relative z-10">Deploy Node</h3>
              <form onSubmit={handleAddOrUpdate} className="space-y-10 relative z-10">
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Account Ref</label>
                    <input required className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-indigo-50/50 transition-all" value={formData.account} onChange={(e) => setFormData({ ...formData, account: e.target.value })} />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Node Identity</label>
                    <input required className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-indigo-50/50 transition-all" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Endpoint Address</label>
                  <input required type="email" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-indigo-50/50 transition-all" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                </div>
                <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-2xl text-[13px] font-black hover:bg-black transition-all shadow-2xl shadow-indigo-100 uppercase tracking-[0.2em] mt-6">Commit Deployment</button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="w-full text-[11px] font-black text-slate-300 uppercase tracking-widest mt-2 hover:text-slate-900 transition-colors">Discard Draft</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
