import React, { useState, useMemo } from 'react';
import { CurrencyProvider } from './context/CurrencyContext';
import { CartProvider, useCart } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { CampaignBanner } from './components/CampaignBanner';
import { SplitPromoBanner } from './components/SplitPromoBanner';
import { ReviewsSection } from './components/ReviewsSection';
import { Footer } from './components/Footer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { SearchModal } from './components/SearchModal';
import { AuthModal } from './components/AuthModal';
import { BrandStoryModal } from './components/BrandStoryModal';
import { AdminOrdersModal } from './components/AdminOrdersModal';
import { PRODUCTS } from './data/products';
import { ProductCategory, Product } from './types';
import { SlidersHorizontal, ArrowUpDown, Package } from 'lucide-react';

function Storefront() {
  const { selectedProductForDetail, setSelectedProductForDetail, orders, setIsOwnerOrdersOpen } = useCart();
  const [activeCategory, setActiveCategory] = useState<ProductCategory>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [isBrandStoryOpen, setIsBrandStoryOpen] = useState(false);

  // Filtered and sorted products
  const seamlessProducts = useMemo(() => {
    return PRODUCTS.filter((p) => p.category === 'seamless-leggings');
  }, []);

  const lowImpactProducts = useMemo(() => {
    return PRODUCTS.filter((p) => p.category === 'sports-bras');
  }, []);

  const bottomsAndMustHaves = useMemo(() => {
    return PRODUCTS.filter((p) => p.category === 'bottoms' || p.category === 'must-haves');
  }, []);

  // Filtered list when user activates specific tab in filter bar
  const displayedCategoryProducts = useMemo(() => {
    let list = PRODUCTS;
    if (activeCategory !== 'all') {
      list = list.filter((p) => p.category === activeCategory);
    }

    const sorted = [...list];
    if (sortBy === 'price-asc') {
      sorted.sort((a, b) => a.usdPrice - b.usdPrice);
    } else if (sortBy === 'price-desc') {
      sorted.sort((a, b) => b.usdPrice - a.usdPrice);
    } else if (sortBy === 'rating') {
      sorted.sort((a, b) => b.rating - a.rating);
    }
    return sorted;
  }, [activeCategory, sortBy]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-neutral-900">
      {/* 1. Global Navigation */}
      <Navbar
        onOpenBrandStory={() => setIsBrandStoryOpen(true)}
        onNavigateSection={scrollToSection}
      />

      <main className="flex-grow">
        {/* 2. Top Hero matching reference image */}
        <Hero onShopClick={() => scrollToSection('shop-seamless')} />

        {/* Category Filter Toolbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 pb-2 flex flex-wrap items-center justify-between gap-4 border-b border-neutral-200">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                activeCategory === 'all'
                  ? 'bg-black text-white'
                  : 'bg-white border border-neutral-200 text-neutral-700 hover:border-black'
              }`}
            >
              All Drops
            </button>
            <button
              onClick={() => setActiveCategory('seamless-leggings')}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                activeCategory === 'seamless-leggings'
                  ? 'bg-black text-white'
                  : 'bg-white border border-neutral-200 text-neutral-700 hover:border-black'
              }`}
            >
              Seamless Leggings
            </button>
            <button
              onClick={() => setActiveCategory('sports-bras')}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                activeCategory === 'sports-bras'
                  ? 'bg-black text-white'
                  : 'bg-white border border-neutral-200 text-neutral-700 hover:border-black'
              }`}
            >
              Sports Bras
            </button>
            <button
              onClick={() => setActiveCategory('bottoms')}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                activeCategory === 'bottoms'
                  ? 'bg-black text-white'
                  : 'bg-white border border-neutral-200 text-neutral-700 hover:border-black'
              }`}
            >
              Bottoms & Shorts
            </button>
            <button
              onClick={() => setActiveCategory('must-haves')}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                activeCategory === 'must-haves'
                  ? 'bg-black text-white'
                  : 'bg-white border border-neutral-200 text-neutral-700 hover:border-black'
              }`}
            >
              Must Haves
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-neutral-500 flex items-center gap-1">
              <ArrowUpDown className="w-3 h-3" /> Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-neutral-300 px-2.5 py-1.5 text-xs font-semibold focus:outline-hidden focus:border-black cursor-pointer"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {/* If user selected a specific filter tab other than 'all', show the filtered gallery */}
        {activeCategory !== 'all' ? (
          <section className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
            <div className="mb-6">
              <h2 className="text-xl sm:text-2xl font-black font-display tracking-tight text-neutral-900 uppercase">
                {activeCategory === 'seamless-leggings' && 'SHOP SEAMLESS LEGGINGS'}
                {activeCategory === 'sports-bras' && 'SHOP LOW IMPACT SPORTS BRAS'}
                {activeCategory === 'bottoms' && 'SHOP ATHLETIC BOTTOMS'}
                {activeCategory === 'must-haves' && 'SHOP MUST HAVES'}
              </h2>
              <p className="text-xs text-neutral-500 mt-1">
                Showing {displayedCategoryProducts.length} items
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {displayedCategoryProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        ) : (
          /* Default Layout Exactly Matching The Reference Image */
          <>
            {/* 3. Section: SHOP SEAMLESS */}
            <section id="shop-seamless" className="max-w-7xl mx-auto px-4 sm:px-8 py-10 sm:py-12">
              <div className="mb-6">
                <h2 className="text-lg sm:text-xl font-black font-display tracking-wider text-neutral-900 uppercase">
                  SHOP SEAMLESS
                </h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                {seamlessProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>

            {/* 4. Campaign Banner: BRING THE GYM TO YOU. */}
            <CampaignBanner onShopClick={() => scrollToSection('shop-low-impact')} />

            {/* 5. Section: SHOP LOW IMPACT */}
            <section id="shop-low-impact" className="max-w-7xl mx-auto px-4 sm:px-8 py-10 sm:py-12">
              <div className="mb-6">
                <h2 className="text-lg sm:text-xl font-black font-display tracking-wider text-neutral-900 uppercase">
                  SHOP LOW IMPACT
                </h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                {lowImpactProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>

            {/* 6. Split Banners: SHOP BOTTOMS & SHOP MUST HAVES */}
            <SplitPromoBanner
              onCategorySelect={(cat) => {
                setActiveCategory(cat as ProductCategory);
                window.scrollTo({ top: 350, behavior: 'smooth' });
              }}
            />
          </>
        )}

        {/* 7. Community Reviews & Social Proof */}
        <ReviewsSection />
      </main>

      {/* 8. Comprehensive Footer */}
      <Footer
        onCategoryClick={(cat) => {
          setActiveCategory(cat as ProductCategory);
          window.scrollTo({ top: 350, behavior: 'smooth' });
        }}
        onOpenBrandStory={() => setIsBrandStoryOpen(true)}
      />

      {/* Modals & Overlays */}
      <ProductDetailModal
        product={selectedProductForDetail}
        onClose={() => setSelectedProductForDetail(null)}
      />
      <CartDrawer />
      <CheckoutModal />
      <SearchModal />
      <AuthModal />
      <BrandStoryModal
        isOpen={isBrandStoryOpen}
        onClose={() => setIsBrandStoryOpen(false)}
      />
      <AdminOrdersModal />
    </div>
  );
}

export default function App() {
  return (
    <CurrencyProvider>
      <AuthProvider>
        <CartProvider>
          <Storefront />
        </CartProvider>
      </AuthProvider>
    </CurrencyProvider>
  );
}
