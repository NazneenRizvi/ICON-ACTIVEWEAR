import React, { useState } from 'react';
import { Eye, ShoppingBag, Star, Check } from 'lucide-react';
import { Product, ProductColor, ProductSize } from '../types';
import { useCurrency } from '../context/CurrencyContext';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { formatPrice } = useCurrency();
  const { addToCart, setSelectedProductForDetail } = useCart();

  const [selectedColor, setSelectedColor] = useState<ProductColor>(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState<ProductSize>(product.sizes[1] || 'S');
  const [isHovered, setIsHovered] = useState(false);
  const [isQuickAdding, setIsQuickAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsQuickAdding(true);
    addToCart(product, selectedColor, selectedSize, 1);
    setJustAdded(true);
    setTimeout(() => {
      setJustAdded(false);
      setIsQuickAdding(false);
    }, 1500);
  };

  return (
    <div
      className="group relative flex flex-col bg-white border border-neutral-100 hover:border-neutral-300 transition-all duration-300 hover:shadow-md cursor-pointer"
      onClick={() => setSelectedProductForDetail(product)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 1. Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F6F6F6]">
        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1">
          {product.isNew && (
            <span className="bg-black text-white text-[10px] font-bold tracking-widest uppercase px-2 py-0.5">
              NEW
            </span>
          )}
          {product.isBestSeller && !product.isNew && (
            <span className="bg-neutral-800 text-white text-[10px] font-bold tracking-widest uppercase px-2 py-0.5">
              POPULAR
            </span>
          )}
        </div>

        {/* Product Image with smooth crossfade on hover */}
        <img
          src={isHovered && product.hoverImage ? product.hoverImage : product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center transform transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
          loading="lazy"
        />

        {/* Quick Actions Overlay (Visible on Desktop hover) */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-between gap-2 z-20">
          <button
            onClick={handleQuickAdd}
            disabled={isQuickAdding || !product.inStock}
            className="flex-1 bg-white text-black hover:bg-neutral-100 active:scale-95 text-[11px] font-bold tracking-wider uppercase py-2 px-3 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>ADDED!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>QUICK ADD ({selectedSize})</span>
              </>
            )}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedProductForDetail(product);
            }}
            className="bg-black/80 hover:bg-black text-white p-2 transition-colors"
            title="Quick View Details"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Color Swatches Dots matching reference image */}
      <div className="pt-3 pb-1 flex items-center justify-center gap-1.5">
        {product.colors.map((c) => (
          <button
            key={c.name}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedColor(c);
            }}
            title={c.name}
            className={`w-3 h-3 rounded-full border transition-all ${
              selectedColor.name === c.name
                ? 'scale-125 ring-1 ring-black ring-offset-1 border-transparent'
                : 'border-neutral-300 opacity-80 hover:opacity-100'
            }`}
            style={{ backgroundColor: c.hex }}
            aria-label={`Select color ${c.name}`}
          />
        ))}
      </div>

      {/* 3. Product Details */}
      <div className="p-3 text-center flex flex-col items-center flex-grow justify-between">
        <div className="w-full">
          <h3 className="text-xs sm:text-[13px] font-extrabold tracking-wider text-neutral-900 uppercase font-sans line-clamp-1 group-hover:text-neutral-700 transition-colors">
            {product.name}
          </h3>

          {/* Price display with current currency formatting */}
          <div className="mt-1 flex items-center justify-center gap-2">
            <span className="text-xs sm:text-[13px] font-bold tabular-nums text-neutral-900">
              {formatPrice(product.usdPrice, product.pkrPrice)}
            </span>
            {product.originalPriceUsd && (
              <span className="text-[11px] tabular-nums text-neutral-400 line-through">
                {formatPrice(product.originalPriceUsd, product.originalPricePkr)}
              </span>
            )}
          </div>
        </div>

        {/* Rating and Reviews */}
        <div className="mt-2 flex items-center gap-1 text-[11px] text-neutral-500">
          <div className="flex items-center text-amber-500">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          </div>
          <span className="font-semibold text-neutral-700">{product.rating}</span>
          <span className="text-neutral-400">({product.reviewsCount})</span>
        </div>
      </div>
    </div>
  );
};
