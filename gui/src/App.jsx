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
  Database,
  Briefcase,
  Wallet
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
      <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center p-6 font-sans selection:bg-indigo-50">
        <div className="w-full max-w-[380px]">
          <div className="mb-12 text-center">
            <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-medium text-slate-900 tracking-tight">BillingPro</h1>
            <p className="text-slate-400 text-sm mt-2 font-medium tracking-wide">Secure Financial Intelligence</p>
          </div>
          <div className="bg-white border border-slate-100 rounded-3xl p-10 shadow-[0_20px_50px_rgba(0,0,0,0.04)]">
            <form onSubmit={(e) => {
              e.preventDefault();
              if (e.target.password.value === 'admin123') {
                setIsLoggedIn(true);
                localStorage.setItem('billing_auth', 'true');
              }
            }} className="space-y-8">
              <div className="space-y-3">
                <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.2em] ml-1">Access Key</label>
                <input name="password" type="password" required className="w-full border border-slate-100 rounded-xl py-3.5 px-5 text-sm focus:outline-none focus:border-slate-300 transition-all bg-slate-50/30" placeholder="••••••••" />
              </div>
              <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-xl text-sm font-semibold active:scale-[0.98] transition-all shadow-lg shadow-slate-100">Authenticate</button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#FDFDFD] text-slate-900 font-sans selection:bg-indigo-50">
      {/* Notifications */}
      <div className="fixed top-8 right-8 z-[100] space-y-3">
        <AnimatePresence>
          {notifications.map(n => (
            <motion.div key={n.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="px-6 py-4 rounded-2xl shadow-2xl border border-slate-50 bg-white/80 backdrop-blur-xl flex items-center gap-4 min-w-[280px]">
              <div className="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium text-slate-800">{n.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Classy Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-50 flex flex-col z-20">
        <div className="h-24 flex items-center gap-3 px-8">
          <div className="w-8 h-8 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg">
            <Wallet className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-[16px] font-bold text-slate-900 tracking-tight uppercase">BillingPro</h1>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'Insights' },
            { id: 'customers', icon: Users, label: 'Directory' },
            { id: 'invoices', icon: FileText, label: 'Ledger' },
            { id: 'payments', icon: CreditCard, label: 'Settlements' },
            { id: 'activity', icon: Activity, label: 'Records' },
          ].map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={cn("flex items-center gap-4 w-full px-4 py-3 rounded-xl transition-all text-[14px] font-medium group", activeTab === item.id ? "bg-slate-50 text-slate-900 shadow-sm border border-slate-100" : "text-slate-400 hover:text-slate-900 hover:bg-slate-50/50")}>
              <item.icon className={cn("w-4.5 h-4.5 transition-transform group-hover:scale-110", activeTab === item.id ? "text-slate-900" : "text-slate-300")} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-50">
          <button onClick={() => setIsLoggedIn(false)} className="flex items-center gap-4 w-full px-4 py-3 text-slate-400 hover:text-red-500 rounded-xl transition-all text-[14px] font-medium group">
            <LogOut className="w-4.5 h-4.5 group-hover:-translate-x-1 transition-transform" /> Exit System
          </button>
        </div>
      </aside>

      {/* Main Surface */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#FDFDFD]">
        <header className="h-24 flex items-center justify-between px-12 border-b border-slate-50 bg-white/40 backdrop-blur-xl sticky top-0 z-10">
          <div>
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.3em] mb-1 block">node // active</span>
            <h2 className="text-[22px] font-semibold text-slate-900 tracking-tight capitalize">{activeTab === 'dashboard' ? 'Executive Overview' : activeTab}</h2>
          </div>
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Link Active</span>
            </div>
            <button className="p-3 hover:bg-slate-50 rounded-2xl transition-all relative">
              <Bell className="w-5 h-5 text-slate-300" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-4 pl-4 border-l border-slate-50">
              <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-xs font-bold text-slate-400 border border-slate-100">AD</div>
            </div>
          </div>
        </header>

        <div className="flex-1 p-12 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-12">
            
            <AnimatePresence mode="wait">
              <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                
                {activeTab === 'dashboard' && (
                  <div className="space-y-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                      {[
                        { label: 'Asset Valuation', value: 'Rs. 452,050.00', trend: '+12.4%', icon: Target },
                        { label: 'Entity Registry', value: customers.length, trend: 'Optimal', icon: Users },
                        { label: 'Pending Liquidity', value: 'Rs. 12,500.00', trend: '-2.1%', icon: FileText },
                        { label: 'Growth Index', value: '94.2%', trend: '+0.4%', icon: Activity },
                      ].map((stat, i) => (
                        <div key={i} className="bg-white border border-slate-50 p-8 rounded-3xl shadow-[0_15px_40px_rgba(0,0,0,0.02)] group hover:shadow-xl hover:border-slate-100 transition-all cursor-default">
                          <div className="flex items-center justify-between mb-6">
                            <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-slate-900 group-hover:text-white transition-all"><stat.icon className="w-4 h-4" /></div>
                            <span className={cn("text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest", stat.trend.includes('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400')}>{stat.trend}</span>
                          </div>
                          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">{stat.label}</p>
                          <p className="text-[24px] font-semibold text-slate-900 tracking-tight mt-2">{stat.value}</p>
                        </div>
                      ))}
                    </div>
                    
                    <div className="bg-white border border-slate-50 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] overflow-hidden">
                      <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                        <h3 className="text-[15px] font-semibold text-slate-900 tracking-tight">Recent Synchronization</h3>
                        <button className="text-[11px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors">Archive Logs</button>
                      </div>
                      <div className="divide-y divide-slate-50">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="px-8 py-6 flex items-center justify-between hover:bg-slate-50/30 transition-all group cursor-pointer">
                            <div className="flex items-center gap-6">
                              <div className="w-10 h-10 rounded-2xl bg-white border border-slate-50 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform"><Plus className="w-4 h-4 text-slate-900" /></div>
                              <div>
                                <p className="text-[15px] font-semibold text-slate-900">Entity Registry Updated</p>
                                <p className="text-xs text-slate-400 font-medium">Node BP-100{i} synchronized successfully by Admin</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="text-[11px] font-bold text-slate-300 uppercase tracking-widest">2h ago</span>
                              <ChevronRight className="w-4 h-4 text-slate-200 group-hover:text-slate-900 transition-all" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'customers' && (
                  <div className="space-y-10">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                      <div className="relative flex-1 w-full max-w-lg group">
                        <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-300 group-focus-within:text-slate-900 transition-colors" />
                        <input type="text" placeholder="Search registry indices..." className="w-full border border-slate-50 bg-white rounded-2xl py-4 pl-16 pr-8 text-[15px] font-medium focus:outline-none focus:border-slate-200 transition-all shadow-[0_10px_30px_rgba(0,0,0,0.02)]" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                      </div>
                      <button onClick={() => setIsModalOpen(true)} className="flex items-center justify-center gap-3 px-10 py-4 bg-slate-900 text-white rounded-2xl text-[14px] font-semibold hover:bg-black active:scale-95 transition-all shadow-xl shadow-slate-100">
                        <Plus className="w-4.5 h-4.5" /> Initialize Node
                      </button>
                    </div>

                    <div className="bg-white border border-slate-50 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] overflow-hidden">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50">
                            <th className="px-10 py-6">Index Ref</th>
                            <th className="px-10 py-6">Entity Identity</th>
                            <th className="px-10 py-6">Location</th>
                            <th className="px-10 py-6 text-right">Net Valuation</th>
                            <th className="px-10 py-6 text-right"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {customers.map((c) => (
                            <tr key={c.id} className="hover:bg-slate-50/30 transition-all group">
                              <td className="px-10 py-10 text-[11px] font-bold text-slate-300 tracking-widest">#{c.account}</td>
                              <td className="px-10 py-10">
                                <p className="text-[16px] font-semibold text-slate-900 tracking-tight">{c.name}</p>
                                <p className="text-[13px] text-slate-400 font-medium">{c.email}</p>
                              </td>
                              <td className="px-10 py-10 text-[14px] font-medium text-slate-400">{c.city || 'Colombo'}</td>
                              <td className="px-10 py-10 text-right text-[16px] font-semibold text-slate-900 tracking-tight">Rs. {parseFloat(c.balance).toLocaleString()}</td>
                              <td className="px-10 py-10 text-right">
                                <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                  <button className="p-3 hover:bg-white rounded-xl shadow-sm border border-slate-50 transition-all"><Edit2 className="w-4 h-4 text-slate-400 hover:text-slate-900" /></button>
                                  <button className="p-3 hover:bg-white rounded-xl shadow-sm border border-slate-50 transition-all group/del"><Trash2 className="w-4 h-4 text-slate-400 group-hover/del:text-red-500" /></button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {['invoices', 'payments', 'activity'].includes(activeTab) && (
                  <div className="py-40 text-center bg-white border border-slate-50 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)]">
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-inner">
                      <Settings className="w-8 h-8 text-slate-200 animate-spin-slow" />
                    </div>
                    <p className="text-[11px] font-bold text-slate-300 uppercase tracking-[0.4em]">Protocol Module: {activeTab}</p>
                    <p className="text-[13px] text-slate-400 mt-4 font-medium max-w-xs mx-auto leading-relaxed">Initializing high-fidelity financial synchronization for the requested environment.</p>
                  </div>
                )}

              </motion.div>
            </AnimatePresence>

          </div>
        </div>
      </main>

      {/* Classy Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-slate-900/5 backdrop-blur-md">
            <motion.div initial={{ opacity: 0, scale: 0.98, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98, y: 20 }} className="w-full max-w-[500px] bg-white border border-slate-50 rounded-[2.5rem] p-12 shadow-[0_40px_80px_rgba(0,0,0,0.1)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mt-16 opacity-50"></div>
              <h3 className="text-2xl font-semibold text-slate-900 mb-10 tracking-tight italic">Initialize New Node</h3>
              <form onSubmit={(e) => { e.preventDefault(); addNotification('Synchronization Successful'); setIsModalOpen(false); }} className="space-y-8 relative z-10">
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Account ID</label>
                    <input required className="w-full border border-slate-50 rounded-2xl px-5 py-3.5 text-[14px] font-medium focus:outline-none focus:border-slate-200 bg-slate-50/30 transition-all" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Identity Name</label>
                    <input required className="w-full border border-slate-50 rounded-2xl px-5 py-3.5 text-[14px] font-medium focus:outline-none focus:border-slate-200 bg-slate-50/30 transition-all" />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Digital Endpoint (Email)</label>
                  <input required type="email" className="w-full border border-slate-50 rounded-2xl px-5 py-3.5 text-[14px] font-medium focus:outline-none focus:border-slate-200 bg-slate-50/30 transition-all" />
                </div>
                <div className="flex gap-4 pt-6">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-6 py-4 text-sm font-semibold text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-2xl transition-all">Discard</button>
                  <button type="submit" className="flex-1 px-6 py-4 bg-slate-900 text-white text-sm font-semibold hover:bg-black rounded-2xl transition-all shadow-xl shadow-slate-100">Commit Node</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
