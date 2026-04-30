"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, 
  ShoppingBag, 
  Users, 
  Settings, 
  Plus, 
  Trash2, 
  Edit2, 
  Loader2, 
  LayoutDashboard,
  Search,
  ArrowUpRight,
  X,
  Upload,
  Globe,
  Tag,
  DollarSign,
  TrendingUp,
  ChevronRight,
  Home,
  LogOut,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import PriceDisplay from "@/components/ui/PriceDisplay";

type Tab = "Overview" | "Inventory" | "Categories" | "Users" | "Revenue" | "Settings";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const [books, setBooks] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modals
  const [showAddBook, setShowAddBook] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  
  // Forms
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookForm, setBookForm] = useState({
    id: "", title: "", author: "", price: "", stock: "", categoryId: "", description: "", image: "", languages: ["English"]
  });
  const [catForm, setCatForm] = useState({ name: "", id: "" }); // id for editing
  
  const router = useRouter();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [bRes, cRes, sRes, uRes] = await Promise.all([
        fetch("/api/books"),
        fetch("/api/categories"),
        fetch("/api/admin/stats"),
        fetch("/api/admin/users")
      ]);

      if (bRes.status === 401) {
        router.push("/login");
        return;
      }

      const [bData, cData, sData, uData] = await Promise.all([
        bRes.json(), cRes.json(), sRes.json(), uRes.json()
      ]);

      setBooks(Array.isArray(bData) ? bData : []);
      setCategories(Array.isArray(cData) ? cData : []);
      setStats(sData);
      setUsers(Array.isArray(uData) ? uData : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  // --- Category Actions ---
  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const method = catForm.id ? "PATCH" : "POST";
    const url = catForm.id ? `/api/categories/${catForm.id}` : "/api/categories";
    
    try {
        const res = await fetch(url, {
            method,
            body: JSON.stringify({ name: catForm.name }),
        });
        if (res.ok) {
            setShowAddCategory(false);
            setCatForm({ name: "", id: "" });
            fetchData();
            router.refresh();
        }
    } finally {
        setIsSubmitting(false);
    }
  };

  const deleteCategory = async (id: string) => {
    if (!confirm("Delete this category? Books in this category will become uncategorized.")) return;
    try {
        const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
        if (res.ok) {
            fetchData();
            router.refresh();
        }
    } catch (err) { console.error(err); }
  };

  // --- Book Actions ---
  const handleEditBook = (book: any) => {
    setBookForm({
        id: book.id,
        title: book.title,
        author: book.author,
        price: book.price.toString(),
        stock: book.stock.toString(),
        categoryId: book.categoryId || "",
        description: book.description || "",
        image: book.image || "",
        languages: book.languages || ["English"]
    });
    setShowAddBook(true);
  };

  const handleDeleteBook = async (id: string) => {
    if (!confirm("Are you sure you want to remove this work from the library?")) return;
    try {
        const res = await fetch(`/api/books/${id}`, { method: "DELETE" });
        if (res.ok) {
            fetchData();
            router.refresh();
        }
    } catch (err) { console.error(err); }
  };

  const handleBookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const method = bookForm.id ? "PATCH" : "POST";
    const url = bookForm.id ? `/api/books/${bookForm.id}` : "/api/books";

    try {
        const res = await fetch(url, {
            method,
            body: JSON.stringify(bookForm),
        });
        if (res.ok) {
            setShowAddBook(false);
            setBookForm({ id: "", title: "", author: "", price: "", stock: "", categoryId: "", description: "", image: "", languages: ["English"] });
            fetchData();
            router.refresh();
        }
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setBookForm({ ...bookForm, image: reader.result as string });
        };
        reader.readAsDataURL(file);
    }
  };

  const toggleLanguage = (lang: string) => {
    const current = bookForm.languages;
    if (current.includes(lang)) {
        setBookForm({ ...bookForm, languages: current.filter(l => l !== lang) });
    } else {
        setBookForm({ ...bookForm, languages: [...current, lang] });
    }
  };

  const menuItems = [
    { id: "Overview", icon: <LayoutDashboard size={20} />, label: "Overview" },
    { id: "Inventory", icon: <BookOpen size={20} />, label: "Books" },
    { id: "Categories", icon: <Tag size={20} />, label: "Categories" },
    { id: "Users", icon: <Users size={20} />, label: "Users" },
    { id: "Revenue", icon: <TrendingUp size={20} />, label: "Revenue" },
    { id: "Settings", icon: <Settings size={20} />, label: "Settings" },
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col lg:flex-row pb-20 lg:pb-0">
      {/* Desktop Sidebar */}
      <aside className="w-72 bg-primary text-primary-foreground border-r border-border hidden lg:flex flex-col p-8 space-y-12 shrink-0 h-screen sticky top-0">
        <div className="text-2xl font-serif font-bold tracking-tight">
          Admin <span className="text-accent underline">Stage.</span>
        </div>

        <nav className="flex-grow space-y-2">
           {menuItems.map(item => (
               <button 
                 key={item.id}
                 onClick={() => setActiveTab(item.id as Tab)}
                 className={`w-full flex items-center space-x-4 px-6 py-4 rounded-3xl font-bold transition-all ${activeTab === item.id ? 'bg-accent/20 text-accent' : 'opacity-70 hover:opacity-100 hover:bg-white/5'}`}
               >
                  {item.icon}
                  <span>{item.label}</span>
               </button>
           ))}
        </nav>

        <div className="pt-8 border-t border-white/10">
            <button onClick={handleLogout} className="w-full flex items-center space-x-4 px-6 py-4 hover:bg-white/5 rounded-3xl font-medium transition-all text-red-400">
                <LogOut size={20} />
                <span>Exit Portal</span>
            </button>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-primary text-primary-foreground z-50 flex justify-around items-center px-2 py-4 border-t border-white/10 safe-area-bottom">
          {menuItems.map(item => (
              <button 
                key={item.id}
                onClick={() => setActiveTab(item.id as Tab)}
                className={`flex flex-col items-center justify-center p-2 rounded-2xl transition-all ${activeTab === item.id ? 'text-accent scale-110' : 'opacity-50'}`}
              >
                  {item.icon}
                  <span className="text-[8px] mt-1 font-black uppercase tracking-widest">{item.label}</span>
              </button>
          ))}
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow p-6 lg:p-12 w-full max-w-7xl mx-auto">
        
        {/* Tab: Overview */}
        {activeTab === "Overview" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
                <header>
                    <h1 className="text-4xl lg:text-5xl font-serif font-bold text-primary tracking-tight">Real-time Metrics</h1>
                    <p className="text-muted-foreground mt-2 italic">Live performance index for BuyBookz.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white p-8 rounded-[3rem] border border-border shadow-sm flex flex-col justify-between h-48 group hover:border-accent transition-colors">
                        <div className="flex justify-between items-start text-blue-500"><BookOpen size={24} /><TrendingUp size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" /></div>
                        <div><p className="text-[10px] font-black uppercase tracking-widest opacity-40">Library Inventory</p><p className="text-4xl font-bold tracking-tighter">{stats?.totalBooks || 0} Titles</p></div>
                    </div>
                    <div className="bg-white p-8 rounded-[3rem] border border-border shadow-sm flex flex-col justify-between h-48 group hover:border-accent transition-colors">
                        <div className="flex justify-between items-start text-red-500"><ShoppingBag size={24} /><TrendingUp size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" /></div>
                        <div><p className="text-[10px] font-black uppercase tracking-widest opacity-40">Critical Stock</p><p className="text-4xl font-bold tracking-tighter text-red-500">{stats?.outOfStock || 0} Alert</p></div>
                    </div>
                    <div className="bg-white p-8 rounded-[3rem] border border-border shadow-sm flex flex-col justify-between h-48 group hover:border-accent transition-colors">
                        <div className="flex justify-between items-start text-emerald-500"><Users size={24} /><TrendingUp size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" /></div>
                        <div><p className="text-[10px] font-black uppercase tracking-widest opacity-40">Total Readers</p><p className="text-4xl font-bold tracking-tighter">{stats?.totalUsers || 0}</p></div>
                    </div>
                    <div className="bg-white p-8 rounded-[3rem] border border-border shadow-sm flex flex-col justify-between h-48 group hover:border-accent transition-colors">
                        <div className="flex justify-between items-start text-accent"><DollarSign size={24} /><TrendingUp size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" /></div>
                        <div><p className="text-[10px] font-black uppercase tracking-widest opacity-40">Gross Revenue</p><PriceDisplay price={stats?.totalRevenue || 0} amountClassName="text-4xl tracking-tighter" symbolClassName="text-xl" /></div>
                    </div>
                </div>

                <div className="bg-white rounded-[3.5rem] border border-border p-10 shadow-sm relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-110 transition-transform duration-700"><DollarSign size={120} /></div>
                     <h3 className="text-2xl font-serif font-bold mb-8">Recent Revenue Stream</h3>
                     <div className="h-64 flex items-end justify-between gap-4">
                         {[40, 70, 45, 90, 65, 80, 55, 95, 75, 85].map((h, i) => (
                             <motion.div 
                                key={i} 
                                initial={{ height: 0 }} 
                                animate={{ height: `${h}%` }} 
                                transition={{ delay: i * 0.1 }}
                                className="flex-grow bg-accent/20 hover:bg-accent rounded-t-xl transition-colors cursor-pointer"
                             />
                         ))}
                     </div>
                     <div className="flex justify-between mt-4 text-[10px] font-black uppercase tracking-widest opacity-30">
                        <span>Past 10 Business Days</span>
                        <span>Current Cycle</span>
                     </div>
                </div>
            </motion.div>
        )}

        {/* Tab: Inventory */}
        {activeTab === "Inventory" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <h2 className="text-4xl font-serif font-bold text-primary">Library Catalog</h2>
                    <button onClick={() => {
                        setBookForm({ id: "", title: "", author: "", price: "", stock: "", categoryId: "", description: "", image: "", languages: ["English"] });
                        setShowAddBook(true);
                    }} className="flex items-center space-x-3 px-8 py-5 bg-accent text-white rounded-full font-bold shadow-2xl hover:scale-105 transition-all">
                        <Plus size={18} /><span>Add Work</span>
                    </button>
                </div>

                <div className="bg-white rounded-[3.5rem] border border-border overflow-hidden shadow-sm">
                    <div className="p-8 border-b border-border bg-secondary/10 flex flex-col md:flex-row justify-between gap-6">
                        <div className="relative flex-grow max-w-md">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground opacity-30" size={18} />
                            <input 
                                type="text" 
                                placeholder="Filter by Title, Author..." 
                                className="w-full pl-16 pr-8 py-4 bg-white rounded-full outline-none focus:ring-2 focus:ring-accent/20 border-transparent border focus:border-accent transition-all font-medium text-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground border-b border-border">
                                    <th className="px-10 py-6">Identity</th>
                                    <th className="px-6 py-6 text-center">Language Options</th>
                                    <th className="px-6 py-6 text-center">Availability</th>
                                    <th className="px-6 py-6">Value</th>
                                    <th className="px-10 py-6 text-right">Control</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/50">
                                {books.filter(b => b.title.toLowerCase().includes(searchQuery.toLowerCase())).map(book => (
                                    <tr key={book.id} className="hover:bg-secondary/5 transition-colors">
                                        <td className="px-10 py-6">
                                            <div className="flex items-center space-x-5">
                                                <div className="w-12 h-16 bg-secondary rounded-xl overflow-hidden shadow-sm border border-border flex items-center justify-center font-serif italic text-primary/20">
                                                    {book.image ? <img src={book.image} className="w-full h-full object-cover" /> : book.title[0]}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-lg text-primary leading-tight">{book.title}</p>
                                                    <p className="text-xs text-muted-foreground italic">{book.author}</p>
                                                    <div className="mt-2 flex items-center space-x-2">
                                                        <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 bg-accent/10 text-accent rounded-md border border-accent/20">{book.category?.name || "Uncategorized"}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="flex flex-wrap items-center justify-center gap-2">
                                                {(book.languages || []).map((l: string) => (
                                                    <span key={l} className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 bg-secondary rounded border border-border">{l}</span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 text-center">
                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${book.stock < 5 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                                                {book.stock} Units
                                            </span>
                                        </td>
                                        <td className="px-6 py-6">
                                            <PriceDisplay price={book.price} symbolClassName="text-[10px]" amountClassName="text-sm font-bold" />
                                        </td>
                                        <td className="px-10 py-6 text-right">
                                            <div className="flex justify-end space-x-2">
                                                <button 
                                                    onClick={() => handleEditBook(book)}
                                                    className="p-3 bg-secondary/40 rounded-full hover:bg-accent hover:text-white transition-all shadow-sm"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteBook(book.id)}
                                                    className="p-3 bg-secondary/40 rounded-full hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </motion.div>
        )}

        {/* Tab: Categories */}
        {activeTab === "Categories" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                 <div className="flex justify-between items-center">
                    <h2 className="text-4xl font-serif font-bold text-primary">Genre Index</h2>
                    <button onClick={() => setShowAddCategory(true)} className="flex items-center space-x-3 px-8 py-5 bg-accent text-white rounded-full font-bold shadow-2xl">
                        <Plus size={18} /><span>Add Category</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {(categories || []).map(cat => (
                        <div key={cat.id} className="bg-white p-10 rounded-[4rem] border border-border shadow-sm group hover:border-accent transition-all relative overflow-hidden">
                             <div className="space-y-4">
                                <div className="w-14 h-14 bg-secondary rounded-[1.5rem] flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
                                    <Tag size={24} />
                                </div>
                                <div>
                                    <h3 className="text-3xl font-serif font-bold text-primary capitalize">{cat.name}</h3>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30 mt-1">{cat._count?.books || 0} Titles Linked</p>
                                </div>
                             </div>
                             <div className="mt-10 pt-10 border-t border-border/50 flex items-center space-x-4">
                                <button onClick={() => {setCatForm({ name: cat.name, id: cat.id }); setShowAddCategory(true);}} className="text-[10px] font-black uppercase tracking-widest text-accent hover:opacity-100 opacity-40 transition-opacity">Modulate</button>
                                <button onClick={() => deleteCategory(cat.id)} className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:opacity-100 opacity-40 transition-opacity">Rescind</button>
                             </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        )}

        {/* Tab: Users */}
        {activeTab === "Users" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                <h2 className="text-4xl font-serif font-bold text-primary">Registered Readers</h2>
                <div className="bg-white rounded-[3.5rem] border border-border overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left font-sans">
                            <thead>
                                <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground border-b border-border">
                                    <th className="px-10 py-6">Reader Identity</th>
                                    <th className="px-6 py-6">Contact Channels</th>
                                    <th className="px-6 py-6 text-center">Activity Index</th>
                                    <th className="px-10 py-6 text-right">Inscribed date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/50">
                                {(users || []).map(user => (
                                    <tr key={user.id} className="hover:bg-secondary/5 transition-colors">
                                        <td className="px-10 py-6">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center font-bold text-primary opacity-30">{user.name?.[0].toUpperCase()}</div>
                                                <div>
                                                    <p className="font-bold text-base leading-none mb-1">{user.name}</p>
                                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40 text-accent">Loyal Member</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <p className="text-sm font-medium">{user.email}</p>
                                            <p className="text-xs text-muted-foreground">{user.phone || "No direct line"}</p>
                                        </td>
                                        <td className="px-6 py-6 text-center">
                                            <span className="px-5 py-2 bg-primary/5 text-primary rounded-full text-[10px] font-black uppercase tracking-widest border border-primary/10">
                                                {user._count?.orders || 0} Transactions
                                            </span>
                                        </td>
                                        <td className="px-10 py-6 text-right text-xs opacity-50 uppercase tracking-widest font-black">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </motion.div>
        )}
        {/* Tab: Revenue */}
        {activeTab === "Revenue" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
                <div className="flex justify-between items-center">
                    <h2 className="text-4xl font-serif font-bold text-primary">Financial Ledger</h2>
                    <div className="flex items-center space-x-3 px-6 py-3 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 italic text-sm">
                        <DollarSign size={16} />
                        <span>System Operating Normally</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="p-10 bg-white rounded-[3.5rem] border border-border shadow-sm space-y-4">
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Settled Funds</p>
                        <PriceDisplay price={stats?.totalRevenue || 0} amountClassName="text-5xl tracking-tighter" symbolClassName="text-2xl" />
                        <div className="pt-4 flex items-center text-emerald-500 text-xs font-bold">
                            <TrendingUp size={14} className="mr-1" />
                            <span>+12.4% from last month</span>
                        </div>
                    </div>
                    <div className="p-10 bg-white rounded-[3.5rem] border border-border shadow-sm space-y-4">
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Orders Fulfilled</p>
                        <p className="text-5xl font-bold tracking-tighter">{stats?.paidOrdersCount || stats?.totalOrders || 0}</p>
                        <div className="pt-4 flex items-center text-muted-foreground text-xs font-bold">
                            <span>High volume period</span>
                        </div>
                    </div>
                    <div className="p-10 bg-white rounded-[3.5rem] border border-border shadow-sm space-y-4">
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Avg. Basket Value</p>
                        <PriceDisplay price={(stats?.totalRevenue || 0) / (stats?.paidOrdersCount || stats?.totalOrders || 1)} amountClassName="text-5xl tracking-tighter" symbolClassName="text-2xl" />
                        <div className="pt-4 flex items-center text-muted-foreground text-xs font-bold">
                            <span>Growth steady</span>
                        </div>
                    </div>
                </div>

                <div className="bg-primary text-primary-foreground p-12 rounded-[4rem] relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-accent/20 blur-[100px] rounded-full -mr-48 -mt-48"></div>
                    <div className="relative z-10 space-y-6">
                        <h3 className="text-3xl font-serif font-bold italic">Fiscal Health Summary</h3>
                        <p className="text-lg opacity-70 leading-relaxed max-w-2xl italic">
                            The platform&apos;s economic engine is operating at peak efficiency. Transactional verification is running in real-time with Razorpay integration, ensuring consistent liquidity.
                        </p>
                    </div>
                </div>
            </motion.div>
        )}

        {/* Tab: Settings */}
        {activeTab === "Settings" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
                <h2 className="text-4xl font-serif font-bold text-primary">System Configurations</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white p-10 rounded-[3.5rem] border border-border shadow-sm space-y-8">
                        <h4 className="text-xl font-serif font-bold">Store Paradigm</h4>
                        <div className="space-y-6">
                            <div className="flex justify-between items-center pb-6 border-b border-border">
                                <div><p className="font-bold text-sm">Storefront Visibility</p><p className="text-[10px] uppercase font-black tracking-widest opacity-40">Live Production</p></div>
                                <div className="w-12 h-6 bg-emerald-500 rounded-full relative"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div></div>
                            </div>
                            <div className="flex justify-between items-center pb-6 border-b border-border">
                                <div><p className="font-bold text-sm">Inventory Tracking</p><p className="text-[10px] uppercase font-black tracking-widest opacity-40">Automatic Depletion</p></div>
                                <div className="w-12 h-6 bg-emerald-500 rounded-full relative"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div></div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-10 rounded-[3.5rem] border border-border shadow-sm space-y-8">
                        <h4 className="text-xl font-serif font-bold">Payment Gateway</h4>
                        <div className="space-y-6">
                             <div className="p-6 bg-secondary/30 rounded-3xl border border-border flex items-center space-x-4">
                                <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center font-black text-xs">RZ</div>
                                <div>
                                    <p className="font-bold text-sm">Razorpay Integrated</p>
                                    <p className="text-[10px] uppercase font-black tracking-widest opacity-40">Keys: Active (Live)</p>
                                </div>
                             </div>
                             <p className="text-[10px] text-muted-foreground italic leading-relaxed">
                                Ensure your Webhook URL is correctly mapped in the Razorpay Dashboard to receive settlement confirmations.
                             </p>
                        </div>
                    </div>
                </div>
                
                <div className="flex justify-center pt-8">
                    <button onClick={handleLogout} className="px-12 py-5 bg-red-50 text-red-600 rounded-full font-black uppercase tracking-[0.2em] text-xs hover:bg-red-100 transition-all">
                        Terminate Session
                    </button>
                </div>
            </motion.div>
        )}
      </main>

      {/* Add Book Modal */}
      <AnimatePresence>
        {showAddBook && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddBook(false)} className="absolute inset-0 bg-primary/40 backdrop-blur-md" />
                <motion.div initial={{ opacity: 0, scale: 0.9, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 30 }} className="relative bg-[#FDFDFD] w-full max-w-4xl rounded-[4rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
                    <div className="p-10 border-b border-border flex justify-between items-center bg-secondary/10">
                        <div className="flex items-center space-x-5">
                            <div className="w-12 h-12 bg-accent text-white rounded-2xl flex items-center justify-center shadow-lg">
                                {bookForm.id ? <Edit2 size={24} /> : <Plus size={24} />}
                            </div>
                            <h2 className="text-3xl font-serif font-bold text-primary">{bookForm.id ? "Refine Masterpiece" : "Inscribe New Work"}</h2>
                        </div>
                        <button onClick={() => setShowAddBook(false)} className="p-3 hover:bg-white rounded-full transition-colors"><X size={24} /></button>
                    </div>

                    <form onSubmit={handleBookSubmit} className="p-10 space-y-10 overflow-y-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-4">Publication Title</label>
                                    <input required placeholder="The Great Gatsby" className="w-full px-8 py-5 bg-white border border-border rounded-[2rem] outline-none focus:ring-4 focus:ring-accent/5 focus:border-accent font-bold transition-all" value={bookForm.title} onChange={(e) => setBookForm({...bookForm, title: e.target.value})} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-4">The Author</label>
                                    <input required placeholder="F. Scott Fitzgerald" className="w-full px-8 py-5 bg-white border border-border rounded-[2rem] outline-none focus:ring-4 focus:ring-accent/5 focus:border-accent font-bold transition-all" value={bookForm.author} onChange={(e) => setBookForm({...bookForm, author: e.target.value})} />
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-4">Market Value</label>
                                        <input required type="number" placeholder="499" className="w-full px-8 py-5 bg-white border border-border rounded-[2rem] outline-none focus:ring-4 focus:ring-accent/5 focus:border-accent font-bold transition-all text-xl" value={bookForm.price} onChange={(e) => setBookForm({...bookForm, price: e.target.value})} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-4">Stock Ledger</label>
                                        <input required type="number" placeholder="10" className="w-full px-8 py-5 bg-white border border-border rounded-[2rem] outline-none focus:ring-4 focus:ring-accent/5 focus:border-accent font-bold transition-all text-xl" value={bookForm.stock} onChange={(e) => setBookForm({...bookForm, stock: e.target.value})} />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-4">Language Variations</label>
                                    <div className="flex flex-wrap gap-3">
                                        {["Tamil", "English", "Hindi", "French", "Spanish"].map(lang => (
                                            <button 
                                                key={lang} 
                                                type="button" 
                                                onClick={() => toggleLanguage(lang)}
                                                className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${bookForm.languages.includes(lang) ? 'bg-primary text-white border-primary shadow-lg' : 'bg-white border-border text-muted-foreground hover:border-accent'}`}
                                            >
                                                {lang}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-4">Assigned Genre</label>
                                    <select 
                                        className="w-full px-8 py-5 bg-white border border-border rounded-[2rem] outline-none focus:ring-4 focus:ring-accent/5 focus:border-accent font-bold transition-all appearance-none"
                                        value={bookForm.categoryId}
                                        onChange={(e) => setBookForm({...bookForm, categoryId: e.target.value})}
                                    >
                                        <option value="">Select Category</option>
                                        {(categories || []).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-4">Visual Cover</label>
                                    <div className="group relative w-full aspect-[4/3] bg-secondary border-2 border-dashed border-border rounded-[2.5rem] flex items-center justify-center overflow-hidden hover:border-accent transition-all">
                                        {bookForm.image ? (
                                            <div className="relative w-full h-full">
                                                <img src={bookForm.image} className="w-full h-full object-contain" />
                                                <button onClick={() => setBookForm({...bookForm, image: ""})} className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full shadow-lg hover:scale-110 transition-transform"><X size={16} /></button>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center space-y-4">
                                                <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-sm text-accent"><Upload size={32} /></div>
                                                <div className="text-center">
                                                    <p className="text-xs font-black uppercase tracking-widest mb-1 italic">Click to Upload</p>
                                                    <p className="text-[10px] opacity-30 uppercase font-black tracking-widest">PNG, JPG up to 5MB</p>
                                                </div>
                                            </div>
                                        )}
                                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={handleImageUpload} />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-4">Description</label>
                                    <textarea rows={4} className="w-full px-8 py-5 bg-white border border-border rounded-[2rem] outline-none focus:ring-4 focus:ring-accent/5 focus:border-accent font-bold transition-all resize-none italic" placeholder="The narrative takes a turn when..." value={bookForm.description} onChange={(e) => setBookForm({...bookForm, description: e.target.value})} />
                                </div>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-border flex justify-end">
                            <button disabled={isSubmitting} className="px-12 py-6 bg-accent text-white rounded-full font-bold shadow-2xl hover:scale-105 transition-all flex items-center space-x-4 disabled:opacity-50">
                                {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : (bookForm.id ? <Edit2 size={20} /> : <BookOpen size={20} />)}
                                <span className="uppercase tracking-widest text-sm font-black text-white">{bookForm.id ? "Refine Edition" : "Consign to Library"}</span>
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        )}
      </AnimatePresence>

      {/* Add Category Modal */}
      <AnimatePresence>
          {showAddCategory && (
              <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddCategory(false)} className="absolute inset-0 bg-primary/40 backdrop-blur-md" />
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative bg-white w-full max-w-md rounded-[4rem] shadow-2xl overflow-hidden p-10 space-y-10">
                      <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-accent text-white rounded-2xl flex items-center justify-center shadow-lg"><Tag size={24} /></div>
                          <h2 className="text-3xl font-serif font-bold text-primary">{catForm.id ? 'Modulate Genre' : 'New Category'}</h2>
                      </div>
                      <form onSubmit={handleCategorySubmit} className="space-y-8">
                          <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-4">Genre Label</label>
                              <input required placeholder="e.g. Science Fiction" className="w-full px-8 py-5 bg-secondary/30 border border-transparent rounded-[2rem] focus:bg-white focus:border-accent outline-none font-bold transition-all" value={catForm.name} onChange={(e) => setCatForm({...catForm, name: e.target.value})} />
                          </div>
                          <button disabled={isSubmitting} className="w-full py-6 bg-primary text-white rounded-full font-bold shadow-2xl hover:bg-primary/95 transition-all disabled:opacity-50 uppercase tracking-widest text-xs font-black">
                              {catForm.id ? "Apply Modifications" : "Secure New Genre"}
                          </button>
                      </form>
                  </motion.div>
              </div>
          )}
      </AnimatePresence>
    </div>
  );
}
