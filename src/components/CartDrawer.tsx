import React from 'react';
import { Link } from 'react-router-dom';
import { X, ShoppingBag, Trash2, ShieldCheck, Truck, ArrowRight } from 'lucide-react';
import { useStore } from '@/context/StoreContext';

export const CartDrawer: React.FC = () => {
  const { isCartOpen, closeCart, cart, removeFromCart, updateQuantity, cartTotal, formatPrice } = useStore();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="absolute inset-0 bg-ink-950/80 backdrop-blur-md transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-ink-950 border-l border-white/10 text-ink-50 shadow-2xl flex flex-col justify-between p-6 sm:p-8 relative z-10 fade-up">
          
          {/* Header */}
          <div>
            <div className="flex items-center justify-between pb-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400">
                  <ShoppingBag size={18} />
                </div>
                <div>
                  <h3 className="font-display text-2xl text-ink-50 font-light">Collector Bag</h3>
                  <p className="text-[10px] uppercase tracking-widest text-ink-300 font-mono">
                    {cart.length} item{cart.length !== 1 ? 's' : ''} selected
                  </p>
                </div>
              </div>

              <button
                onClick={closeCart}
                className="w-9 h-9 rounded-full bg-ink-900 border border-white/10 flex items-center justify-center text-ink-200 hover:text-gold-300 hover:border-gold-500/40 transition-colors"
                aria-label="Close cart"
              >
                <X size={18} />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="mt-6 space-y-4 max-h-[50vh] overflow-y-auto pr-1">
              {cart.length === 0 ? (
                <div className="text-center py-16 glass-panel rounded-xl border border-white/10">
                  <ShoppingBag size={32} className="mx-auto text-ink-300 mb-3" />
                  <p className="text-ink-200 font-light">Your collector bag is currently empty.</p>
                  <Link
                    to="/gallery"
                    onClick={closeCart}
                    className="mt-4 inline-block btn-outline-gold !py-2 !px-4 !text-[10px] rounded-sm"
                  >
                    Explore Catalogue
                  </Link>
                </div>
              ) : (
                cart.map(({ piece, quantity }) => (
                  <div
                    key={piece.id}
                    className="glass-panel p-4 rounded-xl border border-white/10 flex gap-4 items-center justify-between"
                  >
                    <div className="w-16 h-16 rounded-lg overflow-hidden border border-white/10 bg-ink-900 shrink-0">
                      <img
                        src={piece.image_url}
                        alt={piece.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-display text-base text-ink-50 font-medium truncate">
                        {piece.title}
                      </h4>
                      <p className="text-xs gold-text-gradient truncate font-sans">
                        {piece.artist}
                      </p>
                      <p className="text-xs font-display text-gold-400 font-semibold mt-1">
                        {formatPrice(piece.price)}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex flex-col items-end gap-2">
                      <button
                        onClick={() => removeFromCart(piece.id)}
                        className="text-ink-300 hover:text-red-400 transition-colors p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 size={15} />
                      </button>

                      <div className="flex items-center border border-white/10 rounded bg-ink-900 text-xs">
                        <button
                          onClick={() => updateQuantity(piece.id, -1)}
                          className="px-2 py-0.5 text-ink-200 hover:text-gold-300"
                        >
                          -
                        </button>
                        <span className="px-2 font-mono text-ink-100">{quantity}</span>
                        <button
                          onClick={() => updateQuantity(piece.id, 1)}
                          className="px-2 py-0.5 text-ink-200 hover:text-gold-300"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Footer & Checkout CTA */}
          {cart.length > 0 && (
            <div className="border-t border-white/10 pt-6 space-y-4">
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between text-ink-200">
                  <span>Subtotal</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-ink-200">
                  <span>Insured Shipping</span>
                  <span className="text-gold-400">Complimentary</span>
                </div>
                <div className="flex justify-between text-sm font-display text-ink-50 font-semibold pt-2 border-t border-white/5">
                  <span>Total</span>
                  <span className="gold-text-gradient text-lg">{formatPrice(cartTotal)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px] text-ink-300 pt-2 border-t border-white/5">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-gold-400 shrink-0" />
                  <span>Certificate Included</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Truck size={14} className="text-gold-400 shrink-0" />
                  <span>Insured Transit</span>
                </div>
              </div>

              <Link
                to="/contact?inquire=checkout"
                onClick={closeCart}
                className="btn-gold rounded-sm w-full group flex items-center justify-center gap-3 !py-4 shadow-xl"
              >
                <span>Proceed to Acquisition</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
