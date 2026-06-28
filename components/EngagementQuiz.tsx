"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, ChevronRight, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { QUIZ } from "@/lib/content.id";
import { WA_ORDER, waLink } from "@/lib/config";
import { trackEvent } from "@/components/ui/Analytics";

type Answers = Record<string, number>;

function getResultKey(answers: Answers): "low" | "medium" | "high" {
  const total = Object.values(answers).reduce((a, b) => a + b, 0);
  if (total <= 2) return "low";
  if (total <= 4) return "medium";
  return "high";
}

export function EngagementQuiz() {
  const [step, setStep] = useState(0); // 0 = intro, 1-3 = questions, 4 = result
  const [answers, setAnswers] = useState<Answers>({});
  const [selected, setSelected] = useState<number | null>(null);

  const isIntro = step === 0;
  const isDone = step > QUIZ.questions.length;
  const question = !isIntro && !isDone ? QUIZ.questions[step - 1] : null;
  const resultKey = isDone ? getResultKey(answers) : null;
  const result = resultKey ? QUIZ.results[resultKey] : null;

  const handleSelect = (idx: number) => setSelected(idx);

  const handleNext = () => {
    if (question && selected !== null) {
      setAnswers((a) => ({ ...a, [question.id]: selected }));
      setSelected(null);
      setStep((s) => s + 1);
      if (step === QUIZ.questions.length) {
        trackEvent("quiz_complete", { result: getResultKey({ ...answers, [question.id]: selected }) });
      }
    }
  };

  const reset = () => {
    setStep(0);
    setAnswers({});
    setSelected(null);
  };

  return (
    <section
      id="quiz"
      className="py-20 md:py-28 bg-[var(--bg-800)] relative overflow-hidden"
    >
      <div className="max-w-2xl mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <p className="text-xs font-bold tracking-[0.3em] text-[var(--accent-blue)] uppercase mb-3">
            Quiz
          </p>
          <h2 className="text-2xl md:text-3xl font-extrabold">{QUIZ.title}</h2>
        </motion.div>

        <div className="glass-card rounded-3xl p-8">
          <AnimatePresence mode="wait">
            {/* Intro */}
            {isIntro && (
              <motion.div
                key="intro"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                className="text-center flex flex-col items-center gap-6"
              >
                <p className="text-[var(--text-muted)]">
                  3 pertanyaan singkat untuk mengetahui tingkat risiko hipoksiam pada gaya hidupmu.
                </p>
                <Button onClick={() => setStep(1)} variant="primary" size="md">
                  Mulai Quiz
                  <ChevronRight className="w-4 h-4" aria-hidden />
                </Button>
              </motion.div>
            )}

            {/* Questions */}
            {question && (
              <motion.div
                key={`q${step}`}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-6"
              >
                {/* Progress */}
                <div className="flex gap-1">
                  {QUIZ.questions.map((_, i) => (
                    <div
                      key={i}
                      className="flex-1 h-1 rounded-full overflow-hidden bg-[var(--bg-700)]"
                    >
                      <div
                        className="h-full transition-all duration-300 rounded-full"
                        style={{
                          background: "var(--accent-blue)",
                          width: i < step ? "100%" : "0%",
                        }}
                      />
                    </div>
                  ))}
                </div>

                <p className="font-semibold text-base md:text-lg">
                  {step}. {question.label}
                </p>

                <div className="flex flex-col gap-3">
                  {question.options.map((opt, i) => (
                    <button
                      key={opt}
                      onClick={() => handleSelect(i)}
                      className={`text-left px-5 py-3 rounded-xl border transition-all text-sm font-medium focus-visible:outline-[var(--accent-blue)] ${
                        selected === i
                          ? "border-[var(--accent-blue)] bg-[var(--accent-blue)]/10 text-white"
                          : "border-[var(--card-stroke)] hover:border-[var(--accent-blue)]/60 text-[var(--text-muted)]"
                      }`}
                      aria-pressed={selected === i}
                    >
                      {opt}
                    </button>
                  ))}
                </div>

                <Button
                  onClick={handleNext}
                  disabled={selected === null}
                  variant="primary"
                  size="md"
                  className="self-end disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {step < QUIZ.questions.length ? "Lanjut" : "Lihat Hasil"}
                  <ChevronRight className="w-4 h-4" aria-hidden />
                </Button>
              </motion.div>
            )}

            {/* Result */}
            {isDone && result && (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-6 text-center"
              >
                <div
                  className={`text-4xl font-black ${
                    resultKey === "low"
                      ? "text-green-400"
                      : resultKey === "medium"
                      ? "text-yellow-400"
                      : "text-[var(--anana-red)]"
                  }`}
                >
                  {result.label}
                </div>
                <p className="text-[var(--text-muted)] text-sm leading-relaxed max-w-sm">
                  {result.desc}
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    as="a"
                    href={waLink(WA_ORDER)}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="primary"
                    size="md"
                    onClick={() => trackEvent("wa_click", { source: "quiz" })}
                  >
                    <MessageCircle className="w-4 h-4" aria-hidden />
                    Konsultasi via WhatsApp
                  </Button>
                  <button
                    onClick={reset}
                    className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-white transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" aria-hidden />
                    Ulangi Quiz
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
