"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Hourglass } from "lucide-react";

export default function LoadingOverlay({ isLoading = false, message = "⏳ Understanding your goal..." }) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0F172A]/90 backdrop-blur-md"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="mb-8 text-[#00A8E1]"
          >
            <Hourglass size={64} />
          </motion.div>
          
          <motion.h2
            key={message}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl md:text-3xl font-extrabold text-white tracking-tight text-center px-4"
          >
            {message}
          </motion.h2>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
