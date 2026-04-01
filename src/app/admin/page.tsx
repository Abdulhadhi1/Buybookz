"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
  X
} from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default function AdminDashboard() {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form State
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    price: "",
    stock: "",
    category: "Literature",
    description: "",
    image: ""
  });

  const router = useRouter();

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/books");
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      const data = await res.json();
      setBooks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  const deleteBook = async (id: string) => {
    if (!confirm("Are you sure you want to delete this book?")) return;
    try {
        const res = await fetch(`/api/books/${id}`, { method: "DELETE" });
        if (res.ok) {
            setBooks(prev => prev.filter(b => b.id !== id));
        }
    } catch (err) {
        alert("Failed to delete book");
    }
  };

  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
        const res = await fetch("/api/books", {
            method: "POST",
            body: JSON.stringify({
                ...newBook,
                price: parseFloat(newBook.price),
                stock: parseInt(newBook.stock)
            }),
        });
        if (res.ok) {
            setShowAddModal(false);
            setNewBook({ title: "", author: "", price: "", stock: "", category: "Literature", description: "", image: "" });
            fetchBooks();
        } else {
            const err = await res.json();
            alert(err.error || "Failed to add book");
        }
    } catch (err) {
        alert("Something went wrong");
    } finally {
        setIsSubmitting(false);
    }
  };

  const filteredBooks = books.filter(b => 
    b.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    b.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex">
      {/* Sidebar */}
      <aside className="w-72 bg-primary text-primary-foreground border-r border-border hidden lg:flex flex-col p-8 space-y-12 shrink-0">
        <div className="text-2xl font-serif font-bold tracking-tight">
          Admin Portal <span className="text-accent underline">BB.</span>
        </div>

        <nav className="flex-grow space-y-4">
           <button className="w-full flex items-center space-x-4 px-6 py-4 bg-accent/20 text-accent rounded-3xl font-bold transition-all">
              <LayoutDashboard size={20} />
              <span>Overview</span>
           </button>
           <button className="w-full flex items-center space-x-4 px-6 py-4 hover:bg-white/5 rounded-3xl font-medium transition-all opacity-70 hover:opacity-100">
                <BookOpen size={20} />
                <span>Inventory</span>
           </button>
           <button className="w-full flex items-center space-x-4 px-6 py-4 hover:bg-white/5 rounded-3xl font-medium transition-all opacity-70 hover:opacity-100">
                <ShoppingBag size={20} />
                <span>Orders</span>
           </button>
           <button className="w-full flex items-center space-x-4 px-6 py-4 hover:bg-white/5 rounded-3xl font-medium transition-all opacity-70 hover:opacity-100">
                <Users size={20} />
                <span>Customers</span>
           </button>
        </nav>

        <div className="pt-8 border-t border-white/10">
            <button 
                onClick={handleLogout}
                className="w-full flex items-center space-x-4 px-6 py-4 hover:bg-white/5 rounded-3xl font-medium transition-all text-destructive"
            >
                <span>Sign Out</span>
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-6 lg:p-12 overflow-y-auto w-full">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
            <div>
               <h1 className="text-4xl font-serif font-bold text-primary mb-2">Book Inventory</h1>
               <p className="text-muted-foreground text-sm flex items-center">
                   Quickly manage your bookstore stock and catalog.
                   <ArrowUpRight size={14} className="ml-1 opacity-50" />
               </p>
            </div>
            <button 
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-2 px-8 py-4 bg-accent text-white rounded-full font-bold shadow-xl hover:bg-accent/90 transition-all active:scale-95 whitespace-nowrap"
            >
                <Plus size={18} />
                <span>Add New Book</span>
            </button>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[
                { label: "Total Titles", value: books.length, color: "bg-blue-50 text-blue-600" },
                { label: "Out of Stock", value: books.filter(b => b.stock < 5).length, color: "bg-red-50 text-red-600" },
                { label: "Total Revenue", value: "₹42,390", color: "bg-green-50 text-green-600" }
            ].map((stat, i) => (
                <div key={i} className="p-8 rounded-[2.5rem] bg-white border border-border flex items-center space-x-6">
                    <div className={`w-14 h-14 rounded-2xl ${stat.color} flex items-center justify-center font-bold text-xl`}>
                        {stat.value}
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-1">{stat.label}</p>
                        <p className="text-xl font-bold font-serif">{stat.value}</p>
                    </div>
                </div>
            ))}
        </div>

        {/* Table/List */}
        <div className="bg-white rounded-[3rem] border border-border shadow-sm overflow-hidden mb-12">
            <div className="p-8 border-b border-border flex flex-col md:flex-row justify-between gap-6">
                <div className="relative max-w-sm w-full">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search by title or author..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-16 pr-8 py-3 bg-secondary/30 rounded-full border border-transparent focus:border-accent outline-none transition-all"
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <thead>
                     <tr className="border-b border-border text-[10px] uppercase tracking-widest font-black text-muted-foreground">
                        <th className="py-6 pl-10">Book Details</th>
                        <th className="py-6">Author</th>
                        <th className="py-6">Price</th>
                        <th className="py-6">Stock</th>
                        <th className="py-6 pr-10 text-right">Actions</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                     {loading ? (
                        <tr><td colSpan={5} className="py-24 text-center"><Loader2 className="animate-spin mx-auto text-accent" /></td></tr>
                     ) : filteredBooks.length === 0 ? (
                        <tr><td colSpan={5} className="py-24 text-center text-muted-foreground italic">No books in inventory.</td></tr>
                     ) : (
                        filteredBooks.map((book) => (
                           <motion.tr 
                             key={book.id} 
                             whileHover={{ backgroundColor: "#FBFBFB" }}
                             className="group transition-colors"
                           >
                              <td className="py-6 pl-10">
                                 <div className="flex items-center space-x-4">
                                     <div className="w-12 h-16 bg-secondary rounded-lg shrink-0 overflow-hidden flex items-center justify-center font-serif italic text-primary/40 border border-border">
                                         {book.image ? <img src={book.image} alt="" className="object-cover w-full h-full" /> : book.title[0]}
                                     </div>
                                     <div>
                                         <p className="font-serif font-bold text-lg text-primary leading-tight">{book.title}</p>
                                         <p className="text-xs text-accent uppercase font-black tracking-widest mt-1">{book.category}</p>
                                     </div>
                                 </div>
                              </td>
                              <td className="py-6 text-sm italic font-medium">{book.author}</td>
                              <td className="py-6 font-bold">{formatPrice(book.price)}</td>
                              <td className="py-6">
                                 <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${book.stock < 5 ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}>
                                     {book.stock} in stock
                                 </span>
                              </td>
                              <td className="py-6 pr-10 text-right">
                                  <div className="flex justify-end space-x-2">
                                     <button className="p-3 bg-secondary/50 rounded-full hover:bg-accent hover:text-white transition-all shadow-sm"><Edit2 size={16} /></button>
                                     <button 
                                        onClick={() => deleteBook(book.id)}
                                        className="p-3 bg-secondary/50 rounded-full hover:bg-destructive hover:text-white transition-all shadow-sm"
                                     >
                                        <Trash2 size={16} />
                                     </button>
                                  </div>
                              </td>
                           </motion.tr>
                        ))
                     )}
                  </tbody>
               </table>
            </div>
        </div>
      </main>

      {/* Add Book Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-primary/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-8 border-b border-border flex justify-between items-center bg-secondary/20">
                <h2 className="text-2xl font-serif font-bold text-primary">Add New Book</h2>
                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-white rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleAddBook} className="p-8 space-y-6 overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-4">Book Title</label>
                    <input 
                      required
                      type="text" 
                      placeholder="e.g. The Great Gatsby"
                      value={newBook.title}
                      onChange={(e) => setNewBook({...newBook, title: e.target.value})}
                      className="w-full px-6 py-4 bg-secondary/50 rounded-2xl border border-transparent focus:border-accent outline-none font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-4">Author</label>
                    <input 
                      required
                      type="text" 
                      placeholder="e.g. F. Scott Fitzgerald"
                      value={newBook.author}
                      onChange={(e) => setNewBook({...newBook, author: e.target.value})}
                      className="w-full px-6 py-4 bg-secondary/50 rounded-2xl border border-transparent focus:border-accent outline-none font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-4">Price (₹)</label>
                    <input 
                      required
                      type="number" 
                      placeholder="499"
                      value={newBook.price}
                      onChange={(e) => setNewBook({...newBook, price: e.target.value})}
                      className="w-full px-6 py-4 bg-secondary/50 rounded-2xl border border-transparent focus:border-accent outline-none font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-4">Stock Quantity</label>
                    <input 
                      required
                      type="number" 
                      placeholder="10"
                      value={newBook.stock}
                      onChange={(e) => setNewBook({...newBook, stock: e.target.value})}
                      className="w-full px-6 py-4 bg-secondary/50 rounded-2xl border border-transparent focus:border-accent outline-none font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-4">Category</label>
                    <select 
                      value={newBook.category}
                      onChange={(e) => setNewBook({...newBook, category: e.target.value})}
                      className="w-full px-6 py-4 bg-secondary/50 rounded-2xl border border-transparent focus:border-accent outline-none font-medium appearance-none"
                    >
                      <option>Literature</option>
                      <option>Thriller</option>
                      <option>Science</option>
                      <option>Fantasy</option>
                      <option>Romance</option>
                      <option>History</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-4">Image URL (Optional)</label>
                    <input 
                      type="text" 
                      placeholder="https://example.com/cover.jpg"
                      value={newBook.image}
                      onChange={(e) => setNewBook({...newBook, image: e.target.value})}
                      className="w-full px-6 py-4 bg-secondary/50 rounded-2xl border border-transparent focus:border-accent outline-none font-medium"
                    />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-4">Description</label>
                  <textarea 
                    rows={3}
                    placeholder="Short summary of the book..."
                    value={newBook.description}
                    onChange={(e) => setNewBook({...newBook, description: e.target.value})}
                    className="w-full px-6 py-4 bg-secondary/50 rounded-2xl border border-transparent focus:border-accent outline-none font-medium resize-none"
                  />
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-5 bg-accent text-white rounded-full font-bold shadow-xl hover:bg-accent/90 transition-all flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
                  <span>Add to Inventory</span>
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
