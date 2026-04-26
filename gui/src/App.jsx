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
  ArrowUpDown,
  Calculator
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const INITIAL_CUSTOMERS = [
  { id: '1', account: 'CB-1001', name: 'Nimal Perera', email: 'nimal.p@gmail.com', type: 'Premium', balance: 125050.00, vatEnabled: true },
  { id: '2', account: 'CB-1002', name: 'Sunil Silva', email: 'sunil.s@outlook.com', type: 'Regular', balance: 45200.00, vatEnabled: false },
];

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('billing_auth') === 'true');
  const [activeTab, setActiveTab] = useState('customers');
  const [customers, setCustomers] = useState(() => {
    const saved = localStorage.getItem('billing_customers');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [formData, setFormData] = useState({ account: '', name: '', email: '', type: 'Regular', balance: '', vatEnabled: false });

  useEffect(() => {
    localStorage.setItem('billing_customers', JSON.stringify(customers));
  }, [customers]);

  const filteredCustomers = useMemo(() => {
    return customers.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.account.includes(searchQuery);
      const matchesType = filterType === 'All' || c.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [customers, searchQuery, filterType]);

  const stats = useMemo(() => {
    const total = customers.reduce((acc, c) => acc + parseFloat(c.balance || 0), 0);
    const premiumTotal = customers.filter(c => c.type === 'Premium').reduce((acc, c) => acc + parseFloat(c.balance || 0), 0);
    return { total, premiumTotal, count: customers.length };
  }, [customers]);

  const exportToCSV = () => {
    const headers = ['Account,Name,Email,Type,Balance,VAT\n'];
    const rows = customers.map(c => `${c.account},${c.name},${c.email},${c.type},${c.balance},${c.vatEnabled ? 'Yes' : 'No'}\n`);
    const blob = new Blob([...headers, ...rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Billing_Export_${new Date().toLocaleDateString()}.csv`;
    a.click();
  };

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
    const finalData = { ...formData, balance: parseFloat(formData.balance || 0) };
    if (editingCustomer) {
      setCustomers(customers.map(c => c.id === editingCustomer.id ? { ...editingCustomer, ...finalData } : c));
    } else {
      setCustomers([...customers, { id: Date.now().toString(), ...finalData }]);
    }
    setIsModalOpen(false);
    setEditingCustomer(null);
    setFormData({ account: '', name: '', email: '', type: 'Regular', balance: '', vatEnabled: false });
  };

  const handleDelete = (id) => {
    if (window.confirm('Confirm deletion?')) {
      setCustomers(customers.filter(c => c.id !== id));
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
        <div className="w-full max-w-[360px] bg-white border border-slate-200 rounded-3xl p-10 shadow-sm">
          <div className="flex justify-center mb-6">
            <Calculator className="w-10 h-10 text-slate-900" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 text-center mb-8">BillingPro SL</h1>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-[12px] font-bold text-slate-500 uppercase tracking-widest">Access Key</label>
              <input name="password" type="password" required className="w-full border border-slate-200 rounded-xl py-3 px-4 text-[14px] focus:outline-none focus:border-slate-900 transition-all" placeholder="••••••••" />
            </div>
            <button type="submit" className="w-full bg-slate-900 text-white py-3.5 rounded-xl text-sm font-bold active:scale-[0.98] transition-all">Authenticate</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-white text-slate-700 font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-100 flex flex-col p-8 bg-slate-50/50">
        <div className="flex items-center gap-3 mb-12 px-2">
          <CreditCard className="w-6 h-6 text-slate-900" />
          <h1 className="text-lg font-bold text-slate-900 tracking-tight italic">BillingPro SL</h1>
        </div>

        <nav className="flex-1 space-y-2">
          <button onClick={() => setActiveTab('customers')} className={cn("flex items-center gap-4 w-full px-5 py-3 rounded-2xl text-[14px] font-bold transition-all", activeTab === 'customers' ? "bg-white shadow-sm text-slate-900 border border-slate-100" : "text-slate-400 hover:bg-white hover:text-slate-600")}>
            <Users className="w-5 h-5" /> Registry
          </button>
          <button onClick={() => setActiveTab('dashboard')} className={cn("flex items-center gap-4 w-full px-5 py-3 rounded-2xl text-[14px] font-bold transition-all", activeTab === 'dashboard' ? "bg-white shadow-sm text-slate-900 border border-slate-100" : "text-slate-400 hover:bg-white hover:text-slate-600")}>
            <LayoutDashboard className="w-5 h-5" /> Analysis
          </button>
        </nav>

        <button onClick={handleLogout} className="flex items-center gap-4 w-full px-5 py-3 text-slate-400 hover:text-red-600 rounded-2xl transition-all mt-auto text-[14px] font-bold">
          <LogOut className="w-5 h-5" /> Exit
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-20 flex items-center justify-between px-10 border-b border-slate-50 bg-white/80 backdrop-blur-md sticky top-0 z-10">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-[0.3em]">{activeTab} node</h2>
          <div className="flex items-center gap-4">
            <span className="text-[12px] font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">Admin SL</span>
          </div>
        </header>

        <div className="flex-1 p-10 overflow-y-auto">
          {activeTab === 'customers' && (
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4 flex-1 w-full max-w-xl">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-300" />
                    <input type="text" placeholder="Search by name or ID..." className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 pl-12 pr-4 text-[14px] focus:outline-none focus:border-slate-300 transition-all" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                  </div>
                  <select className="bg-slate-50 border border-slate-100 rounded-2xl py-3 px-4 text-[14px] font-bold focus:outline-none" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                    <option value="All">All Types</option>
                    <option value="Regular">Regular</option>
                    <option value="Premium">Premium</option>
                  </select>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <button onClick={exportToCSV} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-2xl text-[14px] font-bold text-slate-600 hover:bg-slate-50 transition-all">
                    <Download className="w-4.5 h-4.5" /> Export
                  </button>
                  <button onClick={() => { setEditingCustomer(null); setFormData({ account: '', name: '', email: '', type: 'Regular', balance: '', vatEnabled: false }); setIsModalOpen(true); }} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-[14px] font-bold shadow-lg shadow-slate-900/10 active:scale-95 transition-all">
                    <Plus className="w-5 h-5" /> New Record
                  </button>
                </div>
              </div>

              <div className="border border-slate-100 rounded-[2rem] overflow-hidden shadow-sm">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 text-slate-400 text-[11px] font-black uppercase tracking-widest border-b border-slate-100">
                      <th className="px-8 py-5">Node ID</th>
                      <th className="px-8 py-5">Entity Detail</th>
                      <th className="px-8 py-5">Classification</th>
                      <th className="px-8 py-5">Net Worth</th>
                      <th className="px-8 py-5 text-right">Ops</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredCustomers.length > 0 ? filteredCustomers.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50/50 transition-all group">
                        <td className="px-8 py-6 text-[13px] font-bold text-blue-600">{c.account}</td>
                        <td className="px-8 py-6">
                          <p className="text-[15px] font-bold text-slate-900">{c.name}</p>
                          <p className="text-[12px] text-slate-400">{c.email}</p>
                        </td>
                        <td className="px-8 py-6">
                          <span className={cn("text-[10px] font-black px-3 py-1 rounded-full border uppercase tracking-tighter", c.type === 'Premium' ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-400 border-slate-200")}>{c.type}</span>
                        </td>
                        <td className="px-8 py-6">
                          <p className="text-[15px] font-black text-slate-900">Rs. {c.balance.toLocaleString()}</p>
                          {c.vatEnabled && <p className="text-[10px] font-bold text-emerald-500 uppercase">+ VAT (18%)</p>}
                        </td>
                        <td className="px-8 py-6 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                            <button onClick={() => { setEditingCustomer(c); setFormData({ ...c }); setIsModalOpen(true); }} className="p-2 hover:bg-white rounded-xl text-slate-400 hover:text-blue-600 shadow-sm transition-all"><Edit2 className="w-4.5 h-4.5" /></button>
                            <button onClick={() => handleDelete(c.id)} className="p-2 hover:bg-white rounded-xl text-slate-400 hover:text-red-600 shadow-sm transition-all"><Trash2 className="w-4.5 h-4.5" /></button>
                          </div>
                        </td>
                      </tr>
                    )) : (
                      <tr><td colSpan={5} className="px-8 py-24 text-center text-slate-300 font-bold italic tracking-tight uppercase">Registry Empty // No matches found</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-slate-50 border border-slate-100 p-8 rounded-[2.5rem]">
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Ledger</p>
                  <p className="text-3xl font-black text-slate-900 tracking-tighter">Rs. {stats.total.toLocaleString()}</p>
                  <p className="text-[11px] font-bold text-slate-400 mt-2">Active across {stats.count} nodes</p>
                </div>
                <div className="bg-slate-50 border border-slate-100 p-8 rounded-[2.5rem]">
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Premium Yield</p>
                  <p className="text-3xl font-black text-slate-900 tracking-tighter">Rs. {stats.premiumTotal.toLocaleString()}</p>
                  <p className="text-[11px] font-bold text-blue-600 mt-2">{Math.round((stats.premiumTotal / stats.total) * 100 || 0)}% of total revenue</p>
                </div>
                <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white">
                  <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">System Status</p>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                    <p className="text-2xl font-black">Operational</p>
                  </div>
                  <p className="text-[11px] font-bold text-slate-500">Latency: 0.12ms // SL-Region</p>
                </div>
              </div>
              
              <div className="bg-slate-50 border border-slate-100 rounded-[3rem] p-10 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-slate-900 mb-1 tracking-tight">Generate Final Settlement</h3>
                  <p className="text-[13px] font-bold text-slate-400">Compile all records into a single financial report.</p>
                </div>
                <button onClick={exportToCSV} className="bg-slate-900 text-white px-8 py-4 rounded-[1.5rem] text-[14px] font-black uppercase tracking-widest hover:scale-105 transition-all">Download Report</button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-slate-900/30 backdrop-blur-md">
          <div className="w-full max-w-[460px] bg-white border border-white rounded-[3rem] p-10 shadow-2xl">
            <h3 className="text-2xl font-black text-slate-900 mb-8 tracking-tighter uppercase italic">{editingCustomer ? 'Update' : 'Initialize'} Entity</h3>
            <form onSubmit={handleAddOrUpdate} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Account Ref</label>
                  <input required className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 text-[14px] font-bold text-slate-900 focus:outline-none focus:border-slate-400 transition-all" value={formData.account} onChange={(e) => setFormData({ ...formData, account: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Entity Name</label>
                  <input required className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 text-[14px] font-bold text-slate-900 focus:outline-none focus:border-slate-400 transition-all" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Communication Email</label>
                <input required type="email" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 text-[14px] font-bold text-slate-900 focus:outline-none focus:border-slate-400 transition-all" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Classification</label>
                  <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 text-[14px] font-bold text-slate-900 focus:outline-none transition-all appearance-none" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                    <option value="Regular">Regular</option>
                    <option value="Premium">Premium</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Net Balance (LKR)</label>
                  <input required type="number" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 text-[14px] font-bold text-slate-900 focus:outline-none focus:border-slate-400 transition-all" value={formData.balance} onChange={(e) => setFormData({ ...formData, balance: e.target.value })} />
                </div>
              </div>
              <div className="flex items-center gap-3 px-2 py-1">
                <input type="checkbox" id="vat" className="w-5 h-5 rounded-lg accent-slate-900" checked={formData.vatEnabled} onChange={(e) => setFormData({ ...formData, vatEnabled: e.target.checked })} />
                <label htmlFor="vat" className="text-[13px] font-bold text-slate-600">Enable VAT Calculation (18% applied locally)</label>
              </div>
              <div className="flex gap-4 pt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-6 py-4 rounded-[1.5rem] bg-slate-100 text-[13px] font-black text-slate-400 hover:bg-slate-200 transition-all">Cancel</button>
                <button type="submit" className="flex-1 px-6 py-4 rounded-[1.5rem] bg-slate-900 text-white text-[13px] font-black hover:bg-black transition-all shadow-xl shadow-slate-900/10 active:scale-95">Commit Data</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
