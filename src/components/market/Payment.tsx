// src/components/payment/PaymentSuccess.tsx
"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PaymentSuccess() {
  const router = useRouter();

  return (
    <section className="min-h-screen flex items-center justify-center py-16">
      <div className="container max-w-lg mx-auto px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-card rounded-2xl border p-8 text-center space-y-6"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mx-auto"
          >
            <CheckCircle2 className="w-20 h-20 text-primary mx-auto" />
          </motion.div>

          {/* Success Message */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">Pembayaran Berhasil!</h1>
            <p className="text-muted-foreground">
              Terima kasih telah berbelanja di Agriloka
            </p>
          </div>

          {/* Order Details */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">ID Pesanan</span>
              <span className="font-medium">#AGR12345</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Metode Pembayaran</span>
              <span className="font-medium">Bank Transfer</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Pembayaran</span>
              <span className="font-medium">Rp 160.000</span>
            </div>
          </div>

          {/* Return Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push("/")}
            className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium"
          >
            Kembali ke Beranda
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}