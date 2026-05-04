"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./Button";
import { AlertTriangle, LogOut } from "lucide-react";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function LogoutModal({ isOpen, onClose, onConfirm }: LogoutModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={onClose}
            className="absolute inset-0 bg-primary/20 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-sm bg-white rounded-2xl shadow-xl border border-surface-dim p-6"
          >
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-heading text-xl font-bold text-foreground mb-2">Sign Out</h3>
            <p className="text-foreground/70 text-sm mb-6">
              Are you sure you want to sign out of your EcoSwap account? You will need to log back in to manage your swaps.
            </p>
            <div className="flex gap-3 w-full">
              <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
              <Button variant="primary" className="flex-1 bg-red-600 hover:bg-red-700 border-transparent text-white" onClick={onConfirm}>
                <LogOut className="w-4 h-4 mr-2" /> Sign Out
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
