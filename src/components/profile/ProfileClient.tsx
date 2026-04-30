"use client";

import { useState } from "react";
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
  Smartphone,
  Lock,
  Eye,
  EyeOff
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

export default function ProfileClient({ initialData }: { initialData: UserData }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [userData, setUserData] = useState<UserData>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();
  const router = useRouter();

  // Password Visibility
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

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
    name: initialData.name || "",
    phone: initialData.phone || ""
  });

  // Password Form State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/profile");
      if (res.ok) {
        const data = await res.json();
        setUserData(data);
      }
    } catch (err) {
      console.error(err);
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
        showToast("Update failed", "warning");
      }
    } catch (err) {
      showToast("An error occurred", "warning");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast("Passwords do not match", "warning");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/profile/password", {
        method: "PATCH",
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        })
      });
      const data = await res.json();
      if (res.ok) {
        showToast("Password updated successfully", "success");
        setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        showToast(data.error || "Failed to update password", "warning");
      }
    } catch (err) {
      showToast("An error occurred", "warning");
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
      showToast("Failed to add address", "warning");
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
      showToast("Failed to delete address", "warning");
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
      showToast("Update failed", "warning");
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  };

  const menuItems = [
    { id: "overview", label: "Overview", icon: User },
    { id: "orders", label: "Orders", icon: Package },
    { id: "addresses", label: "Addresses", icon: MapPin },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <main className="min-h-screen bg-[#FDFAF5] text-primary">
      <Navbar />

      <div className="pt-24 sm:pt-32 pb-24 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Sidebar */}
          <div className="lg:w-80 w-full flex-shrink-0">
            <div className="bg-white rounded-[2.5rem] sm:rounded-[3rem] p-6 sm:p-8 shadow-xl border border-border/50 lg:sticky lg:top-32">
              <div className="flex items-center space-x-4 mb-8 sm:mb-10">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-accent/10 text-accent rounded-2xl sm:rounded-3xl flex items-center justify-center text-xl sm:text-2xl font-serif font-bold">
                  {userData.name?.[0] || userData.email[0].toUpperCase()}
                </div>
                <div className="overflow-hidden">
                  <h2 className="text-lg sm:text-xl font-serif font-bold truncate">{userData.name || "Guest"}</h2>
                  <p className="text-[9px] sm:text-[10px] text-muted-foreground font-black uppercase tracking-widest">{userData.role}</p>
                </div>
              </div>

              <div className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 gap-2 no-scrollbar">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex-shrink-0 lg:w-full flex items-center justify-between p-3 sm:p-4 rounded-xl sm:rounded-2xl transition-all ${
                      activeTab === item.id 
                        ? "bg-primary text-white shadow-lg" 
                        : "hover:bg-secondary text-primary/60 hover:text-primary bg-secondary/30 lg:bg-transparent"
                    }`}
                  >
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <item.icon size={16} className="sm:w-[18px] sm:h-[18px]" />
                      <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest">{item.label}</span>
                    </div>
                    <ChevronRight size={14} className={`hidden lg:block ${activeTab === item.id ? "opacity-100" : "opacity-0"}`} />
                  </button>
                ))}
                
                <button
                  onClick={handleLogout}
                  className="flex-shrink-0 lg:w-full flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl text-red-500 hover:bg-red-50 transition-all lg:mt-8 bg-red-50/50 lg:bg-transparent"
                >
                  <LogOut size={16} className="sm:w-[18px] sm:h-[18px]" />
                  <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest">Sign Out</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-grow w-full">
            <AnimatePresence mode="wait">
              {activeTab === "overview" && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6 sm:space-y-8"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                    <div className="bg-white p-6 sm:p-8 rounded-[2.5rem] sm:rounded-[3rem] shadow-sm border border-border/50">
                      <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">Total Orders</p>
                      <div className="flex items-center justify-between">
                        <span className="text-3xl sm:text-4xl font-serif font-bold">{userData.orders.length}</span>
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-accent/10 text-accent rounded-2xl flex items-center justify-center"><Package size={20} className="sm:w-6 sm:h-6" /></div>
                      </div>
                    </div>
                    <div className="bg-white p-6 sm:p-8 rounded-[2.5rem] sm:rounded-[3rem] shadow-sm border border-border/50">
                      <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">Saved Addresses</p>
                      <div className="flex items-center justify-between">
                        <span className="text-3xl sm:text-4xl font-serif font-bold">{userData.addresses.length}</span>
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center"><MapPin size={20} className="sm:w-6 sm:h-6" /></div>
                      </div>
                    </div>
                    <div className="bg-white p-6 sm:p-8 rounded-[2.5rem] sm:rounded-[3rem] shadow-sm border border-border/50">
                      <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">Membership</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xl sm:text-2xl font-serif font-bold">Standard</span>
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-black text-white rounded-2xl flex items-center justify-center"><ShieldCheck size={20} className="sm:w-6 sm:h-6" /></div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 sm:p-10 rounded-[3rem] sm:rounded-[4rem] shadow-sm border border-border/50">
                    <h3 className="text-xl sm:text-2xl font-serif font-bold mb-6 sm:mb-8">Latest Order</h3>
                    {userData.orders[0] ? (
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                        <div className="w-20 h-28 bg-secondary rounded-xl overflow-hidden relative shadow-lg flex-shrink-0">
                          {userData.orders[0].items[0].book.image && (
                            <img src={userData.orders[0].items[0].book.image} className="w-full h-full object-cover" />
                          )}
                        </div>
                        <div className="flex-grow">
                          <p className="text-[9px] font-black uppercase tracking-widest text-accent mb-1">Order #{userData.orders[0].id.slice(-6)}</p>
                          <h4 className="text-md sm:text-lg font-bold">{userData.orders[0].items[0].book.title}</h4>
                          <p className="text-xs text-muted-foreground">Status: <span className="text-primary font-bold uppercase tracking-widest text-[9px]">{userData.orders[0].status}</span></p>
                        </div>
                        <button onClick={() => setActiveTab("orders")} className="w-full sm:w-auto px-6 py-3 border border-border rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-secondary transition-all">View History</button>
                      </div>
                    ) : (
                      <p className="text-center py-12 text-muted-foreground italic">You haven't placed any orders yet.</p>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === "orders" && (
                <motion.div
                  key="orders"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-primary mb-6 sm:mb-8">Order History</h2>
                  {userData.orders.map((order) => (
                    <div key={order.id} className="bg-white p-6 sm:p-8 rounded-[2.5rem] sm:rounded-[3rem] shadow-sm border border-border/50 transition-all hover:border-accent group">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-6 border-b border-border/50 gap-4">
                        <div className="flex items-center space-x-4">
                          <div className={`p-3 rounded-2xl ${order.status === 'PAID' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                            {order.status === 'PAID' ? <CheckCircle2 size={20} /> : <Clock size={20} />}
                          </div>
                          <div>
                            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Order ID #{order.id.slice(-8).toUpperCase()}</p>
                            <p className="text-xs font-bold">{new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                          </div>
                        </div>
                        <div className="sm:text-right">
                          <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Total Amount</p>
                          <p className="text-xl font-bold text-primary">Rs. {order.totalAmount.toFixed(2)}</p>
                        </div>
                      </div>

                      <div className="space-y-6">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center space-x-4 sm:space-x-6">
                            <div className="w-14 h-20 sm:w-16 sm:h-20 bg-secondary rounded-lg overflow-hidden flex-shrink-0 relative">
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
                  {userData.orders.length === 0 && (
                    <div className="text-center py-16 sm:py-24 bg-white rounded-[3rem] sm:rounded-[4rem] border-2 border-dashed border-border">
                      <Package className="mx-auto text-muted-foreground/30 mb-6" size={64} />
                      <p className="text-muted-foreground italic">No orders found.</p>
                      <button onClick={() => router.push('/shop')} className="mt-8 px-10 py-4 bg-primary text-white rounded-full font-bold uppercase tracking-widest text-[10px]">Shop Now</button>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === "addresses" && (
                <motion.div
                  key="addresses"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6 sm:space-y-8"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                    <h2 className="text-2xl sm:text-3xl font-serif font-bold text-primary">Saved Addresses</h2>
                    <button 
                      onClick={() => setShowAddAddress(true)}
                      className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-4 bg-accent text-white rounded-full font-bold shadow-xl hover:scale-105 transition-all"
                    >
                      <Plus size={18} /><span className="uppercase tracking-widest text-[10px]">Add New</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {userData.addresses.map((addr) => (
                      <div key={addr.id} className={`bg-white p-6 sm:p-8 rounded-[2.5rem] sm:rounded-[3rem] shadow-sm border transition-all relative group ${addr.isDefault ? 'border-accent ring-4 ring-accent/5' : 'border-border/50 hover:border-primary/30'}`}>
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
                              Set as Default
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

                  {userData.addresses.length === 0 && (
                    <div className="text-center py-16 sm:py-24 bg-white rounded-[3rem] sm:rounded-[4rem] border-2 border-dashed border-border">
                      <MapPin className="mx-auto text-muted-foreground/30 mb-6" size={64} />
                      <p className="text-muted-foreground italic">No addresses saved.</p>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === "settings" && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6 sm:space-y-8"
                >
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-primary mb-6 sm:mb-8">Account Settings</h2>
                  
                  <div className="bg-white p-6 sm:p-10 rounded-[3rem] sm:rounded-[4rem] shadow-sm border border-border/50">
                    <h4 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center space-x-3">
                      <User size={16} />
                      <span>Personal Information</span>
                    </h4>
                    <form onSubmit={handleUpdateProfile} className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-4">Full Name</label>
                          <div className="relative">
                            <User className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                            <input 
                              placeholder="e.g. Rahul Sharma"
                              className="w-full pl-14 pr-8 py-5 bg-[#FDFDFD] border border-border rounded-[2rem] focus:border-accent outline-none font-bold transition-all" 
                              value={settingsForm.name}
                              onChange={(e) => setSettingsForm({...settingsForm, name: e.target.value})}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-4">Phone Number</label>
                          <div className="relative">
                            <Smartphone className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                            <input 
                              placeholder="+91 98765 43210"
                              className="w-full pl-14 pr-8 py-5 bg-[#FDFDFD] border border-border rounded-[2rem] focus:border-accent outline-none font-bold transition-all" 
                              value={settingsForm.phone}
                              onChange={(e) => setSettingsForm({...settingsForm, phone: e.target.value})}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-4">Email Address (Read-only)</label>
                        <div className="w-full px-8 py-5 bg-secondary/50 border border-border/20 rounded-[2rem] text-muted-foreground font-bold opacity-60 overflow-hidden text-ellipsis">
                          {userData.email}
                        </div>
                      </div>

                      <div className="pt-2">
                        <button 
                          disabled={isSubmitting}
                          className="w-full sm:w-auto px-12 py-5 bg-primary text-white rounded-full font-bold shadow-2xl hover:scale-[1.02] transition-all flex items-center justify-center space-x-3 disabled:opacity-50"
                        >
                          <CheckCircle2 size={18} />
                          <span className="uppercase tracking-widest text-xs font-black">Save Changes</span>
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Password Change Section */}
                  <div className="bg-white p-6 sm:p-10 rounded-[3rem] sm:rounded-[4rem] shadow-sm border border-border/50">
                    <h4 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center space-x-3 text-red-500">
                      <Lock size={16} />
                      <span>Security & Password</span>
                    </h4>
                    <form onSubmit={handlePasswordChange} className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-4">Current Password</label>
                        <div className="relative">
                          <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                          <input 
                            required
                            type={showCurrentPass ? "text" : "password"}
                            placeholder="••••••••"
                            className="w-full pl-14 pr-14 py-5 bg-[#FDFDFD] border border-border rounded-[2rem] focus:border-accent outline-none font-bold transition-all" 
                            value={passwordForm.currentPassword}
                            onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                          />
                          <button 
                            type="button"
                            onClick={() => setShowCurrentPass(!showCurrentPass)}
                            className="absolute right-6 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-accent transition-colors"
                          >
                            {showCurrentPass ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-4">New Password</label>
                          <div className="relative">
                            <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                            <input 
                              required
                              type={showNewPass ? "text" : "password"}
                              placeholder="••••••••"
                              className="w-full pl-14 pr-14 py-5 bg-[#FDFDFD] border border-border rounded-[2rem] focus:border-accent outline-none font-bold transition-all" 
                              value={passwordForm.newPassword}
                              onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                            />
                            <button 
                              type="button"
                              onClick={() => setShowNewPass(!showNewPass)}
                              className="absolute right-6 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-accent transition-colors"
                            >
                              {showNewPass ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-4">Confirm New Password</label>
                          <div className="relative">
                            <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                            <input 
                              required
                              type={showNewPass ? "text" : "password"}
                              placeholder="••••••••"
                              className="w-full pl-14 pr-14 py-5 bg-[#FDFDFD] border border-border rounded-[2rem] focus:border-accent outline-none font-bold transition-all" 
                              value={passwordForm.confirmPassword}
                              onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="pt-2">
                        <button 
                          disabled={isSubmitting}
                          className="w-full sm:w-auto px-12 py-5 bg-red-500 text-white rounded-full font-bold shadow-2xl hover:bg-red-600 transition-all flex items-center justify-center space-x-3 disabled:opacity-50"
                        >
                          <Lock size={18} />
                          <span className="uppercase tracking-widest text-xs font-black">Update Password</span>
                        </button>
                      </div>
                    </form>
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
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 30 }} className="relative bg-white w-full max-w-xl rounded-[3rem] sm:rounded-[4rem] shadow-2xl p-6 sm:p-10 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-accent text-white rounded-2xl flex items-center justify-center"><Plus size={20} className="sm:w-6 sm:h-6" /></div>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold">Add New Address</h2>
                </div>
                <button onClick={() => setShowAddAddress(false)} className="p-2 hover:bg-secondary rounded-full transition-colors"><Plus size={24} className="rotate-45" /></button>
              </div>
              
              <form onSubmit={handleAddAddress} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-4">Full Address</label>
                  <textarea 
                    required 
                    rows={3}
                    placeholder="e.g. Flat No. 102, Palm Heights, Main Road..."
                    className="w-full px-6 sm:px-8 py-4 sm:py-5 bg-secondary/30 border border-transparent rounded-[1.5rem] sm:rounded-[2rem] focus:bg-white focus:border-accent outline-none font-bold transition-all resize-none" 
                    value={addressForm.address}
                    onChange={(e) => setAddressForm({...addressForm, address: e.target.value})}
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-4">City</label>
                    <input 
                      required 
                      placeholder="e.g. Mumbai"
                      className="w-full px-6 sm:px-8 py-4 sm:py-5 bg-secondary/30 border border-transparent rounded-[1.5rem] sm:rounded-[2rem] focus:bg-white focus:border-accent outline-none font-bold transition-all" 
                      value={addressForm.city}
                      onChange={(e) => setAddressForm({...addressForm, city: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-4">Pin Code</label>
                    <input 
                      required 
                      placeholder="e.g. 400001"
                      className="w-full px-6 sm:px-8 py-4 sm:py-5 bg-secondary/30 border border-transparent rounded-[1.5rem] sm:rounded-[2rem] focus:bg-white focus:border-accent outline-none font-bold transition-all" 
                      value={addressForm.pincode}
                      onChange={(e) => setAddressForm({...addressForm, pincode: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-4">State</label>
                  <input 
                    required 
                    placeholder="e.g. Maharashtra"
                    className="w-full px-6 sm:px-8 py-4 sm:py-5 bg-secondary/30 border border-transparent rounded-[1.5rem] sm:rounded-[2rem] focus:bg-white focus:border-accent outline-none font-bold transition-all" 
                    value={addressForm.state}
                    onChange={(e) => setAddressForm({...addressForm, state: e.target.value})}
                  />
                </div>

                <div className="flex items-center space-x-4 pt-2 ml-4">
                  <input 
                    type="checkbox" 
                    id="isDefault" 
                    className="w-5 h-5 rounded-lg border-border text-accent focus:ring-accent"
                    checked={addressForm.isDefault}
                    onChange={(e) => setAddressForm({...addressForm, isDefault: e.target.checked})}
                  />
                  <label htmlFor="isDefault" className="text-xs font-bold uppercase tracking-widest opacity-60">Set as Primary Address</label>
                </div>

                <button 
                  disabled={isSubmitting}
                  className="w-full py-5 sm:py-6 bg-primary text-white rounded-full font-bold shadow-2xl hover:bg-black transition-all disabled:opacity-50 uppercase tracking-widest text-[10px] sm:text-[11px]"
                >
                  {isSubmitting ? "Saving..." : "Save Address"}
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
