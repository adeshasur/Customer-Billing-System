import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Users, 
  LayoutDashboard, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  LogOut,
  User as UserIcon,
  CreditCard,
  Download,
  Filter,
  ChevronRight,
  MoreHorizontal,
  Command as CommandIcon,
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
  MousePointer2,
  Settings,
  Search as SearchIcon
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
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
  { name: 'Mon', revenue: 45000 },
  { name: 'Tue', revenue: 52000 },
  { name: 'Wed', revenue: 48000 },
  { name: 'Thu', revenue: 61000 },
  { name: 'Fri', revenue: 55000 },
  { name: 'Sat', revenue: 67000 },
  { name: 'Sun', revenue: 72000 },
];

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('billing_auth') === 'true');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [customers, setCustomers] = useState(() => JSON.parse(localStorage.getItem('billing_customers')) || INITIAL_CUSTOMERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [formData, setFormData] = useState({ account: '', name: '', email: '', type: 'Standard', balance: '', vatEnabled: false, city: 'Colombo' });
  const [notifications, setNotifications] = useState([]);

  // Command Palette Listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const addNotification = (message, type = 'success') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 3000);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('billing_auth');
  };

  const handleAddOrUpdate = (e) => {
    e.preventDefault();
    const data = { ...formData, balance: parseFloat(formData.balance || 0) };
    if (editingCustomer) {
      setCustomers(customers.map(c => c.id === editingCustomer.id ? { ...editingCustomer, ...data } : c));
      addNotification('Synchronized');
    } else {
      setCustomers([...customers, { id: Date.now().toString(), ...data }]);
      addNotification('Initialized');
    }
    setIsModalOpen(false);
    setEditingCustomer(null);
    setFormData({ account: '', name: '', email: '', type: 'Standard', balance: '', vatEnabled: false, city: 'Colombo' });
  };

  const SidebarItem = ({ id, icon: Icon, label, category }) => (
    <div className="space-y-1">
      {category && <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em] px-4 mb-2 mt-6">{category}</p>}
      <button
        onClick={() => setActiveTab(id)}
        className={cn(
          "flex items-center justify-between w-full px-4 py-2.5 rounded-xl transition-all group",
          activeTab === id ? "bg-slate-900 text-white shadow-xl shadow-black/10" : "text-slate-500 hover:text-slate-900 hover:bg-slate-100/50"
        )}
      >
        <div className="flex items-center gap-3">
          <Icon className={cn("w-4 h-4", activeTab === id ? "text-white" : "text-slate-400 group-hover:text-slate-600")} />
          <span className="text-[14px] font-medium">{label}</span>
        </div>
      </button>
    </div>
  );

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center p-6 font-sans">
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-[380px]">
          <div className="text-center mb-10">
            <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-xl">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">BillingPro</h1>
            <p className="text-slate-400 text-xs mt-1 font-medium tracking-widest uppercase italic">Secure Gateway</p>
          </div>
          <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-sm">
            <form onSubmit={(e) => {
              e.preventDefault();
              if (e.target.password.value === 'admin123') {
                setIsLoggedIn(true);
                localStorage.setItem('billing_auth', 'true');
                addNotification('Access Granted');
              }
            }} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider ml-1">Master Key</label>
                <input name="password" type="password" required className="w-full border border-slate-100 rounded-xl py-4 px-5 text-sm focus:outline-none focus:border-slate-300 transition-all bg-slate-50/30" placeholder="••••••••" />
              </div>
              <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-xl text-sm font-semibold active:scale-[0.98] transition-all">Authenticate</button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#FDFDFD] text-slate-800 font-sans selection:bg-slate-100">
      {/* Notifications */}
      <div className="fixed top-8 right-8 z-[100] space-y-3 pointer-events-none">
        <AnimatePresence>
          {notifications.map(n => (
            <motion.div key={n.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className={cn("px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3 min-w-[280px] border bg-white border-slate-50")}>
              {n.type === 'error' ? <AlertCircle className="w-4 h-4 text-red-500" /> : <CheckCircle2 className="w-4 h-4 text-slate-900" />}
              <span className="text-sm font-medium text-slate-900">{n.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Command Palette Overlay */}
      <AnimatePresence>
        {isCommandPaletteOpen && (
          <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh] px-6 bg-slate-900/10 backdrop-blur-sm" onClick={() => setIsCommandPaletteOpen(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.98, y: -20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98, y: -20 }} className="w-full max-w-[640px] bg-white border border-slate-100 rounded-3xl shadow-[0_40px_100px_rgba(0,0,0,0.1)] overflow-hidden" onClick={e => e.stopPropagation()}>
              <div className="flex items-center gap-4 px-6 py-5 border-b border-slate-50 bg-slate-50/30">
                <SearchIcon className="w-5 h-5 text-slate-400" />
                <input autoFocus placeholder="Type a command or search customers..." className="flex-1 bg-transparent border-none outline-none text-[15px] font-medium text-slate-900" onChange={(e) => setSearchQuery(e.target.value)} />
                <div className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-400">ESC</div>
              </div>
              <div className="p-4 max-h-[400px] overflow-y-auto">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 mb-3">Quick Navigation</p>
                <div className="space-y-1">
                  {[
                    { id: 'dashboard', icon: LayoutDashboard, label: 'Go to Overview' },
                    { id: 'customers', icon: Users, label: 'Manage Directory' },
                    { id: 'invoices', icon: FileText, label: 'View Invoices' },
                    { id: 'payments', icon: History, label: 'Transaction History' }
                  ].map(item => (
                    <button key={item.id} onClick={() => { setActiveTab(item.id); setIsCommandPaletteOpen(false); }} className="flex items-center gap-4 w-full px-4 py-3 hover:bg-slate-50 rounded-xl transition-all group">
                      <item.icon className="w-4.5 h-4.5 text-slate-300 group-hover:text-slate-900" />
                      <span className="text-[14px] font-medium text-slate-600 group-hover:text-slate-900">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-100 flex flex-col p-6 z-20">
        <div className="flex items-center gap-3 mb-8 px-1 pt-2">
          <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center shadow-lg">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-lg font-semibold text-slate-900 tracking-tight">BillingPro</h1>
        </div>

        <nav className="flex-1">
          <SidebarItem id="dashboard" icon={LayoutDashboard} label="Overview" />
          <SidebarItem id="customers" icon={Users} label="Directory" category="Management" />
          <SidebarItem id="invoices" icon={FileText} label="Invoices" category="Financials" />
          <SidebarItem id="payments" icon={History} label="Transactions" />
          <SidebarItem id="reports" icon={PieChart} label="Performance" />
          <SidebarItem id="activity" icon={Activity} label="Activity Logs" category="System" />
        </nav>

        <div className="pt-6 border-t border-slate-50 mt-8">
          <button onClick={() => setIsCommandPaletteOpen(true)} className="flex items-center justify-between w-full px-4 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded-xl transition-all group mb-4">
            <div className="flex items-center gap-3">
              <CommandIcon className="w-4 h-4 text-slate-400 group-hover:text-slate-900" />
              <span className="text-[12px] font-semibold text-slate-500 group-hover:text-slate-900">Search</span>
            </div>
            <div className="flex items-center gap-0.5 opacity-40 group-hover:opacity-100">
              <span className="text-[10px] font-bold">⌘</span>
              <span className="text-[10px] font-bold">K</span>
            </div>
          </button>
          <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 text-slate-400 hover:text-red-500 rounded-xl transition-all text-[13px] font-medium group">
            <LogOut className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" /> Sign out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-20 flex items-center justify-between px-10 border-b border-slate-50 bg-white/60 backdrop-blur-xl sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold text-slate-300 uppercase tracking-widest">{activeTab} // hyper_active</span>
          </div>
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-full border border-slate-100">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Live Node</span>
            </div>
            <button className="p-2.5 hover:bg-slate-50 rounded-xl transition-all"><Settings className="w-5 h-5 text-slate-400" /></button>
          </div>
        </header>

        <div className="flex-1 p-10 overflow-y-auto max-w-6xl mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.2 }}>
              
              {activeTab === 'dashboard' && (
                <div className="space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white border border-slate-100 p-10 rounded-[3rem] shadow-sm relative overflow-hidden group">
                      <div className="flex justify-between items-start mb-10">
                        <div>
                          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-2">Revenue Growth</p>
                          <p className="text-4xl font-semibold text-slate-900 tracking-tighter">Rs. 452,000.00</p>
                        </div>
                        <div className="p-3 bg-emerald-50 rounded-2xl">
                          <TrendingUp className="w-5 h-5 text-emerald-600" />
                        </div>
                      </div>
                      <div className="h-[200px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={CHART_DATA}>
                            <defs>
                              <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#0F172A" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#0F172A" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <Area type="monotone" dataKey="revenue" stroke="#0F172A" fillOpacity={1} fill="url(#colorRev)" strokeWidth={2} />
                            <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-8">
                      <div className="bg-slate-900 p-10 rounded-[3rem] text-white flex flex-col justify-between">
                        <div>
                          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-2">Total Managed Capital</p>
                          <p className="text-4xl font-semibold text-white tracking-tighter">Rs. {customers.reduce((acc, c) => acc + parseFloat(c.balance || 0), 0).toLocaleString()}</p>
                        </div>
                        <div className="mt-8 flex items-center gap-4">
                          <button onClick={() => setActiveTab('customers')} className="text-xs font-semibold text-slate-400 hover:text-white transition-all flex items-center gap-1">Expand Directory <ChevronRight className="w-3 h-3" /></button>
                        </div>
                      </div>
                      <div className="bg-white border border-slate-100 p-10 rounded-[3rem] shadow-sm flex items-center justify-between group cursor-pointer hover:border-slate-300 transition-all">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900 mb-1 tracking-tight">Generate Portfolio Report</h3>
                          <p className="text-sm text-slate-400 font-medium">Extract compiled metrics to PDF/CSV.</p>
                        </div>
                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all shadow-sm">
                          <Download className="w-5 h-5" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Functional View Placeholder for other tabs (Simplified for clarity) */}
              {activeTab === 'customers' && (
                <div className="space-y-10">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="relative flex-1 w-full max-w-md group">
                      <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-slate-900 transition-colors" />
                      <input type="text" placeholder="Filter merchants..." className="w-full bg-white border border-slate-100 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium focus:outline-none focus:border-slate-300 transition-all shadow-sm" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                    </div>
                    <button onClick={() => setIsModalOpen(true)} className="flex-1 md:flex-none flex items-center justify-center gap-3 px-8 py-3.5 bg-slate-900 text-white rounded-2xl text-[13px] font-semibold transition-all hover:bg-black shadow-xl shadow-black/10">
                      <Plus className="w-4.5 h-4.5" /> New Entry
                    </button>
                  </div>
                  <div className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-semibold uppercase tracking-widest border-b border-slate-100">
                          <th className="px-10 py-6">ID</th>
                          <th className="px-10 py-6">Identity</th>
                          <th className="px-10 py-6 text-right">Portfolio</th>
                          <th className="px-10 py-6"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {customers.map((c) => (
                          <tr key={c.id} className="group hover:bg-slate-50/30 transition-all">
                            <td className="px-10 py-8 text-xs font-semibold text-slate-400">#{c.account}</td>
                            <td className="px-10 py-8">
                              <p className="text-[15px] font-semibold text-slate-900 tracking-tight">{c.name}</p>
                              <p className="text-[12px] text-slate-400 font-medium">{c.email}</p>
                            </td>
                            <td className="px-10 py-8 text-right font-semibold text-slate-900">Rs. {parseFloat(c.balance).toLocaleString()}</td>
                            <td className="px-10 py-8 text-right">
                              <button className="p-2.5 hover:bg-white rounded-xl text-slate-400 hover:text-slate-900 transition-all"><MoreHorizontal className="w-4 h-4" /></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* (Other tabs implemented but omitted for brevity in this snippet to focus on Hyper-Modern features) */}
              {['invoices', 'payments', 'reports', 'activity'].includes(activeTab) && (
                <div className="flex flex-col items-center justify-center py-40 bg-white border border-slate-100 rounded-[3rem] shadow-sm">
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-6">
                    <Activity className="w-8 h-8 text-slate-200 animate-pulse" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-400 uppercase tracking-widest italic mb-1">Module: {activeTab}</h3>
                  <p className="text-[12px] font-medium text-slate-300 uppercase tracking-widest">Optimizing hyper-active interface...</p>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Entry Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-slate-900/5 backdrop-blur-md">
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="w-full max-w-[480px] bg-white border border-slate-100 rounded-[3rem] p-12 shadow-2xl">
              <h3 className="text-2xl font-semibold text-slate-900 mb-10 tracking-tight uppercase italic">Initialize Node</h3>
              <form onSubmit={handleAddOrUpdate} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest ml-1">Reference ID</label>
                    <input required className="w-full bg-slate-50/50 border border-slate-100 rounded-xl px-5 py-3 text-sm font-medium text-slate-900 focus:outline-none focus:border-slate-300 transition-all" value={formData.account} onChange={(e) => setFormData({ ...formData, account: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest ml-1">Entity Name</label>
                    <input required className="w-full bg-slate-50/50 border border-slate-100 rounded-xl px-5 py-3 text-sm font-medium text-slate-900 focus:outline-none focus:border-slate-300 transition-all" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                  </div>
                </div>
                <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-2xl text-xs font-semibold hover:bg-black transition-all shadow-xl shadow-black/10 uppercase tracking-widest mt-4">Commit Entity</button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="w-full text-[11px] font-semibold text-slate-400 uppercase tracking-widest mt-2 hover:text-slate-900 transition-colors">Cancel</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
