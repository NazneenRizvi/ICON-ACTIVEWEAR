import React, { useState } from 'react';
import { Search, ShoppingBag, User as UserIcon, Mail, ChevronDown, Menu, X, Instagram, Facebook, Share2, Package, MessageCircle, Crown } from 'lucide-react';
import { useCurrency, CurrencyCode, CURRENCIES } from '../context/CurrencyContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  onOpenBrandStory?: () => void;
  onNavigateSection?: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenBrandStory, onNavigateSection }) => {
  const { currency, setCurrency, currentCurrencyDetails } = useCurrency();
  const { totalItemsCount, setIsCartOpen, setIsSearchOpen, setIsOwnerOrdersOpen, orders, ownerEmail, ownerWhatsApp } = useCart();
  const { user, isAuthenticated, isOwner, openAuthModal, logout } = useAuth();

  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (sectionId: string) => {
    setIsMobileMenuOpen(false);
    if (onNavigateSection) {
      onNavigateSection(sectionId);
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-neutral-200">
      {/* 1. Top Announcement Bar matching reference */}
      <div className="bg-neutral-950 text-white text-[11px] font-medium tracking-widest text-center py-2 px-4 uppercase border-b border-neutral-900 flex items-center justify-between">
        <div className="hidden sm:block text-[10px] tracking-wider text-neutral-400">
          📍 KARACHI, PAKISTAN
        </div>
        <div className="flex-1 text-center">
          <span className="font-bold text-amber-300">FREE DELIVERY ON ORDERS ABOVE RS. 8,000</span>
          <span className="hidden md:inline text-neutral-400"> · Fast Delivery across Karachi & Pakistan</span>
        </div>
        <div className="hidden sm:block text-[10px] tracking-wider text-neutral-400">
          CASH ON DELIVERY (COD)
        </div>
      </div>

      {/* 2. Upper Utility Bar with Nazneen's details */}
      <div className="border-b border-neutral-100 bg-[#FAF9F8] px-4 sm:px-8 py-1.5 text-xs text-neutral-600 hidden md:flex items-center justify-between">
        <div className="flex items-center gap-4">
          <a
            href={`mailto:${ownerEmail}?subject=ICON%20Activewear%20Inquiry`}
            className="flex items-center gap-1.5 hover:text-black transition-colors font-medium"
            title="Send Email to Nazneen"
          >
            <Mail className="w-3.5 h-3.5 text-neutral-500" />
            <span>{ownerEmail}</span>
          </a>

          <a
            href="https://wa.me/923113270742?text=Assalam-o-Alaikum!%20I%20have%20an%20inquiry%20regarding%20ICON%20Activewear."
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-emerald-700 font-bold hover:underline transition-colors pl-3 border-l border-neutral-200"
            title="Chat with WhatsApp Support"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>Karachi HQ & WhatsApp: 0311-3270742</span>
          </a>
        </div>

        <div className="flex items-center gap-6">
          {/* Currency Switcher */}
          <div className="relative">
            <button
              onClick={() => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)}
              className="flex items-center gap-1 font-semibold text-neutral-800 hover:text-black transition-colors py-0.5 cursor-pointer"
            >
              <span>{currentCurrencyDetails.code}</span>
              <span className="text-neutral-400">({currentCurrencyDetails.symbol})</span>
              <ChevronDown className="w-3 h-3 ml-0.5 text-neutral-500" />
            </button>

            {isCurrencyDropdownOpen && (
              <div className="absolute right-0 mt-1 w-36 bg-white border border-neutral-200 rounded-none shadow-lg z-50 py-1">
                {(Object.keys(CURRENCIES) as CurrencyCode[]).map((code) => (
                  <button
                    key={code}
                    onClick={() => {
                      setCurrency(code);
                      setIsCurrencyDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-neutral-100 transition-colors cursor-pointer ${
                      currency === code ? 'font-bold bg-neutral-50 text-black' : 'text-neutral-700'
                    }`}
                  >
                    <span>{code}</span>
                    <span className="text-neutral-400">{CURRENCIES[code].symbol}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Account / Auth */}
          <div className="relative">
            {isAuthenticated ? (
              <div>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className={`flex items-center gap-1.5 transition-colors font-bold text-xs cursor-pointer ${
                    isOwner ? 'text-black bg-amber-50 border border-amber-300 px-2 py-0.5' : 'hover:text-black text-neutral-800'
                  }`}
                >
                  {isOwner ? (
                    <Crown className="w-3.5 h-3.5 text-amber-600" />
                  ) : (
                    <UserIcon className="w-3.5 h-3.5" />
                  )}
                  <span className="truncate max-w-[130px]">
                    {isOwner ? '👑 Nazneen (Owner)' : `Hi, ${user?.name.split(' ')[0]}`}
                  </span>
                  <ChevronDown className="w-3 h-3" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-1 w-52 bg-white border border-neutral-200 shadow-xl z-50 py-1 text-left">
                    <div className={`px-3 py-2 border-b border-neutral-100 ${isOwner ? 'bg-neutral-900 text-white' : 'bg-neutral-50'}`}>
                      <div className="flex items-center gap-1">
                        {isOwner && <Crown className="w-3 h-3 text-amber-400" />}
                        <p className={`font-bold text-xs truncate ${isOwner ? 'text-white' : 'text-neutral-900'}`}>{user?.name}</p>
                      </div>
                      <p className={`text-[10px] truncate ${isOwner ? 'text-neutral-400' : 'text-neutral-500'}`}>{user?.email}</p>
                    </div>

                    {isOwner && (
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          setIsOwnerOrdersOpen(true);
                        }}
                        className="w-full text-left px-3 py-2.5 text-xs font-black text-white bg-black hover:bg-neutral-800 transition-colors flex items-center justify-between cursor-pointer border-b border-neutral-200"
                      >
                        <span className="flex items-center gap-1.5">
                          <Package className="w-3.5 h-3.5 text-amber-400" />
                          <span>ORDERS DASHBOARD</span>
                        </span>
                        <span className="bg-amber-400 text-black text-[10px] font-black px-1.5 py-0.2 rounded-full">
                          {orders.length}
                        </span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        logout();
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => openAuthModal('login')}
                className="hover:text-black transition-colors font-medium flex items-center gap-1 cursor-pointer"
              >
                <span>My Account</span>
              </button>
            )}
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-3 pl-3 border-l border-neutral-200 text-neutral-500">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-neutral-900 transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-neutral-900 transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://pinterest.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-neutral-900 transition-colors"
              aria-label="Pinterest"
            >
              <Share2 className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* 3. Main Brand Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between">
        {/* Mobile menu hamburger */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-1.5 text-neutral-800 hover:text-black"
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Brand Logo: ICON ACTIVEWEAR */}
        <a
          href="#"
          className="text-xl sm:text-2xl font-black tracking-widest font-display text-neutral-900 uppercase flex items-center gap-2"
        >
          <span>ICON ACTIVEWEAR</span>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-[13px] font-bold tracking-wider uppercase text-neutral-800">
          <button
            onClick={() => handleNavClick('shop-seamless')}
            className="hover:text-black relative py-1 transition-colors group"
          >
            SHOP
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-200 group-hover:w-full"></span>
          </button>
          <button
            onClick={() => {
              if (onOpenBrandStory) {
                onOpenBrandStory();
              } else {
                handleNavClick('brand-story');
              }
            }}
            className="hover:text-black relative py-1 transition-colors group"
          >
            OUR BRAND
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-200 group-hover:w-full"></span>
          </button>
          <button
            onClick={() => handleNavClick('reviews-section')}
            className="hover:text-black relative py-1 transition-colors group"
          >
            REVIEWS
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-200 group-hover:w-full"></span>
          </button>
          <button
            onClick={() => handleNavClick('community-guarantee')}
            className="hover:text-black relative py-1 transition-colors group"
          >
            COMMUNITY
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-200 group-hover:w-full"></span>
          </button>
        </nav>

        {/* Right Action Icons: Search & Cart */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="p-1.5 text-neutral-700 hover:text-black transition-colors"
            aria-label="Search activewear"
          >
            <Search className="w-5 h-5" />
          </button>

          <button
            onClick={() => {
              if (isAuthenticated) {
                setIsUserMenuOpen(!isUserMenuOpen);
              } else {
                openAuthModal('login');
              }
            }}
            className="p-1.5 text-neutral-700 hover:text-black transition-colors md:hidden"
            aria-label="User account"
          >
            <UserIcon className="w-5 h-5" />
          </button>

          {/* Cart Bag Icon with dynamic counter badge */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="p-1.5 text-neutral-800 hover:text-black transition-colors relative flex items-center"
            aria-label="Shopping bag"
          >
            <ShoppingBag className="w-5 h-5" />
            {totalItemsCount > 0 && (
              <span className="absolute -top-1 -right-1.5 bg-black text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-scale-in">
                {totalItemsCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-200 bg-white px-6 py-6 space-y-4">
          <div className="flex flex-col space-y-3 text-sm font-bold tracking-wider uppercase text-neutral-900">
            <button
              onClick={() => handleNavClick('shop-seamless')}
              className="text-left py-2 border-b border-neutral-100"
            >
              Shop Seamless
            </button>
            <button
              onClick={() => handleNavClick('shop-low-impact')}
              className="text-left py-2 border-b border-neutral-100"
            >
              Shop Sports Bras
            </button>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                if (onOpenBrandStory) onOpenBrandStory();
              }}
              className="text-left py-2 border-b border-neutral-100"
            >
              Our Brand
            </button>
            <button
              onClick={() => handleNavClick('reviews-section')}
              className="text-left py-2 border-b border-neutral-100"
            >
              Reviews
            </button>

            {/* Mobile Account / Owner Dashboard Action */}
            {isAuthenticated ? (
              <div className="pt-2 border-b border-neutral-100 pb-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-neutral-500 font-medium">
                    {isOwner ? '👑 Nazneen (Store Owner)' : `Hi, ${user?.name}`}
                  </span>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      logout();
                    }}
                    className="text-xs text-red-600 font-bold underline"
                  >
                    Sign Out
                  </button>
                </div>
                {isOwner && (
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsOwnerOrdersOpen(true);
                    }}
                    className="mt-2 w-full py-2.5 bg-black text-amber-300 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 border border-neutral-800"
                  >
                    <Package className="w-4 h-4 text-amber-400" />
                    <span>OPEN ORDERS DASHBOARD ({orders.length})</span>
                  </button>
                )}
              </div>
            ) : (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  openAuthModal('login');
                }}
                className="text-left py-2 border-b border-neutral-100 flex items-center gap-1.5"
              >
                <UserIcon className="w-4 h-4" />
                <span>My Account / Login</span>
              </button>
            )}
          </div>

          {/* Direct Support links on Mobile */}
          <div className="pt-2 space-y-2 text-xs">
            <a
              href="https://wa.me/923113270742?text=Assalam-o-Alaikum!%20I%20have%20an%20inquiry%20regarding%20ICON%20Activewear."
              target="_blank"
              rel="noreferrer"
              className="w-full py-2 px-3 bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>WhatsApp: 0311-3270742</span>
            </a>
            <a
              href={`mailto:${ownerEmail}?subject=ICON%20Activewear%20Inquiry`}
              className="w-full py-2 px-3 bg-neutral-50 text-neutral-700 border border-neutral-200 font-medium flex items-center gap-2"
            >
              <Mail className="w-4 h-4 text-neutral-500" />
              <span>{ownerEmail}</span>
            </a>
          </div>

          {/* Currency selection on mobile */}
          <div className="pt-2 border-t border-neutral-200">
            <p className="text-xs text-neutral-500 uppercase tracking-wider mb-2">Currency</p>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(CURRENCIES) as CurrencyCode[]).map((code) => (
                <button
                  key={code}
                  onClick={() => setCurrency(code)}
                  className={`px-2 py-1.5 text-xs text-center border ${
                    currency === code
                      ? 'border-black bg-black text-white font-bold'
                      : 'border-neutral-300 text-neutral-700'
                  }`}
                >
                  {code} ({CURRENCIES[code].symbol})
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
