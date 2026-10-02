import React, { useState } from 'react';
import { X, CheckCircle, CreditCard, Truck, ShieldCheck, ArrowRight, ShoppingBag, MessageCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { useAuth } from '../context/AuthContext';
import { Order } from '../types';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    items,
    clearCart,
    subtotalUsd,
    discountUsd,
    shippingUsd,
    totalUsd,
    addOrder,
    setIsOwnerOrdersOpen,
    ownerEmail,
    ownerWhatsApp
  } = useCart();

  const { formatPrice, currency } = useCurrency();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: 'Karachi',
    postalCode: '75500',
    country: currency === 'PKR' ? 'Pakistan' : 'United States',
    paymentMethod: 'cash_on_delivery' as 'credit_card' | 'cash_on_delivery' | 'apple_pay',
    cardNumber: '4242 •••• •••• 4242',
    cardExpiry: '12/28',
    cardCvc: '888'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  if (!isCheckoutOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.address) {
      alert('Please fill in your Full Name, Mobile Number, and Delivery Address.');
      return;
    }

    setIsSubmitting(true);

    const orderId = `ICON-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder: Order = {
      id: orderId,
      customerName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      postalCode: formData.postalCode,
      country: formData.country,
      items: items.map((i) => ({
        productId: i.product.id,
        name: i.product.name,
        color: i.selectedColor.name,
        size: i.selectedSize,
        quantity: i.quantity,
        price: i.product.usdPrice,
        image: i.product.image
      })),
      subtotal: subtotalUsd,
      discount: discountUsd,
      shipping: shippingUsd,
      total: totalUsd,
      currency,
      paymentMethod: formData.paymentMethod,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };

    // Save order permanently to central server and state
    addOrder(newOrder);
    setCompletedOrder(newOrder);
    clearCart();
    setIsSubmitting(false);
  };

  const handleClose = () => {
    setCompletedOrder(null);
    setIsCheckoutOpen(false);
  };

  const handleSendToOwnerWhatsApp = () => {
    if (!completedOrder) return;
    const cleanPhone = ownerWhatsApp.replace(/[^0-9]/g, '');
    const itemsList = completedOrder.items
      .map((i) => `• ${i.name} (${i.color}, Size ${i.size}) x${i.quantity}`)
      .join('\n');
    const msg = encodeURIComponent(
      `*🛍️ NEW ORDER — ICON ACTIVEWEAR (Karachi)*\n` +
      `-----------------------------------------\n` +
      `*Order ID:* ${completedOrder.id}\n` +
      `*Customer:* ${completedOrder.customerName}\n` +
      `*Phone:* ${completedOrder.phone}\n` +
      `*Delivery Address:* ${completedOrder.address}, ${completedOrder.city}\n\n` +
      `*Items Ordered:*\n${itemsList}\n\n` +
      `-----------------------------------------\n` +
      `*Total Bill (COD):* ${formatPrice(completedOrder.total)}\n` +
      `*Payment:* Cash on Delivery (COD)\n\n` +
      `Assalam-o-Alaikum Nazneen! Please confirm my order and dispatch to Karachi/Pakistan. Shukriya!`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${msg}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="relative bg-white w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-none shadow-2xl border border-neutral-200 p-6 sm:p-10">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-black transition-colors"
          aria-label="Close checkout"
        >
          <X className="w-5 h-5" />
        </button>

        {completedOrder ? (
          /* Order Confirmation Screen */
          <div className="text-center py-8 space-y-6 max-w-lg mx-auto">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black font-display tracking-tight text-neutral-900 uppercase">
                Order Confirmed!
              </h2>
              <p className="text-xs text-neutral-600">
                Thank you for your order, <span className="font-bold text-neutral-900">{completedOrder.customerName}</span>. Your order is logged in the system and an alert has been dispatched to store management (<span className="font-semibold text-neutral-900">{ownerEmail}</span>).
              </p>
            </div>

            {/* Order Details Badge */}
            <div className="bg-neutral-50 border border-neutral-200 p-4 text-left text-xs space-y-2">
              <div className="flex justify-between border-b border-neutral-200 pb-2">
                <span className="text-neutral-500 uppercase tracking-wider">Order Reference</span>
                <span className="font-mono font-bold text-neutral-900">{completedOrder.id}</span>
              </div>
              <div className="flex justify-between border-b border-neutral-200 pb-2">
                <span className="text-neutral-500 uppercase tracking-wider">Payment Method</span>
                <span className="font-semibold capitalize text-neutral-800">
                  {completedOrder.paymentMethod.replace(/_/g, ' ')}
                </span>
              </div>
              <div className="flex justify-between border-b border-neutral-200 pb-2">
                <span className="text-neutral-500 uppercase tracking-wider">Delivery Address</span>
                <span className="font-medium text-neutral-800 text-right">
                  {completedOrder.address}, {completedOrder.city}, {completedOrder.country}
                </span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-neutral-900 font-bold uppercase tracking-wider">Total Paid</span>
                <span className="font-black text-sm text-neutral-900 tabular-nums">
                  {formatPrice(completedOrder.total)}
                </span>
              </div>
            </div>

            {/* Order Confirmed Action Buttons */}
            <div className="space-y-3 pt-3">
              <button
                type="button"
                onClick={handleClose}
                className="w-full py-4 bg-black hover:bg-neutral-800 text-white text-xs font-black tracking-widest uppercase transition-all shadow-md cursor-pointer"
              >
                CONTINUE SHOPPING
              </button>

              <div className="flex items-center justify-center text-xs">
                <a
                  href={`https://wa.me/923113270742?text=Assalam-o-Alaikum!%20I%20have%20an%20inquiry%20about%20Order%20${completedOrder.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-500 hover:text-black font-semibold text-[11px] flex items-center gap-1 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Need help with this order? WhatsApp 0311-3270742</span>
                </a>
              </div>
            </div>
          </div>
        ) : (
          /* Checkout Form */
          <div>
            <div className="mb-6 border-b border-neutral-200 pb-4">
              <h2 className="text-xl sm:text-2xl font-black font-display tracking-tight text-neutral-900 uppercase">
                Secure Checkout
              </h2>
              <p className="text-xs text-neutral-500 mt-1">
                Enter your delivery details to complete your order.
              </p>
            </div>

            <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 md:grid-cols-12 gap-8">
              {/* Left Column: Customer & Delivery Info */}
              <div className="md:col-span-7 space-y-5">
                <div className="space-y-3">
                  <h3 className="text-xs font-bold tracking-wider uppercase text-neutral-900 border-b border-neutral-100 pb-1">
                    1. Contact & Shipping Information
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-neutral-700 uppercase mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        required
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="Sarah Jenkins"
                        className="w-full px-3 py-2 text-xs border border-neutral-300 focus:border-black focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-neutral-700 uppercase mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="sarah@example.com"
                        className="w-full px-3 py-2 text-xs border border-neutral-300 focus:border-black focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-neutral-700 uppercase mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+92 300 1234567 / +1 555..."
                        className="w-full px-3 py-2 text-xs border border-neutral-300 focus:border-black focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-neutral-700 uppercase mb-1">
                        Country / Region
                      </label>
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-xs border border-neutral-300 focus:border-black focus:outline-hidden bg-white"
                      >
                        <option value="Pakistan">Pakistan</option>
                        <option value="United States">United States</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Canada">Canada</option>
                        <option value="United Arab Emirates">United Arab Emirates</option>
                        <option value="Germany">Germany</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-neutral-700 uppercase mb-1">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Apartment, suite, street address"
                      className="w-full px-3 py-2 text-xs border border-neutral-300 focus:border-black focus:outline-hidden"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-neutral-700 uppercase mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="Lahore / New York"
                        className="w-full px-3 py-2 text-xs border border-neutral-300 focus:border-black focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-neutral-700 uppercase mb-1">
                        Postal / ZIP Code
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        placeholder="54000 / 10001"
                        className="w-full px-3 py-2 text-xs border border-neutral-300 focus:border-black focus:outline-hidden"
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Selection */}
                <div className="space-y-3 pt-4 border-t border-neutral-100">
                  <h3 className="text-xs font-bold tracking-wider uppercase text-neutral-900 border-b border-neutral-100 pb-1">
                    2. Payment Method
                  </h3>

                  <div className="space-y-2">
                    <label className={`flex items-center justify-between p-3 border cursor-pointer transition-all ${formData.paymentMethod === 'credit_card' ? 'border-black bg-neutral-50' : 'border-neutral-200'}`}>
                      <div className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="credit_card"
                          checked={formData.paymentMethod === 'credit_card'}
                          onChange={() => setFormData({ ...formData, paymentMethod: 'credit_card' })}
                          className="accent-black"
                        />
                        <span className="text-xs font-bold text-neutral-900">Credit / Debit Card</span>
                      </div>
                      <CreditCard className="w-4 h-4 text-neutral-500" />
                    </label>

                    <label className={`flex items-center justify-between p-3 border cursor-pointer transition-all ${formData.paymentMethod === 'cash_on_delivery' ? 'border-black bg-neutral-50' : 'border-neutral-200'}`}>
                      <div className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="cash_on_delivery"
                          checked={formData.paymentMethod === 'cash_on_delivery'}
                          onChange={() => setFormData({ ...formData, paymentMethod: 'cash_on_delivery' })}
                          className="accent-black"
                        />
                        <div>
                          <span className="text-xs font-bold text-neutral-900">Cash on Delivery (COD)</span>
                          <span className="block text-[10px] text-neutral-500">Pay when your package arrives at your doorstep</span>
                        </div>
                      </div>
                      <Truck className="w-4 h-4 text-neutral-500" />
                    </label>

                    <label className={`flex items-center justify-between p-3 border cursor-pointer transition-all ${formData.paymentMethod === 'apple_pay' ? 'border-black bg-neutral-50' : 'border-neutral-200'}`}>
                      <div className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="apple_pay"
                          checked={formData.paymentMethod === 'apple_pay'}
                          onChange={() => setFormData({ ...formData, paymentMethod: 'apple_pay' })}
                          className="accent-black"
                        />
                        <span className="text-xs font-bold text-neutral-900">Apple Pay / Google Pay</span>
                      </div>
                      <span className="text-[11px] font-bold">1-Click</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Right Column: Order Summary */}
              <div className="md:col-span-5 bg-[#FAF9F8] p-6 border border-neutral-200 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-xs font-bold tracking-wider uppercase text-neutral-900 border-b border-neutral-200 pb-2">
                    Order Summary ({items.reduce((s, i) => s + i.quantity, 0)} Items)
                  </h3>

                  <div className="divide-y divide-neutral-200/60 max-h-56 overflow-y-auto my-3">
                    {items.map((item) => (
                      <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-neutral-900 text-xs">
                            {item.quantity}x
                          </span>
                          <div>
                            <p className="font-bold text-neutral-900 line-clamp-1">{item.product.name}</p>
                            <p className="text-[10px] text-neutral-500">{item.selectedColor.name} · {item.selectedSize}</p>
                          </div>
                        </div>
                        <span className="font-semibold tabular-nums text-neutral-900">
                          {formatPrice(item.product.usdPrice * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-neutral-200 pt-3 space-y-2 text-xs">
                    <div className="flex justify-between text-neutral-600">
                      <span>Subtotal</span>
                      <span className="tabular-nums font-semibold">{formatPrice(subtotalUsd)}</span>
                    </div>
                    {discountUsd > 0 && (
                      <div className="flex justify-between text-emerald-700">
                        <span>Discount</span>
                        <span className="tabular-nums">-{formatPrice(discountUsd)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-neutral-600">
                      <span>Shipping</span>
                      <span className="tabular-nums font-semibold">
                        {shippingUsd === 0 ? 'FREE' : formatPrice(shippingUsd)}
                      </span>
                    </div>
                    <div className="border-t border-neutral-200 pt-2 flex justify-between text-sm font-black text-neutral-900">
                      <span>Total Due</span>
                      <span className="tabular-nums">{formatPrice(totalUsd)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting || items.length === 0}
                    className="w-full py-4 bg-black hover:bg-neutral-800 text-white text-xs font-black tracking-widest uppercase transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 hover:scale-[1.005] active:scale-[0.995]"
                  >
                    {isSubmitting ? (
                      <span>PROCESSING YOUR ORDER...</span>
                    ) : (
                      <>
                        <Truck className="w-4 h-4" />
                        <span>CONFIRM & PLACE ORDER (CASH ON DELIVERY)</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-2 text-[10px] text-neutral-500 tracking-wider uppercase text-center">
                    <ShieldCheck className="w-3.5 h-3.5 text-neutral-700 shrink-0" />
                    <span>Cash on Delivery (COD) · Free Delivery above Rs. 8,000 · Dispatched from Karachi</span>
                  </div>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
