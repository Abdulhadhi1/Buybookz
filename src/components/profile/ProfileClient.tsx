"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Package, 
  MapPin, 
  Settings, 
  ChevronRight, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  LogOut,
  CreditCard,
  ShieldCheck,
  BellRing,
  Smartphone
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useToast } from "@/components/ui/ToastProvider";
import { useRouter } from "next/navigation";

interface Address {
  id: string;
  address: string;
  pincode: string;
  city: string;
  state: string;
  isDefault: boolean;
}

interface OrderItem {
  id: string;
  book: {
    title: string;
    image: string | null;
    author: string;
  };
  quantity: number;
  language: string | null;
}

interface Order {
  id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

interface UserData {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  role: string;
  addresses: Address[];
  orders: Order[];
}

export default function ProfileClient() {
  const [activeTab, setActiveTab] = useState("overview");
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();
  const router = useRouter();

  // Address Form State
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({
    address: "",
    pincode: "",
    city: "",
    state: "",
    isDefault: false
  });

  // Settings Form State
  const [settingsForm, setSettingsForm] = useState({
    name: "",
    phone: ""
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/profile");
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      const data = await res.json();
      setUserData(data);
      setSettingsForm({
        name: data.name || "",
        phone: data.phone || ""
      });
    } catch (err) {
      showToast("Failed to load profile", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        body: JSON.stringify(settingsForm)
      });
      if (res.ok) {
        showToast("Profile updated successfully", "success");
        fetchProfile();
      } else {
        showToast("Update failed", "error");
      }
    } catch (err) {
      showToast("An error occurred", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/profile/address", {
        method: "POST",
        body: JSON.stringify(addressForm)
      });
      if (res.ok) {
        showToast("Address added", "success");
        setShowAddAddress(false);
        setAddressForm({ address: "", pincode: "", city: "", state: "", isDefault: false });
        fetchProfile();
      }
    } catch (err) {
      showToast("Failed to add address", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return;
    try {
      const res = await fetch(`/api/profile/address?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("Address deleted", "success");
        fetchProfile();
      }
    } catch (err) {
      showToast("Failed to delete address", "error");
    }
  };

  const handleSetDefaultAddress = async (id: string) => {
    try {
      const res = await fetch("/api/profile/address", {
        method: "PATCH",
        body: JSON.stringify({ id, isDefault: true })
      });
      if (res.ok) {
        showToast("Default address updated", "success");
        fetchProfile();
      }
    } catch (err) {
      showToast("Update failed", "error");
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFAF5]">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
          <Settings className="text-accent" size={48} />
        </motion.div>
      </div>
    );
  }

  const menuItems = [
    { id: "overview", label: "Overview", icon: User },
    { id: "orders", label: "My Orders", icon: Package },
    { id: "addresses", label: "Saved Addresses", icon: MapPin },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <main className="min-h-screen bg-[#FDFAF5] text-primary">
      <Navbar />

      <div className="pt-32 pb-24 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-[3rem] p-8 shadow-xl border border-border/50 sticky top-32">
              <div className="flex items-center space-x-4 mb-10">
                <div className="w-16 h-16 bg-accent/10 text-accent rounded-3xl flex items-center justify-center text-2xl font-serif font-bold">
                  {userData?.name?.[0] || userData?.email[0].toUpperCase()}
                </div>
                <div>
                  <h2 className="text-xl font-serif font-bold truncate max-w-[150px]">{userData?.name || "Bibliophile"}</h2>
                  <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{userData?.role}</p>
                </div>
              </div>

              <div className="space-y-2">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${
                      activeTab === item.id 
                        ? "bg-primary text-white shadow-lg" 
                        : "hover:bg-secondary text-primary/60 hover:text-primary"
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <item.icon size={18} />
                      <span className="text-xs font-black uppercase tracking-widest">{item.label}</span>
                    </div>
                    <ChevronRight size={14} className={activeTab === item.id ? "opacity-100" : "opacity-0"} />
                  </button>
                ))}
                
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-4 p-4 rounded-2xl text-red-500 hover:bg-red-50 transition-all mt-8"
                >
                  <LogOut size={18} />
                  <span className="text-xs font-black uppercase tracking-widest">Sign Out</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-grow">
            <AnimatePresence mode="wait">
              {activeTab === "overview" && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-8"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-border/50">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">Total Curations</p>
                      <div className="flex items-center justify-between">
                        <span className="text-4xl font-serif font-bold">{userData?.orders.length}</span>
                        <div className="w-12 h-12 bg-accent/10 text-accent rounded-2xl flex items-center justify-center"><Package size={24} /></div>
                      </div>
                    </div>
                    <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-border/50">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">Saved Sanctums</p>
                      <div className="flex items-center justify-between">
                        <span className="text-4xl font-serif font-bold">{userData?.addresses.length}</span>
                        <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center"><MapPin size={24} /></div>
                      </div>
                    </div>
                    <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-border/50">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">Loyalty Tier</p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-serif font-bold">Rare Edition</span>
                        <div className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center"><ShieldCheck size={24} /></div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-10 rounded-[4rem] shadow-sm border border-border/50">
                    <h3 className="text-2xl font-serif font-bold mb-8">Recent Acquisition</h3>
                    {userData?.orders[0] ? (
                      <div className="flex items-center space-x-6">
                        <div className="w-20 h-28 bg-secondary rounded-xl overflow-hidden relative shadow-lg">
                          {userData.orders[0].items[0].book.image && (
                            <img src={userData.orders[0].items[0].book.image} className="w-full h-full object-cover" />
                          )}
                        </div>
                        <div className="flex-grow">
                          <p className="text-[10px] font-black uppercase tracking-widest text-accent mb-1">Order #{userData.orders[0].id.slice(-6)}</p>
                          <h4 className="text-lg font-bold">{userData.orders[0].items[0].book.title}</h4>
                          <p className="text-xs text-muted-foreground">Status: <span className="text-primary font-bold uppercase tracking-widest text-[9px]">{userData.orders[0].status}</span></p>
                        </div>
                        <button onClick={() => setActiveTab("orders")} className="px-6 py-3 border border-border rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-secondary transition-all">View All</button>
                      </div>
                    ) : (
                      <p className="text-center py-12 text-muted-foreground italic">Your library collection is currently empty.</p>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === "orders" && (
                <motion.div
                  key="orders"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-3xl font-serif font-bold text-primary mb-8">Acquisition History</h2>
                  {userData?.orders.map((order) => (
                    <div key={order.id} className="bg-white p-8 rounded-[3rem] shadow-sm border border-border/50 transition-all hover:border-accent group">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-8 border-b border-border/50 gap-4">
                        <div className="flex items-center space-x-4">
                          <div className={`p-3 rounded-2xl ${order.status === 'PAID' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                            {order.status === 'PAID' ? <CheckCircle2 size={20} /> : <Clock size={20} />}
                          </div>
                          <div>
                            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Reference #{order.id.slice(-8).toUpperCase()}</p>
                            <p className="text-xs font-bold">{new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Market Value</p>
                          <p className="text-xl font-bold text-primary">Rs. {order.totalAmount.toFixed(2)}</p>
                        </div>
                      </div>

                      <div className="space-y-6">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center space-x-6">
                            <div className="w-16 h-20 bg-secondary rounded-lg overflow-hidden flex-shrink-0 relative">
                              {item.book.image && <img src={item.book.image} className="w-full h-full object-cover" />}
                            </div>
                            <div className="flex-grow">
                              <h5 className="font-bold text-sm leading-tight">{item.book.title}</h5>
                              <p className="text-[10px] text-muted-foreground italic">by {item.book.author}</p>
                              <div className="flex items-center space-x-3 mt-2">
                                <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 bg-secondary rounded-full">Qty: {item.quantity}</span>
                                {item.language && <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 bg-accent/10 text-accent rounded-full">{item.language}</span>}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  {userData?.orders.length === 0 && (
                    <div className="text-center py-24 bg-white rounded-[4rem] border-2 border-dashed border-border">
                      <Package className="mx-auto text-muted-foreground/30 mb-6" size={64} />
                      <p className="text-muted-foreground italic">No historical acquisitions found.</p>
                      <button onClick={() => router.push('/shop')} className="mt-8 px-10 py-4 bg-primary text-white rounded-full font-bold uppercase tracking-widest text-[10px]">Start Browsing</button>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === "addresses" && (
                <motion.div
                  key="addresses"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-8"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-3xl font-serif font-bold text-primary">Delivery Sanctums</h2>
                    <button 
                      onClick={() => setShowAddAddress(true)}
                      className="flex items-center space-x-2 px-8 py-4 bg-accent text-white rounded-full font-bold shadow-xl hover:scale-105 transition-all"
                    >
                      <Plus size={18} /><span className="uppercase tracking-widest text-[10px]">New Address</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {userData?.addresses.map((addr) => (
                      <div key={addr.id} className={`bg-white p-8 rounded-[3rem] shadow-sm border transition-all relative group ${addr.isDefault ? 'border-accent ring-4 ring-accent/5' : 'border-border/50 hover:border-primary/30'}`}>
                        {addr.isDefault && (
                          <div className="absolute -top-3 left-8 bg-accent text-white px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
                            Primary Address
                          </div>
                        )}
                        <div className="mb-6">
                          <p className="text-sm font-medium leading-relaxed text-primary/80 italic">&ldquo;{addr.address}&rdquo;</p>
                          <p className="mt-4 text-xs font-bold text-primary">{addr.city}, {addr.state} - {addr.pincode}</p>
                        </div>
                        <div className="flex items-center justify-between pt-6 border-t border-border/50">
                          {!addr.isDefault && (
                            <button 
                              onClick={() => handleSetDefaultAddress(addr.id)}
                              className="text-[9px] font-black uppercase tracking-widest text-accent hover:underline"
                            >
                              Make Primary
                            </button>
                          )}
                          <button 
                            onClick={() => handleDeleteAddress(addr.id)}
                            className="p-3 text-red-500 hover:bg-red-50 rounded-full transition-colors ml-auto"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {userData?.addresses.length === 0 && (
                    <div className="text-center py-24 bg-white rounded-[4rem] border-2 border-dashed border-border">
                      <MapPin className="mx-auto text-muted-foreground/30 mb-6" size={64} />
                      <p className="text-muted-foreground italic">No sanctums defined for deliveries.</p>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === "settings" && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-8"
                >
                  <h2 className="text-3xl font-serif font-bold text-primary mb-8">Experience Settings</h2>
                  
                  <div className="bg-white p-10 rounded-[4rem] shadow-sm border border-border/50">
                    <form onSubmit={handleUpdateProfile} className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-4">Legal Moniker</label>
                          <div className="relative">
                            <User className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                            <input 
                              placeholder="Your full name"
                              className="w-full pl-14 pr-8 py-5 bg-[#FDFDFD] border border-border rounded-[2rem] focus:border-accent outline-none font-bold transition-all" 
                              value={settingsForm.name}
                              onChange={(e) => setSettingsForm({...settingsForm, name: e.target.value})}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-4">Phone Coordinate</label>
                          <div className="relative">
                            <Smartphone className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                            <input 
                              placeholder="+91 XXXXX XXXXX"
                              className="w-full pl-14 pr-8 py-5 bg-[#FDFDFD] border border-border rounded-[2rem] focus:border-accent outline-none font-bold transition-all" 
                              value={settingsForm.phone}
                              onChange={(e) => setSettingsForm({...settingsForm, phone: e.target.value})}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-4">Electronic Mail (Immutable)</label>
                        <div className="w-full px-8 py-5 bg-secondary/50 border border-border/20 rounded-[2rem] text-muted-foreground font-bold opacity-60">
                          {userData?.email}
                        </div>
                      </div>

                      <div className="pt-4">
                        <button 
                          disabled={isSubmitting}
                          className="px-12 py-5 bg-primary text-white rounded-full font-bold shadow-2xl hover:scale-[1.02] transition-all flex items-center space-x-3 disabled:opacity-50"
                        >
                          <CheckCircle2 size={18} />
                          <span className="uppercase tracking-widest text-xs font-black">Persist Configurations</span>
                        </button>
                      </div>
                    </form>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-8 rounded-[3.5rem] shadow-sm border border-border/50 flex items-center space-x-6 hover:border-accent transition-all cursor-pointer">
                      <div className="w-14 h-14 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center"><CreditCard size={24} /></div>
                      <div>
                        <h4 className="font-bold text-sm">Payment Methods</h4>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black mt-1">Configure Vault</p>
                      </div>
                    </div>
                    <div className="bg-white p-8 rounded-[3.5rem] shadow-sm border border-border/50 flex items-center space-x-6 hover:border-accent transition-all cursor-pointer">
                      <div className="w-14 h-14 bg-purple-50 text-purple-500 rounded-2xl flex items-center justify-center"><BellRing size={24} /></div>
                      <div>
                        <h4 className="font-bold text-sm">Notifications</h4>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black mt-1">Manage Alerts</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Add Address Modal */}
      <AnimatePresence>
        {showAddAddress && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddAddress(false)} className="absolute inset-0 bg-primary/40 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 30 }} className="relative bg-white w-full max-w-xl rounded-[4rem] shadow-2xl p-10">
              <div className="flex items-center space-x-4 mb-10">
                <div className="w-12 h-12 bg-accent text-white rounded-2xl flex items-center justify-center"><Plus size={24} /></div>
                <h2 className="text-3xl font-serif font-bold">New Delivery Sanctum</h2>
              </div>
              
              <form onSubmit={handleAddAddress} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-4">Full Address</label>
                  <textarea 
                    required 
                    rows={3}
                    placeholder="House No, Street, Landmark..."
                    className="w-full px-8 py-5 bg-secondary/30 border border-transparent rounded-[2rem] focus:bg-white focus:border-accent outline-none font-bold transition-all resize-none" 
                    value={addressForm.address}
                    onChange={(e) => setAddressForm({...addressForm, address: e.target.value})}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-4">City</label>
                    <input 
                      required 
                      placeholder="e.g. Chennai"
                      className="w-full px-8 py-5 bg-secondary/30 border border-transparent rounded-[2rem] focus:bg-white focus:border-accent outline-none font-bold transition-all" 
                      value={addressForm.city}
                      onChange={(e) => setAddressForm({...addressForm, city: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-4">Postal Code</label>
                    <input 
                      required 
                      placeholder="600001"
                      className="w-full px-8 py-5 bg-secondary/30 border border-transparent rounded-[2rem] focus:bg-white focus:border-accent outline-none font-bold transition-all" 
                      value={addressForm.pincode}
                      onChange={(e) => setAddressForm({...addressForm, pincode: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-4">State</label>
                  <input 
                    required 
                    placeholder="e.g. Tamil Nadu"
                    className="w-full px-8 py-5 bg-secondary/30 border border-transparent rounded-[2rem] focus:bg-white focus:border-accent outline-none font-bold transition-all" 
                    value={addressForm.state}
                    onChange={(e) => setAddressForm({...addressForm, state: e.target.value})}
                  />
                </div>

                <div className="flex items-center space-x-4 pt-4 ml-4">
                  <input 
                    type="checkbox" 
                    id="isDefault" 
                    className="w-5 h-5 rounded-lg border-border text-accent focus:ring-accent"
                    checked={addressForm.isDefault}
                    onChange={(e) => setAddressForm({...addressForm, isDefault: e.target.checked})}
                  />
                  <label htmlFor="isDefault" className="text-xs font-bold uppercase tracking-widest opacity-60">Set as primary sanctum</label>
                </div>

                <button 
                  disabled={isSubmitting}
                  className="w-full py-6 bg-primary text-white rounded-full font-bold shadow-2xl hover:bg-black transition-all disabled:opacity-50 uppercase tracking-widest text-[11px]"
                >
                  {isSubmitting ? "Processing..." : "Authorize Address"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  );
}
