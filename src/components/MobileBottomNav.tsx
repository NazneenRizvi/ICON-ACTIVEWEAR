import React from 'react';
import { Home, Sparkles, Search, Heart, ShoppingBag, User as UserIcon } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

interface MobileBottomNavProps {
  onNavigateSection?: (sectionId: string) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ onNavigateSection }) => {
  const {
    totalItemsCount,
    setIsCartOpen,
    setIsSearchOpen,
    wishlist,
    setIsWishlistOpen,
    setIsCustomerOrdersOpen
  } = useCart();

  const { isAuthenticated, openAuthModal } = useAuth();

  const handleHomeClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShopClick = () => {
    if (onNavigateSection) {
      onNavigateSection('catalog-section');
    } else {
      const el = document.getElementById('catalog-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAccountClick = () => {
    if (!isAuthenticated) {
      openAuthModal('login');
    } else {
      setIsCustomerOrdersOpen(true);
    }
  };

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-neutral-200 px-2 py-1.5 shadow-[0_-4px_12px_rgba(0,0,0,0.06)] pb-[max(env(safe-area-inset-bottom),0.5rem)]"
    >
      <div className="grid grid-cols-6 items-center text-center">
        {/* 1. Home */}
        <button
          onClick={handleHomeClick}
          className="flex flex-col items-center justify-center py-1 text-neutral-600 hover:text-black active:scale-95 transition-all cursor-pointer"
          aria-label="Home"
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-bold tracking-tight uppercase mt-0.5">Home</span>
        </button>

        {/* 2. Shop Drops */}
        <button
          onClick={handleShopClick}
          className="flex flex-col items-center justify-center py-1 text-neutral-600 hover:text-black active:scale-95 transition-all cursor-pointer"
          aria-label="Shop Drops"
        >
          <Sparkles className="w-5 h-5 text-amber-500" />
          <span className="text-[10px] font-bold tracking-tight uppercase mt-0.5">Shop</span>
        </button>

        {/* 3. Search */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex flex-col items-center justify-center py-1 text-neutral-600 hover:text-black active:scale-95 transition-all cursor-pointer"
          aria-label="Search activewear"
        >
          <Search className="w-5 h-5" />
          <span className="text-[10px] font-bold tracking-tight uppercase mt-0.5">Search</span>
        </button>

        {/* 4. Wishlist */}
        <button
          onClick={() => setIsWishlistOpen(true)}
          className="relative flex flex-col items-center justify-center py-1 text-neutral-600 hover:text-black active:scale-95 transition-all cursor-pointer"
          aria-label="Wishlist"
        >
          <div className="relative">
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-2 bg-red-600 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold tracking-tight uppercase mt-0.5">Saved</span>
        </button>

        {/* 5. Cart / Bag */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="relative flex flex-col items-center justify-center py-1 text-neutral-600 hover:text-black active:scale-95 transition-all cursor-pointer"
          aria-label="Cart Bag"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {totalItemsCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-black text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-scale-in">
                {totalItemsCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold tracking-tight uppercase mt-0.5">Bag</span>
        </button>

        {/* 6. Account */}
        <button
          onClick={handleAccountClick}
          className="flex flex-col items-center justify-center py-1 text-neutral-600 hover:text-black active:scale-95 transition-all cursor-pointer"
          aria-label={isAuthenticated ? 'My Orders' : 'Sign In'}
        >
          <UserIcon className="w-5 h-5" />
          <span className="text-[10px] font-bold tracking-tight uppercase mt-0.5 truncate max-w-[50px]">
            {isAuthenticated ? 'Orders' : 'Account'}
          </span>
        </button>
      </div>
    </nav>
  );
};
