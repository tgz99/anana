"use client";

import { motion } from "framer-motion";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { trackEvent } from "@/components/ui/Analytics";

export function ResellerStrip() {
  return (
    <section aria-label="Ajakan bergabung sebagai reseller">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5 }}
        className="py-10 px-4"
        style={{
          background: "linear-gradient(90deg, var(--anana-red-deep) 0%, var(--anana-red) 100%)",
        }}
      >
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div>
            <p className="text-lg md:text-xl font-extrabold text-white">
              Tertarik jadi reseller Anana?
            </p>
            <p className="text-sm text-white/80 mt-1">
              Bergabung bersama jaringan reseller kami — margin menarik, dukungan penuh.
            </p>
          </div>
          <Button
            as="a"
            href="#kemitraan"
            variant="secondary"
            size="md"
            className="border-white text-white hover:bg-white hover:text-[var(--anana-red)] flex-shrink-0"
            onClick={() => trackEvent("kemitraan_click", { source: "reseller_strip" })}
          >
            <Users className="w-4 h-4" aria-hidden />
            Jadi Reseller
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
