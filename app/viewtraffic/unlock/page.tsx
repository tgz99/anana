"use client";

import {
  useRef,
  useState,
  useEffect,
  type KeyboardEvent,
  type ClipboardEvent,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Lock, ShieldCheck, AlertCircle } from "lucide-react";

const PIN_LENGTH = 6;
type Status = "idle" | "verifying" | "error" | "success";

export default function UnlockPage() {
  const [digits, setDigits] = useState<string[]>(Array(PIN_LENGTH).fill(""));
  const [status, setStatus] = useState<Status>("idle");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => inputRefs.current[0]?.focus(), 420);
    return () => clearTimeout(t);
  }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...digits];
    next[index] = value;
    setDigits(next);
    if (value && index < PIN_LENGTH - 1) inputRefs.current[index + 1]?.focus();
    if (next.filter(Boolean).length === PIN_LENGTH) verify(next.join(""));
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (digits[index]) {
        const next = [...digits];
        next[index] = "";
        setDigits(next);
      } else if (index > 0) {
        const next = [...digits];
        next[index - 1] = "";
        setDigits(next);
        inputRefs.current[index - 1]?.focus();
      }
    }
    if (e.key === "ArrowLeft" && index > 0) inputRefs.current[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < PIN_LENGTH - 1)
      inputRefs.current[index + 1]?.focus();
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, PIN_LENGTH);
    const next = Array(PIN_LENGTH).fill("");
    pasted.split("").forEach((d, i) => (next[i] = d));
    setDigits(next);
    inputRefs.current[Math.min(pasted.length, PIN_LENGTH - 1)]?.focus();
    if (pasted.length === PIN_LENGTH) verify(pasted);
  };

  const verify = async (pin: string) => {
    if (status !== "idle") return;
    setStatus("verifying");
    await pause(700);
    try {
      const res = await fetch("/api/viewtraffic/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });
      if (res.ok) {
        setStatus("success");
        await pause(900);
        router.push("/viewtraffic");
        router.refresh();
      } else {
        setStatus("error");
        await pause(700);
        setDigits(Array(PIN_LENGTH).fill(""));
        setStatus("idle");
        inputRefs.current[0]?.focus();
      }
    } catch {
      setStatus("error");
      await pause(700);
      setDigits(Array(PIN_LENGTH).fill(""));
      setStatus("idle");
    }
  };

  const boxCls = (i: number) => {
    const base =
      "w-11 h-14 md:w-12 md:h-16 rounded-xl border-2 text-center text-2xl font-black text-white outline-none bg-transparent caret-transparent transition-all duration-200 disabled:opacity-60";
    if (status === "success")
      return `${base} border-cyan-400 bg-cyan-400/10 shadow-[0_0_14px_rgba(34,211,238,0.45)]`;
    if (status === "error") return `${base} border-red-500 bg-red-500/10`;
    if (status === "verifying")
      return `${base} border-[var(--accent-blue)]/50 bg-[var(--accent-blue)]/5`;
    if (digits[i])
      return `${base} border-[var(--accent-blue)] bg-[var(--accent-blue)]/10 shadow-[0_0_10px_rgba(45,156,255,0.3)]`;
    return `${base} border-[var(--card-stroke)] focus:border-[var(--accent-blue)] focus:bg-[var(--accent-blue)]/5`;
  };

  const isDisabled = status === "verifying" || status === "success";

  return (
    <div className="min-h-screen bg-[var(--bg-900)] flex items-center justify-center relative overflow-hidden">
      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 65% 55% at 50% 42%, rgba(16,42,102,0.65) 0%, transparent 78%)",
        }}
      />
      {/* Dot-grid texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-sm mx-4"
      >
        <div
          className="rounded-3xl p-8 md:p-10 flex flex-col items-center gap-7"
          style={{
            background: "rgba(18,18,20,0.88)",
            border: "1px solid var(--card-stroke)",
            backdropFilter: "blur(24px)",
            boxShadow:
              "0 28px 64px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.03)",
          }}
        >
          {/* Lock icon */}
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", delay: 0.22, stiffness: 180, damping: 14 }}
            className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 ${
              status === "success"
                ? "bg-cyan-400/15 shadow-[0_0_28px_rgba(34,211,238,0.35)]"
                : status === "error"
                ? "bg-red-500/15"
                : "bg-[var(--accent-blue)]/10"
            }`}
          >
            <AnimatePresence mode="wait">
              {status === "success" ? (
                <motion.div
                  key="check"
                  initial={{ scale: 0, rotate: 15 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 220 }}
                >
                  <ShieldCheck className="w-8 h-8 text-cyan-400" />
                </motion.div>
              ) : status === "error" ? (
                <motion.div
                  key="alert"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring" }}
                >
                  <AlertCircle className="w-8 h-8 text-red-400" />
                </motion.div>
              ) : (
                <motion.div key="lock" initial={{ scale: 0 }} animate={{ scale: 1 }}>
                  <Lock className="w-8 h-8 text-[var(--accent-blue)]" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28 }}
            className="text-center"
          >
            <AnimatePresence mode="wait">
              <motion.h1
                key={status}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="text-lg font-extrabold tracking-tight"
              >
                {status === "success" ? "Akses Diberikan" : "Traffic Analytics"}
              </motion.h1>
            </AnimatePresence>
            <AnimatePresence mode="wait">
              <motion.p
                key={`sub-${status}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`text-xs mt-1 transition-colors ${
                  status === "error"
                    ? "text-red-400"
                    : "text-[var(--text-muted)]"
                }`}
              >
                {status === "success"
                  ? "Mengalihkan ke dashboard..."
                  : status === "error"
                  ? "PIN salah. Silakan coba lagi."
                  : status === "verifying"
                  ? "Memverifikasi..."
                  : "Masukkan PIN 6 digit untuk melanjutkan"}
              </motion.p>
            </AnimatePresence>
          </motion.div>

          {/* OTP digit inputs */}
          <motion.div
            className="flex gap-2"
            animate={
              status === "error"
                ? { x: [0, -10, 10, -8, 8, -5, 5, -2, 2, 0] }
                : { x: 0 }
            }
            transition={{ duration: 0.55, ease: "easeInOut" }}
          >
            {digits.map((digit, i) => (
              <motion.input
                key={i}
                ref={(el) => { inputRefs.current[i] = el; }}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.32 + i * 0.055, ease: [0.16, 1, 0.3, 1] }}
                whileFocus={{ scale: 1.07 }}
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                disabled={isDisabled}
                className={boxCls(i)}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onPaste={handlePaste}
                onFocus={(e) => e.target.select()}
                autoComplete="one-time-code"
              />
            ))}
          </motion.div>

          {/* Progress indicator dots */}
          <div className="flex gap-2 items-center h-3">
            {digits.map((d, i) => (
              <motion.div
                key={i}
                animate={{
                  scale: d ? 1 : 0.65,
                  backgroundColor:
                    status === "success"
                      ? "#22d3ee"
                      : status === "error"
                      ? "#ef4444"
                      : d
                      ? "var(--accent-blue)"
                      : "var(--card-stroke)",
                }}
                transition={{ duration: 0.18 }}
                className="w-1.5 h-1.5 rounded-full"
              />
            ))}
          </div>

          {/* Spinner */}
          <AnimatePresence>
            {status === "verifying" && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="flex items-center gap-2 text-[10px] text-[var(--text-muted)]"
              >
                <motion.span
                  className="block w-3 h-3 rounded-full border-2 border-[var(--accent-blue)] border-t-transparent"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.75, repeat: Infinity, ease: "linear" }}
                />
                Memverifikasi...
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Brand watermark */}
        <p className="text-center text-[10px] text-[var(--text-muted)]/40 mt-5 tracking-wider uppercase">
          anana Super Oksigen · PT. Hijau Sumilir Indonesia
        </p>
      </motion.div>
    </div>
  );
}

const pause = (ms: number) => new Promise((r) => setTimeout(r, ms));
