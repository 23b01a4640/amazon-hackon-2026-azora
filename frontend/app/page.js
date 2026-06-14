"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, ShoppingCart, ChevronDown, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

export default function AmazonHomePage() {
  const router = useRouter();
  const [showAzoraTooltip, setShowAzoraTooltip] = useState(false);

  return (
    <div className="min-h-screen bg-[#EAEDED] flex flex-col">
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
                  0
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
          <span className="cursor-pointer hover:text-[#FF9900]">Kindle eBooks</span>
          <span className="cursor-pointer hover:text-[#FF9900]">Customer Service</span>
          <span className="cursor-pointer hover:text-[#FF9900]">New Releases</span>
        </div>
      </header>

      {/* Hero Banner */}
      <div className="relative">
        <div className="w-full h-[300px] md:h-[400px] relative overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=1500&auto=format&fit=crop" 
            alt="Shopping banner" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#EAEDED]"></div>
          <div className="absolute top-8 left-8 md:left-16">
            <h2 className="text-xl md:text-3xl font-bold text-white drop-shadow-lg">Bestselling products</h2>
            <p className="text-2xl md:text-4xl font-bold text-white drop-shadow-lg">Great Indian Sale</p>
            <div className="flex gap-4 text-sm mt-3">
              <span className="font-bold text-white bg-black/30 px-3 py-1 rounded">TOP BRANDS</span>
              <span className="font-bold text-white bg-black/30 px-3 py-1 rounded">LATEST TRENDS</span>
            </div>
          </div>
          <button className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded shadow z-10">
            <ChevronLeft size={24} className="text-[#131921]" />
          </button>
          <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded shadow z-10">
            <ChevronRight size={24} className="text-[#131921]" />
          </button>
        </div>
      </div>

      {/* Deal Cards Grid */}
      <div className="max-w-[1500px] mx-auto px-4 -mt-16 relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 pb-6">
        
        {/* Card 1 */}
        <div className="bg-white p-5 shadow rounded">
          <h3 className="font-bold text-lg text-[#131921] mb-3">Up to 75% off | Deals on headphones</h3>
          <div className="w-full h-48 rounded overflow-hidden">
            <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=400&auto=format&fit=crop" alt="Headphones" className="w-full h-full object-cover" />
          </div>
          <a href="#" className="text-sm text-[#007185] hover:text-[#C7511F] hover:underline mt-3 inline-block">See all deals</a>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-5 shadow rounded">
          <h3 className="font-bold text-lg text-[#131921] mb-3">Revamp your home in style</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col items-center">
              <div className="w-full h-20 rounded overflow-hidden">
                <img src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=200&auto=format&fit=crop" alt="Cushion covers" className="w-full h-full object-cover" />
              </div>
              <span className="text-xs text-[#131921] mt-1 text-center">Cushion covers & more</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-full h-20 rounded overflow-hidden">
                <img src="https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?q=80&w=200&auto=format&fit=crop" alt="Vases" className="w-full h-full object-cover" />
              </div>
              <span className="text-xs text-[#131921] mt-1 text-center">Figurines & vases</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-full h-20 rounded overflow-hidden">
                <img src="https://images.unsplash.com/photo-1595428774223-ef52624120d2?q=80&w=200&auto=format&fit=crop" alt="Storage" className="w-full h-full object-cover" />
              </div>
              <span className="text-xs text-[#131921] mt-1 text-center">Home storage</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-full h-20 rounded overflow-hidden">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop" alt="Lighting" className="w-full h-full object-cover" />
              </div>
              <span className="text-xs text-[#131921] mt-1 text-center">Lighting solutions</span>
            </div>
          </div>
          <a href="#" className="text-sm text-[#007185] hover:text-[#C7511F] hover:underline mt-3 inline-block">Explore all</a>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-5 shadow rounded">
          <h3 className="font-bold text-lg text-[#131921] mb-3">Appliances for your home | Up to 55% off</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col items-center">
              <div className="w-full h-20 rounded overflow-hidden">
                <img src="https://images.unsplash.com/photo-1585338107529-13afc5f02586?q=80&w=200&auto=format&fit=crop" alt="AC" className="w-full h-full object-cover" />
              </div>
              <span className="text-xs text-[#131921] mt-1 text-center">Air conditioners</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-full h-20 rounded overflow-hidden">
                <img src="https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?q=80&w=200&auto=format&fit=crop" alt="Refrigerators" className="w-full h-full object-cover" />
              </div>
              <span className="text-xs text-[#131921] mt-1 text-center">Refrigerators</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-full h-20 rounded overflow-hidden">
                <img src="https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?q=80&w=200&auto=format&fit=crop" alt="Microwaves" className="w-full h-full object-cover" />
              </div>
              <span className="text-xs text-[#131921] mt-1 text-center">Microwaves</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-full h-20 rounded overflow-hidden">
                <img src="https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?q=80&w=200&auto=format&fit=crop" alt="Washing machines" className="w-full h-full object-cover" />
              </div>
              <span className="text-xs text-[#131921] mt-1 text-center">Washing machines</span>
            </div>
          </div>
          <a href="#" className="text-sm text-[#007185] hover:text-[#C7511F] hover:underline mt-3 inline-block">See all deals</a>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-5 shadow rounded">
          <h3 className="font-bold text-lg text-[#131921] mb-3">Starting ₹49 | Deals on home essentials</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col items-center">
              <div className="w-full h-20 rounded overflow-hidden">
                <img src="https://images.unsplash.com/photo-1563453392212-326f5e854473?q=80&w=200&auto=format&fit=crop" alt="Cleaning" className="w-full h-full object-cover" />
              </div>
              <span className="text-xs text-[#131921] mt-1 text-center">Cleaning supplies</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-full h-20 rounded overflow-hidden">
                <img src="https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?q=80&w=200&auto=format&fit=crop" alt="Bathroom" className="w-full h-full object-cover" />
              </div>
              <span className="text-xs text-[#131921] mt-1 text-center">Bathroom accessories</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-full h-20 rounded overflow-hidden">
                <img src="https://images.unsplash.com/photo-1581783898377-1c85bf937427?q=80&w=200&auto=format&fit=crop" alt="Tools" className="w-full h-full object-cover" />
              </div>
              <span className="text-xs text-[#131921] mt-1 text-center">Home tools</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-full h-20 rounded overflow-hidden">
                <img src="https://images.unsplash.com/photo-1615529328331-f8917597711f?q=80&w=200&auto=format&fit=crop" alt="Wallpapers" className="w-full h-full object-cover" />
              </div>
              <span className="text-xs text-[#131921] mt-1 text-center">Wallpapers</span>
            </div>
          </div>
          <a href="#" className="text-sm text-[#007185] hover:text-[#C7511F] hover:underline mt-3 inline-block">See all deals</a>
        </div>
      </div>

      {/* Second row */}
      <div className="max-w-[1500px] mx-auto px-4 pb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 shadow rounded">
          <h3 className="font-bold text-lg text-[#131921] mb-3">Top picks in Electronics</h3>
          <div className="w-full h-48 rounded overflow-hidden">
            <img src="https://images.unsplash.com/photo-1468495244123-6c6c332eeece?q=80&w=400&auto=format&fit=crop" alt="Electronics" className="w-full h-full object-cover" />
          </div>
          <a href="#" className="text-sm text-[#007185] hover:text-[#C7511F] hover:underline mt-3 inline-block">See more</a>
        </div>

        <div className="bg-white p-5 shadow rounded">
          <h3 className="font-bold text-lg text-[#131921] mb-3">Fashion under ₹599</h3>
          <div className="w-full h-48 rounded overflow-hidden">
            <img src="https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=400&auto=format&fit=crop" alt="Fashion" className="w-full h-full object-cover" />
          </div>
          <a href="#" className="text-sm text-[#007185] hover:text-[#C7511F] hover:underline mt-3 inline-block">Shop now</a>
        </div>

        <div className="bg-white p-5 shadow rounded">
          <h3 className="font-bold text-lg text-[#131921] mb-3">Grocery & Gourmet</h3>
          <div className="w-full h-48 rounded overflow-hidden">
            <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=400&auto=format&fit=crop" alt="Grocery" className="w-full h-full object-cover" />
          </div>
          <a href="#" className="text-sm text-[#007185] hover:text-[#C7511F] hover:underline mt-3 inline-block">Shop fresh</a>
        </div>

        <div className="bg-white p-5 shadow rounded">
          <h3 className="font-bold text-lg text-[#131921] mb-3">Books & Stationery</h3>
          <div className="w-full h-48 rounded overflow-hidden">
            <img src="https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=400&auto=format&fit=crop" alt="Books" className="w-full h-full object-cover" />
          </div>
          <a href="#" className="text-sm text-[#007185] hover:text-[#C7511F] hover:underline mt-3 inline-block">Browse all</a>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#232F3E] text-white text-center py-6 text-sm mt-auto">
        <p className="text-gray-400 mb-2">Amazon.in Demo — Azora Mission Control Integration</p>
        <p className="text-gray-500 text-xs">Click the ✨ Azora icon in the navbar to start goal-based shopping</p>
      </footer>
    </div>
  );
}
