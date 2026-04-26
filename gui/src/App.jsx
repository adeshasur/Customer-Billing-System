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
  Activity,
  ArrowUpRight,
  Settings,
  CreditCard,
  Target,
  Briefcase,
  Wallet,
  DollarSign,
  PlusCircle
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion, AnimatePresence } from 'framer-motion';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Initial Data Generators
const INITIAL_CUSTOMERS = [
  { id: '1', account: 'BP-1001', name: 'Alexander Perera', email: 'alex@billingpro.io', balance: 125000.00, city: 'Colombo' },
  { id: '2', account: 'BP-1002', name: 'Julian Silva', email: 'julian@billingpro.io', balance: 45000.00, city: 'Kandy' },
];

const INITIAL_INVOICES = [
  { id: 'INV-1001', customerId: '1', amount: 45000, status: 'Paid', date: '2024-04-20' },
  { id: 'INV-1002', customerId: '2', amount: 12500, status: 'Pending', date: '2024-04-21' },
];

const INITIAL_PAYMENTS = [
  { id: 'TXN-9901', customerId: '1', amount: 45000, method: 'Bank Transfer', date: '2024-04-20' },
];

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('billing_auth') === 'true');
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // State Management
  const [customers, setCustomers] = useState(() => JSON.parse(localStorage.getItem('billing_customers')) || INITIAL_CUSTOMERS);
  const [invoices, setInvoices] = useState(() => JSON.parse(localStorage.getItem('billing_invoices')) || INITIAL_INVOICES);
  const [payments, setPayments] = useState(() => JSON.parse(localStorage.getItem('billing_payments')) || INITIAL_PAYMENTS);
  const [logs, setLogs] = useState(() => JSON.parse(localStorage.getItem('billing_logs')) || []);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('customer'); // 'customer', 'invoice', 'payment'
  const [notifications, setNotifications] = useState([]);

  // Auto-Save
  useEffect(() => {
    localStorage.setItem('billing_customers', JSON.stringify(customers));
    localStorage.setItem('billing_invoices', JSON.stringify(invoices));
    localStorage.setItem('billing_payments', JSON.stringify(payments));
    localStorage.setItem('billing_logs', JSON.stringify(logs));
  }, [customers, invoices, payments, logs]);

  const addNotification = (message) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message }]);
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 3000);
  };

  const addLog = (action, details) => {
    const newLog = { id: Date.now(), action, details, time: new Date().toLocaleTimeString(), date: new Date().toLocaleDateString() };
    setLogs(prev => [newLog, ...prev].slice(0, 50));
  };

  // Business Logic
  const createCustomer = (data) => {
    const newCustomer = { id: Date.now().toString(), ...data, balance: parseFloat(data.balance || 0) };
    setCustomers(prev => [...prev, newCustomer]);
    addLog('Customer Created', `${newCustomer.name} added to registry`);
    addNotification('Customer Initialized');
  };

  const createInvoice = (data) => {
    const newInvoice = { id: `INV-${Math.floor(1000 + Math.random() * 9000)}`, ...data, date: new Date().toISOString().split('T')[0] };
    setInvoices(prev => [...prev, newInvoice]);
    
    // Update Customer Balance
    setCustomers(prev => prev.map(c => c.id === data.customerId ? { ...c, balance: c.balance + parseFloat(data.amount) } : c));
    
    addLog('Invoice Generated', `${newInvoice.id} for Rs. ${data.amount}`);
    addNotification('Invoice Dispatched');
  };

  const recordPayment = (data) => {
    const newPayment = { id: `TXN-${Math.floor(9000 + Math.random() * 999)}`, ...data, date: new Date().toISOString().split('T')[0] };
    setPayments(prev => [...prev, newPayment]);
    
    // Update Customer Balance
    setCustomers(prev => prev.map(c => c.id === data.customerId ? { ...c, balance: c.balance - parseFloat(data.amount) } : c));
    
    addLog('Payment Received', `Rs. ${data.amount} from customer ID: ${data.customerId}`);
    addNotification('Capital Settled');
  };

  // Derived Stats
  const totalBalance = useMemo(() => customers.reduce((sum, c) => sum + c.balance, 0), [customers]);
  const totalRevenue = useMemo(() => payments.reduce((sum, p) => sum + parseFloat(p.amount), 0), [payments]);
  const pendingAmount = useMemo(() => invoices.filter(i => i.status === 'Pending').reduce((sum, i) => sum + parseFloat(i.amount), 0), [invoices]);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center p-6 font-sans">
        <div className="w-full max-w-[380px]">
          <div className="mb-12 text-center">
            <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-semibold text-slate-900">BillingPro</h1>
            <p className="text-slate-400 text-sm mt-2">Executive Access Control</p>
          </div>
          <div className="bg-white border border-slate-100 rounded-3xl p-10 shadow-sm">
            <form onSubmit={(e) => {
              e.preventDefault();
              if (e.target.password.value === 'admin123') {
                setIsLoggedIn(true);
                localStorage.setItem('billing_auth', 'true');
              }
            }} className="space-y-6">
              <input name="password" type="password" required className="w-full border border-slate-100 rounded-xl py-3.5 px-5 text-sm focus:outline-none focus:border-slate-300 transition-all bg-slate-50/30" placeholder="Master Access Key" />
              <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-xl text-sm font-semibold transition-all">Unlock System</button>
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
            <motion.div key={n.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="px-6 py-4 rounded-2xl shadow-xl border border-slate-50 bg-white/90 backdrop-blur-xl flex items-center gap-4">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span className="text-sm font-semibold">{n.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Classy Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-50 flex flex-col z-20 sticky top-0 h-screen">
        <div className="h-24 flex items-center gap-3 px-8">
          <div className="w-8 h-8 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg"><Wallet className="w-4 h-4 text-white" /></div>
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
              <item.icon className={cn("w-4.5 h-4.5", activeTab === item.id ? "text-slate-900" : "text-slate-300")} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-50 mt-auto">
          <button onClick={() => setIsLoggedIn(false)} className="flex items-center gap-4 w-full px-4 py-3 text-slate-400 hover:text-red-500 rounded-xl transition-all text-[14px] font-medium group">
            <LogOut className="w-4.5 h-4.5" /> Exit System
          </button>
        </div>
      </aside>

      {/* Main Surface */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#FDFDFD]">
        <header className="h-24 flex items-center justify-between px-12 border-b border-slate-50 bg-white/40 backdrop-blur-xl sticky top-0 z-10">
          <div>
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.3em] mb-1 block">node // active</span>
            <h2 className="text-[22px] font-semibold text-slate-900 tracking-tight capitalize">{activeTab}</h2>
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => { setModalType('payment'); setIsModalOpen(true); }} className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-slate-100"><DollarSign className="w-4 h-4" /> Quick Settlement</button>
            <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-xs font-bold text-slate-400 border border-slate-100">AD</div>
          </div>
        </header>

        <div className="flex-1 p-12 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-12">
            
            <AnimatePresence mode="wait">
              <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                
                {/* Dashboard View */}
                {activeTab === 'dashboard' && (
                  <div className="space-y-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                      <div className="bg-white border border-slate-50 p-8 rounded-3xl shadow-[0_15px_40px_rgba(0,0,0,0.02)]">
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Capital Valuation</p>
                        <p className="text-[28px] font-semibold text-slate-900 tracking-tight">Rs. {totalBalance.toLocaleString()}</p>
                        <div className="mt-6 flex items-center gap-2 text-emerald-500 text-[10px] font-bold uppercase tracking-widest"><ArrowUpRight className="w-3 h-3" /> Real-time Sync</div>
                      </div>
                      <div className="bg-white border border-slate-50 p-8 rounded-3xl shadow-[0_15px_40px_rgba(0,0,0,0.02)]">
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Total Revenue</p>
                        <p className="text-[28px] font-semibold text-slate-900 tracking-tight">Rs. {totalRevenue.toLocaleString()}</p>
                        <div className="mt-6 flex items-center gap-2 text-slate-300 text-[10px] font-bold uppercase tracking-widest"><CreditCard className="w-3 h-3" /> Verified Capital</div>
                      </div>
                      <div className="bg-white border border-slate-50 p-8 rounded-3xl shadow-[0_15px_40px_rgba(0,0,0,0.02)]">
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Pending Bills</p>
                        <p className="text-[28px] font-semibold text-slate-900 tracking-tight">Rs. {pendingAmount.toLocaleString()}</p>
                        <div className="mt-6 flex items-center gap-2 text-amber-500 text-[10px] font-bold uppercase tracking-widest"><FileText className="w-3 h-3" /> {invoices.filter(i => i.status === 'Pending').length} Actionable</div>
                      </div>
                      <div className="bg-slate-900 p-8 rounded-3xl shadow-xl">
                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">Entity Count</p>
                        <p className="text-[28px] font-semibold text-white tracking-tight">{customers.length}</p>
                        <button onClick={() => { setModalType('customer'); setIsModalOpen(true); }} className="mt-6 flex items-center gap-2 text-indigo-400 text-[10px] font-bold uppercase tracking-widest hover:text-white transition-all"><PlusCircle className="w-3 h-3" /> Expand Registry</button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Customers View */}
                {activeTab === 'customers' && (
                  <div className="space-y-10">
                    <div className="flex items-center justify-between">
                      <div className="relative w-full max-w-lg group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-300 group-focus-within:text-slate-900" />
                        <input type="text" placeholder="Filter registry indices..." className="w-full border border-slate-50 bg-white rounded-2xl py-4 pl-16 pr-8 text-[15px] font-medium focus:outline-none shadow-sm" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                      </div>
                      <button onClick={() => { setModalType('customer'); setIsModalOpen(true); }} className="px-10 py-4 bg-slate-900 text-white rounded-2xl text-[14px] font-semibold hover:bg-black transition-all">Initialize Node</button>
                    </div>
                    <div className="bg-white border border-slate-50 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] overflow-hidden">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50">
                            <th className="px-10 py-6">Index</th>
                            <th className="px-10 py-6">Entity Identity</th>
                            <th className="px-10 py-6 text-right">Net Valuation</th>
                            <th className="px-10 py-6"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {customers.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase())).map((c) => (
                            <tr key={c.id} className="hover:bg-slate-50/30 transition-all group">
                              <td className="px-10 py-10 text-[11px] font-bold text-slate-300 tracking-widest">#{c.account}</td>
                              <td className="px-10 py-10">
                                <p className="text-[16px] font-semibold text-slate-900 tracking-tight">{c.name}</p>
                                <p className="text-[13px] text-slate-400 font-medium">{c.email}</p>
                              </td>
                              <td className="px-10 py-10 text-right text-[16px] font-semibold text-slate-900 tracking-tight">Rs. {c.balance.toLocaleString()}</td>
                              <td className="px-10 py-10 text-right">
                                <button onClick={() => { setModalType('invoice'); setIsModalOpen(true); }} className="text-[11px] font-bold text-indigo-500 uppercase tracking-widest hover:text-indigo-700 transition-all">Bill Entity</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Invoices View */}
                {activeTab === 'invoices' && (
                  <div className="space-y-10">
                    <div className="flex items-center justify-between">
                      <h3 className="text-[18px] font-semibold text-slate-900 tracking-tight">Ledger Operations</h3>
                      <button onClick={() => { setModalType('invoice'); setIsModalOpen(true); }} className="px-8 py-3.5 bg-white border border-slate-100 rounded-2xl text-[13px] font-semibold text-slate-600 hover:bg-slate-50 transition-all">Generate Invoice</button>
                    </div>
                    <div className="bg-white border border-slate-50 rounded-[2.5rem] shadow-sm overflow-hidden">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50">
                            <th className="px-10 py-6">Invoice ID</th>
                            <th className="px-10 py-6">Recipient</th>
                            <th className="px-10 py-6">Status</th>
                            <th className="px-10 py-6 text-right">Amount</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {invoices.map((i) => (
                            <tr key={i.id} className="hover:bg-slate-50/30 transition-all">
                              <td className="px-10 py-8 text-[11px] font-bold text-slate-900 tracking-widest">{i.id}</td>
                              <td className="px-10 py-8 text-[15px] font-semibold text-slate-900">{customers.find(c => c.id === i.customerId)?.name || 'Unknown'}</td>
                              <td className="px-10 py-8">
                                <span className={cn("text-[10px] font-bold px-3 py-1 rounded-lg border uppercase tracking-widest", i.status === 'Paid' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100")}>{i.status}</span>
                              </td>
                              <td className="px-10 py-8 text-right font-semibold">Rs. {i.amount.toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Payments View */}
                {activeTab === 'payments' && (
                  <div className="space-y-10">
                    <div className="flex items-center justify-between">
                      <h3 className="text-[18px] font-semibold text-slate-900 tracking-tight">Settlement History</h3>
                      <button onClick={() => { setModalType('payment'); setIsModalOpen(true); }} className="px-8 py-3.5 bg-slate-900 text-white rounded-2xl text-[13px] font-semibold hover:bg-black transition-all shadow-lg">Record Capital</button>
                    </div>
                    <div className="bg-white border border-slate-50 rounded-[2.5rem] shadow-sm overflow-hidden">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50">
                            <th className="px-10 py-6">TXN Ref</th>
                            <th className="px-10 py-6">Source</th>
                            <th className="px-10 py-6">Method</th>
                            <th className="px-10 py-6 text-right">Value</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {payments.map((p) => (
                            <tr key={p.id} className="hover:bg-slate-50/30 transition-all">
                              <td className="px-10 py-8 text-[11px] font-bold text-indigo-600 tracking-widest">{p.id}</td>
                              <td className="px-10 py-8 text-[15px] font-semibold text-slate-900">{customers.find(c => c.id === p.customerId)?.name || 'Unknown'}</td>
                              <td className="px-10 py-8 text-[13px] font-medium text-slate-400">{p.method}</td>
                              <td className="px-10 py-8 text-right font-semibold text-emerald-600">+ Rs. {p.amount.toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Activity View */}
                {activeTab === 'activity' && (
                  <div className="space-y-10">
                    <div className="flex items-center justify-between">
                      <h3 className="text-[18px] font-semibold text-slate-900 tracking-tight">System Records</h3>
                      <button onClick={() => setLogs([])} className="text-[10px] font-bold text-slate-300 uppercase tracking-widest hover:text-red-500 transition-colors">Wipe Records</button>
                    </div>
                    <div className="bg-white border border-slate-50 rounded-[2.5rem] shadow-sm p-4">
                      {logs.length === 0 ? (
                        <div className="py-20 text-center text-slate-300 italic font-medium">No activity records synchronized.</div>
                      ) : (
                        logs.map((log) => (
                          <div key={log.id} className="flex items-center gap-8 px-8 py-6 hover:bg-slate-50/50 transition-all rounded-3xl border-b border-slate-50 last:border-0">
                            <div className="w-10 h-10 bg-slate-50 rounded-2xl flex items-center justify-center flex-shrink-0 text-slate-400"><Activity className="w-4 h-4" /></div>
                            <div className="flex-1">
                              <p className="text-[15px] font-semibold text-slate-900">{log.action}</p>
                              <p className="text-[13px] text-slate-400 font-medium mt-0.5">{log.details}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-[11px] font-bold text-slate-900 uppercase tracking-widest">{log.time}</p>
                              <p className="text-[10px] font-bold text-slate-300 uppercase mt-1">{log.date}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

              </motion.div>
            </AnimatePresence>

          </div>
        </div>
      </main>

      {/* Unified Business Logic Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-slate-900/5 backdrop-blur-md">
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="w-full max-w-[480px] bg-white border border-slate-50 rounded-[2.5rem] p-12 shadow-2xl overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mt-16"></div>
              <h3 className="text-2xl font-semibold text-slate-900 mb-10 tracking-tight italic capitalize">New {modalType}</h3>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const values = Object.fromEntries(formData.entries());
                
                if (modalType === 'customer') createCustomer(values);
                if (modalType === 'invoice') createInvoice(values);
                if (modalType === 'payment') recordPayment(values);
                
                setIsModalOpen(false);
              }} className="space-y-8 relative z-10">
                
                {modalType === 'customer' && (
                  <>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Reference</label>
                        <input name="account" required className="w-full border border-slate-50 rounded-2xl px-5 py-3.5 text-sm font-medium focus:outline-none bg-slate-50/50" placeholder="BP-2001" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                        <input name="name" required className="w-full border border-slate-50 rounded-2xl px-5 py-3.5 text-sm font-medium focus:outline-none bg-slate-50/50" placeholder="Entity Identity" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Endpoint (Email)</label>
                      <input name="email" type="email" required className="w-full border border-slate-50 rounded-2xl px-5 py-3.5 text-sm font-medium focus:outline-none bg-slate-50/50" placeholder="mail@domain.io" />
                    </div>
                  </>
                )}

                {modalType === 'invoice' && (
                  <>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Target Recipient</label>
                      <select name="customerId" required className="w-full border border-slate-50 rounded-2xl px-5 py-3.5 text-sm font-medium focus:outline-none bg-slate-50/50">
                        {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Capital Amount</label>
                        <input name="amount" type="number" required className="w-full border border-slate-50 rounded-2xl px-5 py-3.5 text-sm font-medium focus:outline-none bg-slate-50/50" placeholder="0.00" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Protocol State</label>
                        <select name="status" className="w-full border border-slate-50 rounded-2xl px-5 py-3.5 text-sm font-medium focus:outline-none bg-slate-50/50">
                          <option value="Pending">Pending</option>
                          <option value="Paid">Paid</option>
                        </select>
                      </div>
                    </div>
                  </>
                )}

                {modalType === 'payment' && (
                  <>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Source Entity</label>
                      <select name="customerId" required className="w-full border border-slate-50 rounded-2xl px-5 py-3.5 text-sm font-medium focus:outline-none bg-slate-50/50">
                        {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Settlement Amount</label>
                        <input name="amount" type="number" required className="w-full border border-slate-50 rounded-2xl px-5 py-3.5 text-sm font-medium focus:outline-none bg-slate-50/50" placeholder="0.00" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Methodology</label>
                        <select name="method" className="w-full border border-slate-50 rounded-2xl px-5 py-3.5 text-sm font-medium focus:outline-none bg-slate-50/50">
                          <option value="Bank Transfer">Bank Transfer</option>
                          <option value="Card Settlement">Card Settlement</option>
                          <option value="Cash/Other">Cash/Other</option>
                        </select>
                      </div>
                    </div>
                  </>
                )}

                <div className="flex gap-4 pt-8">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-6 py-4 text-sm font-semibold text-slate-400 hover:text-slate-900 transition-all">Discard</button>
                  <button type="submit" className="flex-1 px-6 py-4 bg-slate-900 text-white text-sm font-semibold hover:bg-black rounded-2xl transition-all shadow-xl shadow-slate-100 uppercase tracking-widest">Commit Draft</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
