import React, { useState, useEffect, useMemo } from 'react';
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
  Command,
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
  TrendingUp,
  Mail,
  Smartphone,
  MapPin,
  Calendar
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

const INITIAL_INVOICES = [
  { id: 'INV-001', customer: 'Alexander Perera', amount: 45000.00, date: '2024-04-20', status: 'Paid' },
  { id: 'INV-002', customer: 'Julian Silva', amount: 12500.00, date: '2024-04-21', status: 'Pending' },
];

const INITIAL_PAYMENTS = [
  { id: 'TXN-9901', customer: 'Alexander Perera', amount: 45000.00, method: 'Bank Transfer', date: '2024-04-20' },
  { id: 'TXN-9902', customer: 'Julian Silva', amount: 8000.00, method: 'Card', date: '2024-04-19' },
];

const INITIAL_LOGS = [
  { id: 1, action: 'Entity Initialized', user: 'Admin', time: '2 mins ago', details: 'Added Alexander Perera' },
  { id: 2, action: 'Invoice Generated', user: 'Admin', time: '1 hour ago', details: 'INV-001 created' },
  { id: 3, action: 'Payment Received', user: 'System', time: '3 hours ago', details: 'TXN-9901 confirmed' },
];

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('billing_auth') === 'true');
  const [activeTab, setActiveTab] = useState('customers');
  const [customers, setCustomers] = useState(() => JSON.parse(localStorage.getItem('billing_customers')) || INITIAL_CUSTOMERS);
  const [invoices, setInvoices] = useState(() => JSON.parse(localStorage.getItem('billing_invoices')) || INITIAL_INVOICES);
  const [payments, setPayments] = useState(() => JSON.parse(localStorage.getItem('billing_payments')) || INITIAL_PAYMENTS);
  const [logs, setLogs] = useState(INITIAL_LOGS);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [formData, setFormData] = useState({ account: '', name: '', email: '', type: 'Standard', balance: '', vatEnabled: false, city: 'Colombo' });
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    localStorage.setItem('billing_customers', JSON.stringify(customers));
    localStorage.setItem('billing_invoices', JSON.stringify(invoices));
    localStorage.setItem('billing_payments', JSON.stringify(payments));
  }, [customers, invoices, payments]);

  const addNotification = (message, type = 'success') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 3000);
  };

  const addLog = (action, details) => {
    setLogs(prev => [{ id: Date.now(), action, user: 'Admin', time: 'Just now', details }, ...prev]);
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
      addLog('Registry Update', `Modified ${data.name}`);
    } else {
      setCustomers([...customers, { id: Date.now().toString(), ...data }]);
      addNotification('Initialized');
      addLog('Registry Add', `Added ${data.name}`);
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
          activeTab === id ? "bg-slate-900 text-white shadow-lg" : "text-slate-500 hover:text-slate-900 hover:bg-slate-100/50"
        )}
      >
        <div className="flex items-center gap-3">
          <Icon className={cn("w-4 h-4", activeTab === id ? "text-white" : "text-slate-400 group-hover:text-slate-600")} />
          <span className="text-[14px] font-medium">{label}</span>
        </div>
        {activeTab === id && <motion.div layoutId="sidebar-active" className="w-1 h-1 bg-white rounded-full" />}
      </button>
    </div>
  );

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center p-6 font-sans">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-[380px]">
          <div className="text-center mb-10">
            <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-xl">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">BillingPro</h1>
            <p className="text-slate-400 text-xs mt-1 font-medium tracking-widest uppercase italic">Secure Hub</p>
          </div>
          <div className="bg-white border border-slate-100 rounded-3xl p-10 shadow-sm">
            <form onSubmit={(e) => {
              e.preventDefault();
              if (e.target.password.value === 'admin123') {
                setIsLoggedIn(true);
                localStorage.setItem('billing_auth', 'true');
                addNotification('Access Granted');
              }
            }} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider ml-1">Access Credentials</label>
                <input name="password" type="password" required className="w-full border border-slate-100 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-slate-300 transition-all bg-slate-50/30" placeholder="••••••••" />
              </div>
              <button type="submit" className="w-full bg-slate-900 text-white py-3.5 rounded-xl text-sm font-semibold active:scale-[0.98] transition-all">Authenticate</button>
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

      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-100 flex flex-col p-6 z-20 overflow-y-auto">
        <div className="flex items-center gap-3 mb-8 px-1 pt-2">
          <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
            <Command className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-lg font-semibold text-slate-900 tracking-tight">BillingPro</h1>
        </div>

        <nav className="flex-1">
          <SidebarItem id="dashboard" icon={LayoutDashboard} label="Overview" />
          
          <SidebarItem id="customers" icon={Users} label="Directory" category="Management" />
          <SidebarItem id="groups" icon={MoreHorizontal} label="Client Groups" />
          
          <SidebarItem id="invoices" icon={FileText} label="Invoices" category="Financials" />
          <SidebarItem id="payments" icon={History} label="Transactions" />
          <SidebarItem id="reports" icon={PieChart} label="Performance" />
          
          <SidebarItem id="activity" icon={Activity} label="Activity Logs" category="System" />
          <SidebarItem id="support" icon={HelpCircle} label="Documentation" />
        </nav>

        <div className="pt-6 border-t border-slate-50 mt-8">
          <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 text-slate-400 hover:text-red-500 rounded-xl transition-all text-[13px] font-medium group">
            <LogOut className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" /> Sign out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-20 flex items-center justify-between px-10 border-b border-slate-50 bg-white/50 backdrop-blur-xl sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold text-slate-300 uppercase tracking-widest">{activeTab} // node_active</span>
          </div>
          <div className="flex items-center gap-5">
            <button className="p-2.5 hover:bg-slate-50 rounded-xl transition-all relative"><Bell className="w-5 h-5 text-slate-400" /></button>
          </div>
        </header>

        <div className="flex-1 p-10 overflow-y-auto max-w-6xl mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.2 }}>
              
              {/* Overview / Dashboard */}
              {activeTab === 'dashboard' && (
                <div className="space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white border border-slate-100 p-8 rounded-[2rem] shadow-sm">
                      <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-2">Portfolio Value</p>
                      <p className="text-3xl font-semibold text-slate-900 tracking-tighter">Rs. {customers.reduce((acc, c) => acc + parseFloat(c.balance || 0), 0).toLocaleString()}</p>
                      <div className="mt-6 flex items-center text-emerald-600 text-xs font-bold gap-1 bg-emerald-50 w-fit px-2 py-1 rounded-lg">
                        <ArrowUpRight className="w-3.5 h-3.5" /> 12% Growth
                      </div>
                    </div>
                    <div className="bg-white border border-slate-100 p-8 rounded-[2rem] shadow-sm">
                      <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-2">Pending Revenue</p>
                      <p className="text-3xl font-semibold text-slate-900 tracking-tighter">Rs. {invoices.filter(i => i.status === 'Pending').reduce((acc, i) => acc + i.amount, 0).toLocaleString()}</p>
                      <p className="mt-6 text-[11px] font-medium text-slate-400">{invoices.filter(i => i.status === 'Pending').length} Pending Invoices</p>
                    </div>
                    <div className="bg-slate-900 p-8 rounded-[2rem] text-white">
                      <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-2">Total Collections</p>
                      <p className="text-3xl font-semibold text-white tracking-tighter">Rs. {payments.reduce((acc, p) => acc + p.amount, 0).toLocaleString()}</p>
                      <div className="mt-6 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                        <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest tracking-widest">Network Secure</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Directory / Customers */}
              {activeTab === 'customers' && (
                <div className="space-y-10">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="relative flex-1 w-full max-w-md group">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-slate-900 transition-colors" />
                      <input type="text" placeholder="Query registry..." className="w-full bg-white border border-slate-100 rounded-2xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-slate-300 transition-all" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                    </div>
                    <button onClick={() => { setEditingCustomer(null); setFormData({ account: '', name: '', email: '', type: 'Standard', balance: '', vatEnabled: false, city: 'Colombo' }); setIsModalOpen(true); }} className="flex-1 md:flex-none flex items-center justify-center gap-3 px-8 py-3 bg-slate-900 text-white rounded-2xl text-[13px] font-semibold transition-all hover:bg-black active:scale-95 shadow-sm">
                      <Plus className="w-4 h-4" /> New Entry
                    </button>
                  </div>
                  <div className="bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-sm">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-semibold uppercase tracking-widest border-b border-slate-100">
                          <th className="px-10 py-5">Reference</th>
                          <th className="px-10 py-5">Merchant Details</th>
                          <th className="px-10 py-5">City</th>
                          <th className="px-10 py-5 text-right">Net Value</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {customers.map((c) => (
                          <tr key={c.id} className="group hover:bg-slate-50/30 transition-all cursor-pointer">
                            <td className="px-10 py-8 text-xs font-semibold text-slate-400 tracking-tighter">#{c.account}</td>
                            <td className="px-10 py-8">
                              <p className="text-[15px] font-semibold text-slate-900 tracking-tight">{c.name}</p>
                              <p className="text-[12px] text-slate-400 font-medium">{c.email}</p>
                            </td>
                            <td className="px-10 py-8 text-[13px] font-medium text-slate-400">{c.city}</td>
                            <td className="px-10 py-8 text-right">
                              <p className="text-[15px] font-semibold text-slate-900">Rs. {parseFloat(c.balance).toLocaleString()}</p>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Invoices Page */}
              {activeTab === 'invoices' && (
                <div className="space-y-10">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-slate-900 tracking-tight">Invoice History</h3>
                    <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-[13px] font-semibold text-slate-600 hover:bg-slate-50 transition-all"><Plus className="w-4 h-4" /> New Invoice</button>
                  </div>
                  <div className="bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-sm">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-semibold uppercase tracking-widest border-b border-slate-100">
                          <th className="px-10 py-5">Invoice ID</th>
                          <th className="px-10 py-5">Recipient</th>
                          <th className="px-10 py-5">Date</th>
                          <th className="px-10 py-5">Status</th>
                          <th className="px-10 py-5 text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {invoices.map((i) => (
                          <tr key={i.id} className="hover:bg-slate-50/30 transition-all">
                            <td className="px-10 py-8 text-xs font-semibold text-slate-900">{i.id}</td>
                            <td className="px-10 py-8 text-[15px] font-semibold text-slate-900">{i.customer}</td>
                            <td className="px-10 py-8 text-[13px] font-medium text-slate-400">{i.date}</td>
                            <td className="px-10 py-8">
                              <span className={cn("text-[10px] font-semibold px-3 py-1 rounded-lg border uppercase tracking-widest", i.status === 'Paid' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100")}>{i.status}</span>
                            </td>
                            <td className="px-10 py-8 text-right font-semibold">Rs. {i.amount.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Payments / Transactions */}
              {activeTab === 'payments' && (
                <div className="space-y-10">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-slate-900 tracking-tight">Recent Transactions</h3>
                    <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-[13px] font-semibold text-slate-600 hover:bg-slate-50 transition-all"><Download className="w-4 h-4" /> Export All</button>
                  </div>
                  <div className="bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-sm">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-semibold uppercase tracking-widest border-b border-slate-100">
                          <th className="px-10 py-5">TXN Hash</th>
                          <th className="px-10 py-5">Source</th>
                          <th className="px-10 py-5">Method</th>
                          <th className="px-10 py-5">Timestamp</th>
                          <th className="px-10 py-5 text-right">Value</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {payments.map((p) => (
                          <tr key={p.id} className="hover:bg-slate-50/30 transition-all">
                            <td className="px-10 py-8 text-xs font-semibold text-blue-600">{p.id}</td>
                            <td className="px-10 py-8 text-[15px] font-semibold text-slate-900">{p.customer}</td>
                            <td className="px-10 py-8 text-[13px] font-medium text-slate-400">{p.method}</td>
                            <td className="px-10 py-8 text-[13px] font-medium text-slate-400">{p.date}</td>
                            <td className="px-10 py-8 text-right font-semibold text-emerald-600">+ Rs. {p.amount.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Reports / Performance */}
              {activeTab === 'reports' && (
                <div className="space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="bg-white border border-slate-100 p-10 rounded-[3rem] shadow-sm">
                      <h3 className="text-lg font-semibold text-slate-900 mb-8 tracking-tight">Revenue Metrics</h3>
                      <div className="space-y-8">
                        <div>
                          <div className="flex justify-between mb-3 text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                            <span>Target Achievement</span>
                            <span>84%</span>
                          </div>
                          <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                            <div className="h-full bg-slate-900 w-[84%]" />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-3 text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                            <span>Collection Efficiency</span>
                            <span>92%</span>
                          </div>
                          <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                            <div className="h-full bg-slate-900 w-[92%]" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-slate-50 border border-slate-100 p-10 rounded-[3rem] flex flex-col justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2 tracking-tight">Financial Summary</h3>
                        <p className="text-sm text-slate-400">Global performance index across all merchant nodes.</p>
                      </div>
                      <div className="mt-10 grid grid-cols-2 gap-4">
                        <div className="bg-white p-6 rounded-2xl border border-slate-100">
                          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1">Growth</p>
                          <p className="text-xl font-bold text-slate-900">+12.5%</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-slate-100">
                          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1">Retention</p>
                          <p className="text-xl font-bold text-slate-900">98.2%</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Activity Logs */}
              {activeTab === 'activity' && (
                <div className="space-y-10">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-slate-900 tracking-tight">Live System Logs</h3>
                    <button onClick={() => setLogs(INITIAL_LOGS)} className="text-xs font-semibold text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">Clear Logs</button>
                  </div>
                  <div className="bg-white border border-slate-100 rounded-[2.5rem] p-4 shadow-sm">
                    {logs.map((log) => (
                      <div key={log.id} className="flex items-center gap-6 px-6 py-6 border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-all rounded-2xl">
                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Activity className="w-4 h-4 text-slate-400" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-[15px] font-semibold text-slate-900">{log.action}</p>
                            <span className="text-xs font-medium text-slate-400">{log.time}</span>
                          </div>
                          <p className="text-[13px] text-slate-400 mt-0.5">{log.details}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded-lg">ID: {log.user}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Client Groups */}
              {activeTab === 'groups' && (
                <div className="space-y-10">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-slate-900 tracking-tight">Merchant Classification</h3>
                    <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-[13px] font-semibold transition-all shadow-sm"><Plus className="w-4 h-4" /> Create Group</button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[
                      { name: 'VIP Merchants', count: 12, color: 'bg-slate-900 text-white' },
                      { name: 'Local Bulk', count: 45, color: 'bg-white text-slate-900 border border-slate-100' },
                      { name: 'Digital Service', count: 28, color: 'bg-white text-slate-900 border border-slate-100' },
                    ].map((g, i) => (
                      <div key={i} className={cn("p-10 rounded-[3rem] shadow-sm group hover:scale-105 transition-all cursor-pointer", g.color)}>
                        <h4 className="text-lg font-semibold mb-2 tracking-tight">{g.name}</h4>
                        <p className={cn("text-sm font-medium", g.color.includes('white') ? 'text-slate-400' : 'text-slate-500')}>{g.count} Active Nodes</p>
                        <div className="mt-10 flex items-center justify-between">
                          <div className="flex -space-x-2">
                            {[1, 2, 3].map(j => <div key={j} className="w-8 h-8 rounded-full border-2 border-slate-100 bg-slate-50" />)}
                          </div>
                          <ChevronRight className="w-5 h-5 opacity-40 group-hover:opacity-100 transition-all" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Support / Help */}
              {activeTab === 'support' && (
                <div className="max-w-4xl space-y-10 mx-auto">
                  <div className="bg-white border border-slate-100 p-12 rounded-[3.5rem] shadow-sm text-center">
                    <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-xl">
                      <HelpCircle className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-semibold text-slate-900 mb-4 tracking-tight">Need technical assistance?</h3>
                    <p className="text-slate-400 text-sm max-w-md mx-auto mb-10 leading-relaxed font-medium">Access our global support network or browse the technical documentation for immediate assistance.</p>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                      <button className="w-full md:w-auto px-10 py-4 bg-slate-900 text-white rounded-2xl text-[14px] font-semibold transition-all">Open Support Ticket</button>
                      <button className="w-full md:w-auto px-10 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl text-[14px] font-semibold transition-all">Browse Docs</button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-slate-50 border border-slate-100 p-8 rounded-[2.5rem] flex items-center gap-6">
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm"><Mail className="w-6 h-6 text-slate-400" /></div>
                      <div>
                        <p className="text-[15px] font-semibold text-slate-900">Email Support</p>
                        <p className="text-xs font-medium text-slate-400 uppercase tracking-widest mt-0.5">Response in < 2h</p>
                      </div>
                    </div>
                    <div className="bg-slate-50 border border-slate-100 p-8 rounded-[2.5rem] flex items-center gap-6">
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm"><Smartphone className="w-6 h-6 text-slate-400" /></div>
                      <div>
                        <p className="text-[15px] font-semibold text-slate-900">Direct Line</p>
                        <p className="text-xs font-medium text-slate-400 uppercase tracking-widest mt-0.5">+94 11 234 5678</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Modal - Common for Registry updates */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-slate-900/5 backdrop-blur-md">
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="w-full max-w-[480px] bg-white border border-slate-100 rounded-[2.5rem] p-12 shadow-xl">
              <h3 className="text-2xl font-semibold text-slate-900 mb-10 tracking-tight uppercase italic">{editingCustomer ? 'Update' : 'Initialize'} Node</h3>
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
                <div className="space-y-2">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest ml-1">Email Endpoint</label>
                  <input required type="email" className="w-full bg-slate-50/50 border border-slate-100 rounded-xl px-5 py-3 text-sm font-medium text-slate-900 focus:outline-none focus:border-slate-300 transition-all" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest ml-1">Classification</label>
                    <select className="w-full bg-slate-50/50 border border-slate-100 rounded-xl px-5 py-3 text-sm font-medium text-slate-900 focus:outline-none transition-all appearance-none" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                      <option value="Standard">Standard</option>
                      <option value="Premium">Premium</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest ml-1">Current Balance</label>
                    <input required type="number" className="w-full bg-slate-50/50 border border-slate-100 rounded-xl px-5 py-3 text-sm font-medium text-slate-900 focus:outline-none focus:border-slate-300 transition-all" value={formData.balance} onChange={(e) => setFormData({ ...formData, balance: e.target.value })} />
                  </div>
                </div>
                <div className="flex items-center gap-3 px-1 py-1">
                  <input type="checkbox" id="vat" className="w-4.5 h-4.5 accent-slate-900 rounded" checked={formData.vatEnabled} onChange={(e) => setFormData({ ...formData, vatEnabled: e.target.checked })} />
                  <label htmlFor="vat" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Enable Tax Processing (18%)</label>
                </div>
                <div className="flex gap-4 pt-8">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-6 py-3.5 rounded-2xl bg-slate-50 text-xs font-semibold text-slate-400 hover:bg-slate-100 transition-all uppercase tracking-widest">Cancel</button>
                  <button type="submit" className="flex-1 px-6 py-3.5 rounded-2xl bg-slate-900 text-white text-xs font-semibold hover:bg-black transition-all shadow-sm uppercase tracking-widest">Commit</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
