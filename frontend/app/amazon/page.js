"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, ShoppingCart, ChevronDown, Sparkles, Trash2, Plus, Minus, CheckCircle } from "lucide-react";
import { savePurchase } from "../services/api";
import { supabase } from "../lib/supabase";

export default function AmazonCartPage() {
  const router = useRouter();
  const [showAzoraTooltip, setShowAzoraTooltip] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [checkedItems, setCheckedItems] = useState({});

  useEffect(() => {
    const saved = localStorage.getItem("selectedBundle");
    if (saved) {
      const bundle = JSON.parse(saved);
      const products = bundle.products || [];
      setCartItems(products);
      // Initialize all quantities to 1 and all items checked
      const initialQty = {};
      const initialChecked = {};
      products.forEach((p) => { 
        initialQty[p.id] = 1; 
        initialChecked[p.id] = true;
      });
      setQuantities(initialQty);
      setCheckedItems(initialChecked);
    }
  }, []);

  const checkedCartItems = cartItems.filter((item) => checkedItems[item.id]);
  const cartCount = cartItems.length;
  const subtotal = checkedCartItems.reduce((sum, item) => sum + item.price * (quantities[item.id] || 1), 0);
  const checkedCount = checkedCartItems.length;

  const handleToggleCheck = (productId) => {
    setCheckedItems((prev) => ({ ...prev, [productId]: !prev[productId] }));
  };

  const handleDeselectAll = () => {
    const updated = {};
    cartItems.forEach((p) => { updated[p.id] = false; });
    setCheckedItems(updated);
  };

  const handleSelectAll = () => {
    const updated = {};
    cartItems.forEach((p) => { updated[p.id] = true; });
    setCheckedItems(updated);
  };

  const handleRemove = (productId) => {
    setCartItems((prev) => prev.filter((p) => p.id !== productId));
    setQuantities((prev) => {
      const updated = { ...prev };
      delete updated[productId];
      return updated;
    });
    setCheckedItems((prev) => {
      const updated = { ...prev };
      delete updated[productId];
      return updated;
    });
  };

  const handleQuantityChange = (productId, newQty) => {
    if (newQty < 1) return;
    setQuantities((prev) => ({ ...prev, [productId]: newQty }));
  };

  const handleProceedToBuy = async () => {
    if (checkedCount === 0) return;
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const mission = localStorage.getItem("currentMission") || null;
        // Only save checked items as purchases
        for (const product of checkedCartItems) {
          await savePurchase(session.user.id, product, mission);
        }
      }
    } catch (err) {
      console.warn("Failed to save purchase history:", err);
    }

    alert(`Order placed for ${checkedCount} item${checkedCount !== 1 ? "s" : ""}! Total: ₹${subtotal.toLocaleString()}`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#EAEDED] flex flex-col overflow-y-auto">
      {/* Amazon Top Navbar */}
      <header className="bg-[#131921] text-white sticky top-0 z-50">
        <div className="flex items-center px-3 md:px-6 py-2 gap-2 md:gap-4">
          {/* Amazon Logo */}
          <div className="flex-shrink-0 cursor-pointer px-1 md:px-2 py-1 border border-transparent hover:border-white rounded">
            <div className="flex items-baseline">
              <span className="text-2xl md:text-3xl font-bold text-white tracking-tight">amazon</span>
              <span className="text-[10px] text-gray-300 ml-0.5">.in</span>
            </div>
            <div className="h-[3px] w-full bg-[#FF9900] rounded-full mt-[-2px]" style={{clipPath: "ellipse(40% 100% at 50% 0%)"}}></div>
          </div>

          {/* Delivery Location */}
          <div className="hidden md:flex items-center gap-1 cursor-pointer px-2 py-1 border border-transparent hover:border-white rounded text-sm">
            <MapPin size={18} className="text-white" />
            <div className="flex flex-col">
              <span className="text-xs text-gray-300">Delivering to Hyderabad 500001</span>
              <span className="text-sm font-bold">Update location</span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 flex items-center">
            <div className="flex w-full rounded-md overflow-hidden">
              <select className="bg-[#E6E6E6] text-[#555] text-xs px-2 border-r border-gray-300 hidden md:block">
                <option>All</option>
              </select>
              <input
                type="text"
                placeholder="Search Amazon.in"
                className="flex-1 px-4 py-2 text-black text-sm outline-none"
              />
              <button className="bg-[#FEBD69] hover:bg-[#F3A847] px-4">
                <Search size={20} className="text-[#131921]" />
              </button>
            </div>
          </div>

          {/* Right side nav items */}
          <div className="flex items-center gap-1 md:gap-3">
            {/* Language */}
            <div className="hidden lg:flex items-center gap-1 cursor-pointer px-2 py-1 border border-transparent hover:border-white rounded">
              <span className="text-sm">🇮🇳</span>
              <span className="text-sm font-bold">EN</span>
              <ChevronDown size={12} className="text-gray-400" />
            </div>

            {/* Account */}
            <div className="hidden md:flex flex-col cursor-pointer px-2 py-1 border border-transparent hover:border-white rounded">
              <span className="text-xs text-gray-300">Hello, User</span>
              <span className="text-sm font-bold flex items-center gap-0.5">Account & Lists <ChevronDown size={12} /></span>
            </div>

            {/* Returns */}
            <div className="hidden md:flex flex-col cursor-pointer px-2 py-1 border border-transparent hover:border-white rounded">
              <span className="text-xs text-gray-300">Returns</span>
              <span className="text-sm font-bold">& Orders</span>
            </div>

            {/* Azora Icon */}
            <div 
              className="relative"
              onMouseEnter={() => setShowAzoraTooltip(true)}
              onMouseLeave={() => setShowAzoraTooltip(false)}
            >
              <button
                onClick={() => router.push("/azora")}
                className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-[#00A8E1] to-[#0077B6] hover:from-[#00B4F0] hover:to-[#0089CC] transition-all border-2 border-transparent hover:border-white shadow-lg"
                title="Azora"
              >
                <Sparkles size={18} className="text-white" />
              </button>
              {showAzoraTooltip && (
                <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-white text-[#131921] text-xs font-bold px-3 py-1.5 rounded shadow-lg whitespace-nowrap z-50 border">
                  Azora
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white border-l border-t rotate-45"></div>
                </div>
              )}
            </div>

            {/* Cart */}
            <div className="flex items-end cursor-pointer px-2 py-1 border border-transparent hover:border-white rounded">
              <div className="relative">
                <ShoppingCart size={30} className="text-white" />
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[#FF9900] font-bold text-base leading-none">
                  {cartCount}
                </span>
              </div>
              <span className="text-sm font-bold ml-0.5 hidden md:inline">Cart</span>
            </div>
          </div>
        </div>

        {/* Sub Navbar */}
        <div className="bg-[#232F3E] flex items-center px-4 py-1.5 gap-4 text-sm overflow-x-auto whitespace-nowrap">
          <span className="flex items-center gap-1 cursor-pointer hover:text-[#FF9900]">☰ All</span>
          <span className="cursor-pointer hover:text-[#FF9900] bg-[#1A252F] px-2 py-0.5 rounded text-[#FF9900] font-bold text-xs">⚡ Rufus</span>
          <span className="cursor-pointer hover:text-[#FF9900]">Fresh</span>
          <span className="cursor-pointer hover:text-[#FF9900]">MX Player</span>
          <span className="cursor-pointer hover:text-[#FF9900]">Sell</span>
          <span className="cursor-pointer hover:text-[#FF9900]">Amazon Pay</span>
          <span className="cursor-pointer hover:text-[#FF9900]">Keep Shopping for</span>
          <span className="cursor-pointer hover:text-[#FF9900]">Today&apos;s Deals</span>
          <span className="cursor-pointer hover:text-[#FF9900]">Bestsellers</span>
          <span className="cursor-pointer hover:text-[#FF9900]">Buy Again</span>
          <span className="cursor-pointer hover:text-[#FF9900]">Prime</span>
          <span className="cursor-pointer hover:text-[#FF9900]">Mobiles</span>
          <span className="cursor-pointer hover:text-[#FF9900]">Gift Cards</span>
          <span className="cursor-pointer hover:text-[#FF9900]">Customer Service</span>
        </div>
      </header>

      {/* Cart Content */}
      <div className="max-w-[1200px] mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6 flex-1">
        
        {/* Left - Cart Items */}
        <div className="flex-1">
          <div className="bg-white p-6 rounded shadow-sm">
            <h1 className="text-2xl md:text-3xl font-bold text-[#131921] mb-1">Shopping Cart</h1>
            <button onClick={checkedCount === cartItems.length ? handleDeselectAll : handleSelectAll} className="text-sm text-[#007185] hover:text-[#C7511F] hover:underline bg-transparent border-none cursor-pointer">
              {checkedCount === cartItems.length ? "Deselect all items" : "Select all items"}
            </button>
            
            <div className="border-b border-gray-200 mt-4 mb-2"></div>
            <div className="text-right text-sm text-gray-500 mb-2">Price</div>

            {/* Cart Items */}
            {cartItems.length === 0 ? (
              <div className="py-8 text-center text-gray-500">
                <p className="text-lg">Your cart is empty.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {cartItems.map((product) => {
                  const imageUrl = product.imageUrl || product.image_url || "https://via.placeholder.com/150";
                  const seller = product.seller || product.brand || "Amazon";
                  const name = product.name;
                  const price = product.price;
                  const qty = quantities[product.id] || 1;

                  return (
                    <div key={product.id} className="flex gap-4 py-5">
                      {/* Checkbox */}
                      <div className="flex items-start pt-2">
                        <input 
                          type="checkbox" 
                          checked={checkedItems[product.id] || false} 
                          onChange={() => handleToggleCheck(product.id)}
                          className="w-5 h-5 accent-[#008296] cursor-pointer" 
                        />
                      </div>

                      {/* Product Image */}
                      <div className="w-28 h-28 md:w-36 md:h-36 flex-shrink-0 bg-white flex items-center justify-center">
                        <img src={imageUrl} alt={name} className="max-w-full max-h-full object-contain" />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 flex flex-col">
                        <h3 className="text-base md:text-lg font-medium text-[#131921] leading-tight mb-1 line-clamp-2">{name}</h3>
                        <span className="text-xs text-green-700 font-medium mb-1">In stock</span>
                        <span className="text-xs text-gray-500 mb-1">FREE delivery <span className="font-bold text-[#131921]">Tomorrow, {new Date(Date.now() + 86400000).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span></span>
                        <div className="flex items-center gap-1 mb-2">
                          <span className="bg-[#232F3E] text-white text-[10px] px-1.5 py-0.5 rounded font-bold">Fulfilled</span>
                        </div>
                        <span className="text-xs text-gray-600 mb-2">Seller: <span className="text-[#007185]">{seller}</span></span>

                        {/* Quantity + Actions */}
                        <div className="flex items-center gap-3 flex-wrap">
                          <div className="flex items-center border border-[#D5D9D9] rounded-lg shadow-sm overflow-hidden">
                            <button 
                              onClick={() => handleQuantityChange(product.id, qty - 1)}
                              className="px-2.5 py-1.5 bg-[#F0F2F2] hover:bg-[#E3E6E6] border-r border-[#D5D9D9]"
                            >
                              <Minus size={14} className="text-[#131921]" />
                            </button>
                            <span className="px-4 py-1.5 text-sm font-medium text-[#131921] bg-white min-w-[40px] text-center">{qty}</span>
                            <button 
                              onClick={() => handleQuantityChange(product.id, qty + 1)}
                              className="px-2.5 py-1.5 bg-[#F0F2F2] hover:bg-[#E3E6E6] border-l border-[#D5D9D9]"
                            >
                              <Plus size={14} className="text-[#131921]" />
                            </button>
                          </div>
                          <span className="text-gray-300">|</span>
                          <button onClick={() => handleRemove(product.id)} className="text-sm text-[#007185] hover:text-[#C7511F] hover:underline">Delete</button>
                          <span className="text-gray-300">|</span>
                          <button className="text-sm text-[#007185] hover:text-[#C7511F] hover:underline">Save for later</button>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="text-right flex-shrink-0">
                        <span className="text-lg font-bold text-[#131921]">₹{(price * qty).toLocaleString()}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Subtotal */}
            {cartItems.length > 0 && (
              <div className="text-right pt-4 border-t border-gray-200 mt-2">
                <span className="text-lg text-[#131921]">
                  Subtotal ({checkedCount} item{checkedCount !== 1 ? "s" : ""}): 
                  <span className="font-bold"> ₹{subtotal.toLocaleString()}</span>
                </span>
              </div>
            )}
          </div>

          {/* Your Items section */}
          <div className="bg-white p-6 rounded shadow-sm mt-6">
            <h2 className="text-xl font-bold text-[#131921] mb-3">Your Items</h2>
            <div className="flex gap-4 border-b border-gray-200 mb-4">
              <button className="text-sm text-gray-500 pb-2">No items saved for later</button>
              <button className="text-sm text-[#007185] font-medium pb-2 border-b-2 border-[#007185]">Buy it again</button>
            </div>
            <p className="text-sm text-gray-500">No items</p>
          </div>
        </div>

        {/* Right - Checkout Sidebar */}
        <div className="w-full lg:w-80 flex-shrink-0">
          <div className="bg-white p-5 rounded shadow-sm sticky top-[120px]">
            {/* Free delivery message */}
            <div className="flex items-start gap-2 mb-4">
              <CheckCircle size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-700">
                Your order is eligible for <span className="font-bold">FREE Delivery</span>. 
                <span className="text-gray-500"> Choose FREE Delivery option at checkout.</span>
              </p>
            </div>

            {/* Subtotal */}
            <p className="text-base text-[#131921] mb-4">
              Subtotal ({checkedCount} item{checkedCount !== 1 ? "s" : ""}): 
              <span className="font-bold"> ₹{subtotal.toLocaleString()}</span>
            </p>

            {/* Gift option */}
            <label className="flex items-center gap-2 text-sm text-[#131921] mb-4 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 accent-[#008296]" />
              This order contains a gift
            </label>

            {/* Proceed to Buy */}
            <button 
              onClick={handleProceedToBuy}
              disabled={checkedCount === 0}
              className="w-full py-2.5 bg-[#FFD814] hover:bg-[#F7CA00] disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium text-[#131921] rounded-full shadow-sm border border-[#FCD200] transition-colors"
            >
              Proceed to Buy ({checkedCount} item{checkedCount !== 1 ? "s" : ""})
            </button>

            {/* Prime banner */}
            <div className="mt-6 bg-gradient-to-r from-[#232F3E] to-[#37475A] rounded-lg p-4">
              <p className="text-white text-sm font-bold mb-1">Enjoy faster deliveries, offers and so much more!</p>
              <p className="text-gray-300 text-xs mb-3">Join Prime now for FREE deliveries, cancel anytime!</p>
              <button className="w-full py-2 bg-[#FFD814] hover:bg-[#F7CA00] text-sm font-medium text-[#131921] rounded-full">
                Join Prime Shopping Edition at ₹399/year
              </button>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
}
