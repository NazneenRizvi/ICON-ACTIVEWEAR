import React, { useState } from 'react';
import { X, Star, ShoppingBag, ShieldCheck, Truck, RefreshCw, Check, ArrowRight, MessageCircle } from 'lucide-react';
import { Product, ProductColor, ProductSize } from '../types';
import { useCurrency } from '../context/CurrencyContext';
import { useCart } from '../context/CartContext';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  if (!product) return null;

  const { formatPrice } = useCurrency();
  const { addToCart, ownerWhatsApp } = useCart();

  const [selectedColor, setSelectedColor] = useState<ProductColor>(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState<ProductSize>(product.sizes[1] || 'S');
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdded, setIsAdded] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'details' | 'fabric' | 'shipping'>('details');

  const handleAdd = () => {
    addToCart(product, selectedColor, selectedSize, quantity);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 800);
  };

  const handleOrderOnWhatsApp = () => {
    const cleanPhone = ownerWhatsApp.replace(/[^0-9]/g, '');
    const priceText = formatPrice(product.usdPrice * quantity, product.pkrPrice ? product.pkrPrice * quantity : undefined);
    const msg = encodeURIComponent(
      `*Assalam-o-Alaikum ICON ACTIVEWEAR!*\n\n` +
      `I want to order this item directly:\n` +
      `• *Product:* ${product.name}\n` +
      `• *Color:* ${selectedColor.name}\n` +
      `• *Size:* ${selectedSize}\n` +
      `• *Quantity:* ${quantity}\n` +
      `• *Price:* ${priceText}\n\n` +
      `Please confirm if this is available for Cash on Delivery (COD) in Karachi/Pakistan. Shukriya!`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${msg}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div
        className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-none shadow-2xl border border-neutral-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-neutral-500 hover:text-black bg-neutral-100 hover:bg-neutral-200 transition-colors"
          aria-label="Close product modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
          {/* Left Column: Product Image Gallery */}
          <div className="md:col-span-6 bg-[#f7f7f7] relative flex items-center justify-center p-6">
            <div className="aspect-[3/4] w-full max-w-md relative overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover object-center"
                referrerPolicy="no-referrer"
              />
            </div>
            {product.isNew && (
              <span className="absolute top-4 left-4 bg-black text-white text-[10px] font-bold tracking-widest uppercase px-2.5 py-1">
                NEW RELEASE
              </span>
            )}
          </div>

          {/* Right Column: Contiguous Purchase Module */}
          <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div>
              {/* Category & Title */}
              <div className="text-[11px] font-bold tracking-widest text-neutral-500 uppercase mb-1">
                {product.categoryLabel}
              </div>
              <h2 className="text-xl sm:text-2xl font-black font-display tracking-tight text-neutral-900 uppercase">
                {product.name}
              </h2>

              {/* Price & Rating */}
              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-black tabular-nums text-neutral-900">
                    {formatPrice(product.usdPrice, product.pkrPrice)}
                  </span>
                  {product.originalPriceUsd && (
                    <span className="text-xs tabular-nums text-neutral-400 line-through">
                      {formatPrice(product.originalPriceUsd, product.originalPricePkr)}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-xs text-neutral-600">
                  <div className="flex text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  </div>
                  <span className="font-bold">{product.rating}</span>
                  <span className="text-neutral-400">({product.reviewsCount} reviews)</span>
                </div>
              </div>

              {/* Description */}
              <p className="mt-4 text-xs sm:text-sm text-neutral-600 leading-relaxed">
                {product.description}
              </p>

              {/* Color Swatch Picker */}
              <div className="mt-5">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-bold text-neutral-900 uppercase tracking-wider">
                    Color: <span className="font-normal text-neutral-600">{selectedColor.name}</span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c)}
                      className={`w-6 h-6 rounded-full border transition-all ${
                        selectedColor.name === c.name
                          ? 'ring-2 ring-black ring-offset-2 scale-110'
                          : 'border-neutral-300 hover:scale-105'
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>

              {/* Size Selector */}
              <div className="mt-5">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-bold text-neutral-900 uppercase tracking-wider">Size</span>
                  <span className="text-neutral-500 underline text-[11px] cursor-pointer">
                    Size Guide (True to fit)
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`py-2 text-xs font-bold transition-all border ${
                        selectedSize === s
                          ? 'bg-black text-white border-black'
                          : 'bg-white text-neutral-800 border-neutral-300 hover:border-neutral-900'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Stepper & Add to Bag */}
              <div className="mt-6 flex items-center gap-3">
                <div className="flex items-center border border-neutral-300">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-neutral-600 hover:bg-neutral-100 transition-colors"
                  >
                    -
                  </button>
                  <span className="px-3 py-2 text-xs font-bold tabular-nums min-w-[32px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-neutral-600 hover:bg-neutral-100 transition-colors"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAdd}
                  disabled={isAdded}
                  className="flex-1 bg-black hover:bg-neutral-800 text-white py-3 px-6 text-xs sm:text-sm font-bold tracking-widest uppercase transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>ADDED TO BAG</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>ADD TO BAG · {formatPrice(product.usdPrice * quantity, product.pkrPrice ? product.pkrPrice * quantity : undefined)}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Luxury Concierge & Sizing Help */}
              <div className="mt-3 flex items-center justify-between text-[11px] text-neutral-500 pt-1">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-neutral-800" />
                  Free Karachi & Pakistan Delivery above Rs. 8,000
                </span>
                <button
                  type="button"
                  onClick={handleOrderOnWhatsApp}
                  className="text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1 underline cursor-pointer"
                >
                  <MessageCircle className="w-3 h-3" />
                  <span>Size Help (0311-3270742)</span>
                </button>
              </div>
            </div>

            {/* Spec Details Accordion / Tabs */}
            <div className="border-t border-neutral-200 pt-4">
              <div className="flex items-center gap-4 text-xs font-bold tracking-wider uppercase border-b border-neutral-100 pb-2">
                <button
                  onClick={() => setActiveTab('details')}
                  className={`pb-1 ${activeTab === 'details' ? 'border-b-2 border-black text-black' : 'text-neutral-400'}`}
                >
                  Details
                </button>
                <button
                  onClick={() => setActiveTab('fabric')}
                  className={`pb-1 ${activeTab === 'fabric' ? 'border-b-2 border-black text-black' : 'text-neutral-400'}`}
                >
                  Fabric & Care
                </button>
                <button
                  onClick={() => setActiveTab('shipping')}
                  className={`pb-1 ${activeTab === 'shipping' ? 'border-b-2 border-black text-black' : 'text-neutral-400'}`}
                >
                  Returns & Guarantee
                </button>
              </div>

              <div className="pt-3 text-xs text-neutral-600 min-h-[70px]">
                {activeTab === 'details' && (
                  <ul className="space-y-1.5 list-disc pl-4">
                    {product.details.map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                )}
                {activeTab === 'fabric' && (
                  <div className="space-y-2">
                    <p><span className="font-semibold text-neutral-800">Composition:</span> {product.fabric}</p>
                    <p><span className="font-semibold text-neutral-800">Care:</span> Machine wash cold inside out with like colors. Do not bleach or tumble dry.</p>
                  </div>
                )}
                {activeTab === 'shipping' && (
                  <div className="space-y-2">
                    <p className="flex items-center gap-2"><Truck className="w-3.5 h-3.5 text-neutral-900" /> Express 2-4 day domestic & worldwide shipping available.</p>
                    <p className="flex items-center gap-2"><RefreshCw className="w-3.5 h-3.5 text-neutral-900" /> 30-Day Hassle-Free Returns on orders to US, UK, and Pakistan.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
