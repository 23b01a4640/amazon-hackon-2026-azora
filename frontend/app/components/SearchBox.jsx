"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, Image as ImageIcon, X } from "lucide-react";
import LoadingOverlay from "./LoadingOverlay";
import { understandGoal } from "../services/api";

export default function SearchBox({ value, onChange }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  const router = useRouter();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!value.trim() && !selectedImage) return;

    setIsSubmitting(true);

    try {
      const data = await understandGoal(value);
      const mission = data.mission;

      if (mission === "Direct Product") {
        // Direct product search flow — skip questions, go to adaptive questions
        router.push(`/azora/questions?mode=adaptive&query=${encodeURIComponent(data.search_query || value)}`);
      } else {
        // Mission-based flow — go to mission questions
        router.push(`/azora/questions?mission=${encodeURIComponent(mission)}`);
      }
    } catch (error) {
      console.error("Error understanding goal:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto px-4 relative z-10">
        <div className="relative flex flex-col items-center bg-[#1E293B] rounded-2xl border border-[#334155] focus-within:border-[#00A8E1] transition-colors p-2 shadow-2xl">
          {selectedImage && (
            <div className="relative w-full p-4 pb-0">
              <div className="relative inline-block">
                <img src={selectedImage} alt="Preview" className="h-32 object-cover rounded-lg border border-[#334155]" />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          )}
          
          <div className="flex w-full items-center p-2">
            <Search className="text-gray-400 ml-2 hidden sm:block" size={24} />
            <input
              type="text"
              placeholder="What is your goal today? (e.g. Moving into a new apartment)"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="flex-1 bg-transparent text-white sm:text-lg px-4 py-3 outline-none placeholder:text-gray-500"
            />
            
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleImageChange}
            />
            
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-3 text-gray-400 hover:text-[#00A8E1] hover:bg-[#334155]/50 rounded-xl transition-colors mr-2 flex-shrink-0"
              title="Upload Image"
            >
              <ImageIcon size={24} />
            </button>
            
            <button
              type="submit"
              disabled={!value.trim() && !selectedImage}
              className="px-6 sm:px-8 py-3 bg-[#00A8E1] hover:bg-[#0089B8] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-colors flex-shrink-0"
            >
              Continue
            </button>
          </div>
        </div>
      </form>

      <LoadingOverlay isLoading={isSubmitting} message="⏳ Understanding your goal..." />
    </>
  );
}
