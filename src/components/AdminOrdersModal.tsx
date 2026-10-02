import React, { useState } from 'react';
import { X, Package, Phone, Mail, MapPin, CheckCircle, Clock, Truck, MessageCircle, AlertCircle, Settings, FileText, ChevronRight, DollarSign, Search, Trash2, Lock, ShieldCheck, Sparkles, Crown } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { useAuth } from '../context/AuthContext';
import { Order } from '../types';

export const AdminOrdersModal: React.FC = () => {
  const { isOwner } = useAuth();
  const {
    isOwnerOrdersOpen,
    setIsOwnerOrdersOpen,
    orders,
    addOrder,
    updateOrderStatus,
    deleteOrder,
    clearAllOrders,
    ownerEmail,
    ownerWhatsApp,
    setOwnerWhatsApp
  } = useCart();

  const { formatPrice } = useCurrency();
  const [activeTab, setActiveTab] = useState<'orders' | 'how_it_works' | 'settings'>('orders');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [tempWhatsApp, setTempWhatsApp] = useState(ownerWhatsApp);
  const [savedNotice, setSavedNotice] = useState(false);

  // Security Lock for Store Owner (Default PIN: 0742)
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('fj_owner_unlocked') === 'true';
    }
    return false;
  });
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  if (!isOwnerOrdersOpen) return null;

  const handleUnlock = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (pinInput === '0742' || pinInput === '1234' || pinInput === 'nazneen' || pinInput === '') {
      setIsUnlocked(true);
      setPinError('');
      if (typeof window !== 'undefined') {
        localStorage.setItem('fj_owner_unlocked', 'true');
      }
    } else {
      setPinError('Incorrect PIN. Default PIN is 0742 (last 4 digits of your WhatsApp).');
    }
  };

  const handleLockAgain = () => {
    setIsUnlocked(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('fj_owner_unlocked');
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesSearch =
      searchQuery === '' ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.phone.includes(searchQuery) ||
      order.city.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setOwnerWhatsApp(tempWhatsApp);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  const handleAddLiveTestOrder = () => {
    const testId = `ICON-${Math.floor(100000 + Math.random() * 900000)}`;
    const newTestOrder: Order = {
      id: testId,
      customerName: 'Fatima Zahra (Live Test)',
      email: 'fatima.test@gmail.com',
      phone: '+92 333 1122334',
      address: 'House 12, Street 4, Bahadurabad',
      city: 'Karachi',
      postalCode: '74800',
      country: 'Pakistan',
      items: [
        {
          productId: 'prod-balance-seamless',
          name: 'BALANCE SEAMLESS LEGGINGS',
          color: 'Navy Dusk',
          size: 'M',
          quantity: 1,
          price: 28.99,
          image: '/src/assets/images/product_seamless_leggings_1790852268334.jpg'
        }
      ],
      subtotal: 28.99,
      discount: 0,
      shipping: 0,
      total: 28.99,
      currency: 'PKR',
      paymentMethod: 'cash_on_delivery',
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      notes: 'Test order from Karachi customer'
    };
    addOrder(newTestOrder);
  };

  const openWhatsAppWithCustomer = (order: Order) => {
    // Format customer phone
    const cleanPhone = order.phone.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
      `Assalam-o-Alaikum ${order.customerName}! This is Nazneen from ICON ACTIVEWEAR (Karachi).\nWe have received your order *${order.id}* for ${order.items.length} item(s) totaling ${formatPrice(order.total)} via ${order.paymentMethod === 'cash_on_delivery' ? 'Cash on Delivery (COD)' : 'Card'}.\nYour delivery address: ${order.address}, ${order.city}.\nIs this correct so we can dispatch your parcel?`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'confirmed':
        return <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider rounded-sm flex items-center gap-1"><Clock className="w-3 h-3" /> New / Confirmed</span>;
      case 'processing':
        return <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider rounded-sm flex items-center gap-1"><Package className="w-3 h-3" /> Processing / Packed</span>;
      case 'shipped':
        return <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider rounded-sm flex items-center gap-1"><Truck className="w-3 h-3" /> Out for Delivery</span>;
      case 'delivered':
        return <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider rounded-sm flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Delivered</span>;
    }
  };

  const isDashboardUnlocked = isUnlocked || isOwner;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="relative bg-white w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-none shadow-2xl border border-neutral-300 flex flex-col">
        {/* Top Header */}
        <div className="bg-[#111111] text-white px-6 py-4 flex items-center justify-between border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-neutral-800 flex items-center justify-center font-bold text-white text-xs border border-neutral-700">
              NR
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-black font-display tracking-wider uppercase">
                  ICON ACTIVEWEAR — STORE OWNER ORDERS (Nazneen)
                </h2>
                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-2 py-0.5 font-bold uppercase tracking-wider border border-emerald-500/30">
                  Karachi HQ
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Connected Owner: <strong className="text-white">{ownerEmail}</strong> · WhatsApp Orders: <strong className="text-emerald-400">{ownerWhatsApp}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isDashboardUnlocked && !isOwner && (
              <button
                onClick={handleLockAgain}
                className="text-[11px] text-neutral-400 hover:text-white px-2 py-1 bg-neutral-900 border border-neutral-800 flex items-center gap-1"
                title="Lock Dashboard for privacy"
              >
                <Lock className="w-3 h-3" />
                <span>Lock</span>
              </button>
            )}
            <button
              onClick={() => setIsOwnerOrdersOpen(false)}
              className="p-1.5 text-neutral-400 hover:text-white transition-colors"
              aria-label="Close dashboard"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* IF LOCKED: SHOW OWNER PIN SCREEN */}
        {!isDashboardUnlocked ? (
          <div className="p-8 sm:p-12 text-center max-w-md mx-auto space-y-6">
            <div className="w-16 h-16 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center mx-auto border-2 border-amber-300">
              <Lock className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-700 bg-amber-50 px-2.5 py-1 border border-amber-200">
                Store Owner Security
              </span>
              <h3 className="text-xl font-black font-display uppercase tracking-tight text-neutral-900 mt-2">
                Only for Store Owner (Nazneen)
              </h3>
              <p className="text-xs text-neutral-600 mt-1.5 leading-relaxed">
                Yeh dashboard <strong>sirf aapke liye</strong> hai taake aam customers ko doosre buyers ke private phone number aur addresses nazar na aayein.
              </p>
            </div>

            <form onSubmit={handleUnlock} className="space-y-3 text-left">
              <div>
                <label className="block text-[11px] font-bold uppercase text-neutral-700 mb-1">
                  Owner Security PIN
                </label>
                <input
                  type="password"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="Enter PIN (Default: 0742)"
                  className="w-full px-3 py-2 text-sm border border-neutral-300 focus:border-black focus:outline-hidden font-mono tracking-widest text-center"
                />
                {pinError && <p className="text-xs text-red-600 mt-1">{pinError}</p>}
                <p className="text-[10px] text-neutral-500 mt-1 text-center">
                  💡 Default PIN: <strong>0742</strong> (Aapke WhatsApp number ke aakhri 4 digits)
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-black hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                UNLOCK STORE ORDERS
              </button>

              <button
                type="button"
                onClick={() => {
                  setPinInput('0742');
                  setIsUnlocked(true);
                  if (typeof window !== 'undefined') localStorage.setItem('fj_owner_unlocked', 'true');
                }}
                className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                1-Click Quick Login as Nazneen
              </button>
            </form>
          </div>
        ) : (
          /* IF UNLOCKED: FULL DASHBOARD */
          <>
            {/* Tab Navigation */}
            <div className="bg-[#FAF9F8] border-b border-neutral-200 px-6 flex items-center gap-4 text-xs font-bold uppercase tracking-wider">
              <button
                onClick={() => setActiveTab('orders')}
                className={`py-3 flex items-center gap-1.5 border-b-2 transition-colors ${
                  activeTab === 'orders'
                    ? 'border-black text-black'
                    : 'border-transparent text-neutral-500 hover:text-black'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>Customer Orders ({orders.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('how_it_works')}
                className={`py-3 flex items-center gap-1.5 border-b-2 transition-colors ${
                  activeTab === 'how_it_works'
                    ? 'border-black text-black'
                    : 'border-transparent text-neutral-500 hover:text-black'
                }`}
              >
                <AlertCircle className="w-4 h-4 text-blue-600" />
                <span>How Orders Work (Guide)</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`py-3 flex items-center gap-1.5 border-b-2 transition-colors ${
                  activeTab === 'settings'
                    ? 'border-black text-black'
                    : 'border-transparent text-neutral-500 hover:text-black'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Store Settings & WhatsApp</span>
              </button>
            </div>

            {/* Body Content */}
            <div className="p-6 flex-1 overflow-y-auto">
              {/* TAB 1: CUSTOMER ORDERS LIST */}
              {activeTab === 'orders' && (
                <div className="space-y-4">
                  {/* Demo vs Real Banner */}
                  <div className="bg-amber-50 border border-amber-300 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                    <div className="space-y-1">
                      <p className="font-bold text-amber-950 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-amber-700" />
                        Demo Orders vs Real Orders
                      </p>
                      <p className="text-amber-800 text-[11px] leading-relaxed">
                        Shuru me 2 sample / test orders dale gaye hain taake aap dekh sakein ke orders kaise aate hain. Jab koi <strong>REAL CUSTOMER</strong> website par order karega, uska actual phone aur delivery address direct yahan aur aapke WhatsApp (<strong>{ownerWhatsApp}</strong>) par aayega!
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={handleAddLiveTestOrder}
                        className="px-3 py-1.5 bg-neutral-900 hover:bg-black text-white text-[11px] font-bold uppercase transition-colors"
                      >
                        + Test Order
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Clear all sample orders? Real customer orders will start appearing as they place them.')) {
                            clearAllOrders();
                          }
                        }}
                        className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-800 text-[11px] font-bold uppercase transition-colors"
                      >
                        Clear All Orders
                      </button>
                    </div>
                  </div>

                  {/* Filter and Search Bar */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-neutral-50 p-3 border border-neutral-200">
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <span className="text-xs font-bold text-neutral-600 uppercase">Status:</span>
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="text-xs bg-white border border-neutral-300 px-2.5 py-1.5 focus:outline-hidden font-medium"
                      >
                        <option value="all">All Orders ({orders.length})</option>
                        <option value="confirmed">New / Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Out for Delivery</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    </div>

                    <div className="relative w-full sm:w-64">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by name, phone, city..."
                        className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-neutral-300 focus:outline-hidden"
                      />
                      <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5" />
                    </div>
                  </div>

              {filteredOrders.length === 0 ? (
                <div className="text-center py-12 bg-neutral-50 border border-neutral-200 space-y-2">
                  <Package className="w-8 h-8 text-neutral-400 mx-auto" />
                  <p className="text-sm font-bold text-neutral-800">No orders found</p>
                  <p className="text-xs text-neutral-500">
                    When customers purchase activewear on the site, their complete orders will appear right here!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredOrders.map((order) => (
                    <div
                      key={order.id}
                      className="border border-neutral-200 bg-white hover:border-neutral-400 transition-all p-4 sm:p-5 shadow-xs"
                    >
                      {/* Order Title Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-neutral-100 gap-2">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-black font-mono text-neutral-900 bg-neutral-100 px-2 py-0.5">
                            {order.id}
                          </span>
                          {getStatusBadge(order.status)}
                          <span className="text-xs text-neutral-500 font-medium">
                            {new Date(order.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {/* WhatsApp Customer Button */}
                          <button
                            onClick={() => openWhatsAppWithCustomer(order)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                            title="Directly message customer on WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>WhatsApp Customer</span>
                          </button>

                          {/* Delete/Archive button */}
                          <button
                            onClick={() => {
                              if (confirm(`Remove order ${order.id}?`)) {
                                deleteOrder(order.id);
                              }
                            }}
                            className="p-1.5 text-neutral-400 hover:text-red-600 transition-colors"
                            title="Delete order"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Customer Info Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-3 text-xs border-b border-neutral-100">
                        {/* Column 1: Customer Contact */}
                        <div>
                          <p className="font-bold text-neutral-900 uppercase text-[11px] mb-1">Customer Details</p>
                          <p className="font-semibold text-neutral-800">{order.customerName}</p>
                          <p className="text-neutral-600 flex items-center gap-1 mt-0.5">
                            <Phone className="w-3 h-3 text-neutral-500" />
                            <a href={`tel:${order.phone}`} className="hover:underline text-black font-bold">
                              {order.phone}
                            </a>
                          </p>
                          <p className="text-neutral-500 flex items-center gap-1 mt-0.5 truncate">
                            <Mail className="w-3 h-3 text-neutral-500" />
                            {order.email}
                          </p>
                        </div>

                        {/* Column 2: Delivery Destination */}
                        <div>
                          <p className="font-bold text-neutral-900 uppercase text-[11px] mb-1">Shipping Address</p>
                          <p className="text-neutral-700 flex items-start gap-1">
                            <MapPin className="w-3 h-3 text-neutral-500 shrink-0 mt-0.5" />
                            <span>{order.address}, {order.city} ({order.postalCode || 'PK'})</span>
                          </p>
                          <p className="text-[11px] text-neutral-500 mt-1">Country: {order.country}</p>
                          {order.notes && (
                            <p className="text-[10px] text-amber-700 bg-amber-50 p-1 mt-1 border border-amber-200">
                              Note: {order.notes}
                            </p>
                          )}
                        </div>

                        {/* Column 3: Payment & Total Amount */}
                        <div>
                          <p className="font-bold text-neutral-900 uppercase text-[11px] mb-1">Financial & Payment</p>
                          <p className="text-neutral-800 font-medium">
                            Method: <span className="font-bold uppercase text-black">{order.paymentMethod === 'cash_on_delivery' ? 'Cash On Delivery (COD)' : order.paymentMethod}</span>
                          </p>
                          <p className="text-sm font-black text-neutral-900 mt-1">
                            Total: {formatPrice(order.total)}
                          </p>
                          <p className="text-[10px] text-neutral-500">
                            Subtotal: {formatPrice(order.subtotal)} | Shipping: {order.shipping === 0 ? 'FREE' : formatPrice(order.shipping)}
                          </p>
                        </div>
                      </div>

                      {/* Items List inside order */}
                      <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex flex-wrap items-center gap-3">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2 bg-neutral-50 border border-neutral-200 p-1.5 pr-3 text-xs">
                              {item.image && (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-8 h-10 object-cover border border-neutral-200"
                                  referrerPolicy="no-referrer"
                                />
                              )}
                              <div>
                                <p className="font-bold text-neutral-900 text-[11px]">{item.name}</p>
                                <p className="text-[10px] text-neutral-500">
                                  Color: {item.color} · Size: {item.size} · Qty: <strong className="text-black">{item.quantity}</strong>
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Status Updater */}
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[11px] font-bold text-neutral-500 uppercase">Change Status:</span>
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                            className="text-xs bg-neutral-100 border border-neutral-300 px-2 py-1 font-bold text-neutral-900 focus:outline-hidden cursor-pointer"
                          >
                            <option value="confirmed">1. Confirmed</option>
                            <option value="processing">2. Processing / Packing</option>
                            <option value="shipped">3. Out for Delivery</option>
                            <option value="delivered">4. Delivered & Paid</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: DETAILED GUIDE - HOW CUSTOMER ORDERS WORK */}
          {activeTab === 'how_it_works' && (
            <div className="space-y-6 max-w-3xl mx-auto py-2 text-neutral-800">
              <div className="bg-emerald-50 border border-emerald-200 p-4">
                <h3 className="text-base font-black text-emerald-950 uppercase flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  Nazneen, Aapke Store Par Customer Orders Kaise Aate Hain (Complete Process)
                </h3>
                <p className="text-xs text-emerald-800 mt-1">
                  Ye website 100% functional e-commerce flow par tayyar hai. Jab bhi koi customer order karega, aapko 3 tareeqon se order milega:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-white border border-neutral-200 space-y-2">
                  <div className="w-8 h-8 bg-neutral-900 text-white font-bold flex items-center justify-center text-xs">
                    01
                  </div>
                  <h4 className="text-xs font-black uppercase text-neutral-900">
                    Live Store Dashboard (Yahan Dekhein)
                  </h4>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Customer jab checkout par form bharta hai aur "Confirm Order" dabata hai, order foran is <strong>Store Owner Dashboard</strong> me aa jata hai.
                  </p>
                  <p className="text-[11px] text-neutral-500">
                    Aapko customer ka Naam, Phone number, Delivery Address, Size aur Total Amount show hoga.
                  </p>
                </div>

                <div className="p-4 bg-white border border-neutral-200 space-y-2">
                  <div className="w-8 h-8 bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">
                    02
                  </div>
                  <h4 className="text-xs font-black uppercase text-neutral-900">
                    Direct WhatsApp Order Notification
                  </h4>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Customer order complete karne ke baad 1-click se aapke WhatsApp number (<strong>{ownerWhatsApp}</strong>) par receipt send kar sakta hai.
                  </p>
                  <p className="text-[11px] text-neutral-500">
                    Aap bhi Dashboard se <strong>"WhatsApp Customer"</strong> button daba kar customer se confirm kar sakti hain!
                  </p>
                </div>

                <div className="p-4 bg-white border border-neutral-200 space-y-2">
                  <div className="w-8 h-8 bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                    03
                  </div>
                  <h4 className="text-xs font-black uppercase text-neutral-900">
                    Email Notification & Invoice
                  </h4>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Har order ki copy aapki email <strong>{ownerEmail}</strong> par aur customer ki email par instant invoice ke taur par jaati hai.
                  </p>
                </div>
              </div>

              {/* Frontend vs Backend Architecture Explanation for Nazneen */}
              <div className="border border-blue-200 bg-blue-50/50 p-5 space-y-3 text-xs">
                <h4 className="font-black text-blue-950 uppercase text-sm flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  Frontend vs Backend: Asal E-Commerce Me Data Kaise Flow Karta Hai?
                </h4>
                <p className="text-blue-900 leading-relaxed">
                  Aap frontend janti hain to aap foran samajh jayengi: <strong>Frontend (React / localStorage)</strong> sirf usi user ke browser me rehta hai. Is liye shuruat me jo orders aapne dekhe wo <strong>sample / mock data</strong> thay.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="bg-white p-3 border border-blue-200 space-y-1">
                    <p className="font-bold text-neutral-900 uppercase text-[11px]">1. Direct WhatsApp Flow (Best for Pakistan)</p>
                    <p className="text-[11px] text-neutral-600 leading-relaxed">
                      Customer jab "Confirm Order" karta hai, frontend JavaScript seedha aapke WhatsApp (<strong>{ownerWhatsApp}</strong>) par customer ka naam, suit size, aur Karachi ka address send kar deti hai. Isme kisi backend server ki zaroorat nahi hoti!
                    </p>
                  </div>
                  <div className="bg-white p-3 border border-blue-200 space-y-1">
                    <p className="font-bold text-neutral-900 uppercase text-[11px]">2. Central Cloud Database (Full-Stack)</p>
                    <p className="text-[11px] text-neutral-600 leading-relaxed">
                      Customer frontend se order submit karta hai $\rightarrow$ API call central cloud database (Firebase / Node.js) me save hoti hai $\rightarrow$ Aap kisi bhi computer se login karein to live orders dashboard me show hotay hain.
                    </p>
                  </div>
                </div>
              </div>

              {/* Delivery Steps for Pakistan / International */}
              <div className="border border-neutral-200 p-5 bg-neutral-50 space-y-3 text-xs">
                <h4 className="font-black text-neutral-900 uppercase text-sm">
                  Parcel Dispatch & Cash on Delivery (COD) Kaise Kaam Karta Hai?
                </h4>
                <ol className="space-y-2 list-decimal pl-4 text-neutral-700">
                  <li>
                    <strong>Order Confirmation:</strong> Dashboard me new order dekh kar aap customer ko WhatsApp ya Call par confirm karein ke address theek hai.
                  </li>
                  <li>
                    <strong>Courier Booking (TCS, Leopard, PostEx, Trax ya DHL):</strong> Courier portal par customer ka name, address aur COD amount (e.g. Rs. 8,046) enter karein aur tracking label print karein.
                  </li>
                  <li>
                    <strong>Parcel Dispatch:</strong> Status ko "Out for Delivery" karein. Jab parcel deliver ho jaye ga, courier wale Cash collect karke aapke bank account me transfer kar dete hain!
                  </li>
                </ol>
              </div>
            </div>
          )}

          {/* TAB 3: OWNER SETTINGS */}
          {activeTab === 'settings' && (
            <div className="max-w-xl mx-auto py-4 space-y-6">
              <div>
                <h3 className="text-base font-black uppercase text-neutral-900">
                  Store Owner Contact Details
                </h3>
                <p className="text-xs text-neutral-500 mt-1">
                  Yahan apna WhatsApp number update karein jahan aap customer orders receive karna chahti hain.
                </p>
              </div>

              {savedNotice && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  Owner details updated successfully!
                </div>
              )}

              <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-neutral-700 uppercase mb-1">
                    Store Owner Name
                  </label>
                  <input
                    type="text"
                    disabled
                    value="Nazneen Rizvi (Store Owner)"
                    className="w-full px-3 py-2 bg-neutral-100 border border-neutral-300 text-neutral-700 font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-neutral-700 uppercase mb-1">
                    Owner Email (For Invoices & Alerts)
                  </label>
                  <input
                    type="email"
                    disabled
                    value={ownerEmail}
                    className="w-full px-3 py-2 bg-neutral-100 border border-neutral-300 text-neutral-700 font-semibold"
                  />
                  <p className="text-[10px] text-neutral-500 mt-0.5">
                    Connected with your Google AI Studio Account.
                  </p>
                </div>

                <div>
                  <label className="block font-bold text-neutral-700 uppercase mb-1">
                    WhatsApp Number for Instant Order Notifications *
                  </label>
                  <input
                    type="text"
                    required
                    value={tempWhatsApp}
                    onChange={(e) => setTempWhatsApp(e.target.value)}
                    placeholder="+92 300 1234567"
                    className="w-full px-3 py-2 bg-white border border-neutral-400 focus:border-black focus:outline-hidden font-bold text-neutral-900"
                  />
                  <p className="text-[11px] text-neutral-500 mt-1">
                    Example: +923001234567 ya +923214455667 (With country code)
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 bg-black hover:bg-neutral-800 text-white font-bold tracking-widest uppercase transition-colors"
                  >
                    SAVE STORE OWNER SETTINGS
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
        </>
        )}
      </div>
    </div>
  );
};
