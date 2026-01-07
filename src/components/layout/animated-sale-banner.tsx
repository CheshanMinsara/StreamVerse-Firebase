"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Megaphone } from "lucide-react";

const messages = [
  "For sale!",
  "Inquire at cheshanminsara@gmail.com"
];

const TypingAnimation = ({ text }: { text: string }) => {
  const characters = text.split('');
  return (
    <AnimatePresence>
      {characters.map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.05, delay: i * 0.05 }}
          className="inline"
        >
          {char}
        </motion.span>
      ))}
    </AnimatePresence>
  );
};

export default function AnimatedSaleBanner() {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 4000); // Change message every 4 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <a href="mailto:cheshanminsara@gmail.com" className="group flex items-center gap-2">
        <Megaphone className="h-5 w-5 text-yellow-500 group-hover:animate-pulse" />
        <div className="text-sm font-semibold text-yellow-500/90 group-hover:text-yellow-500 transition-colors h-5">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentMessageIndex}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.5 }}
                >
                    <TypingAnimation text={messages[currentMessageIndex]} />
                </motion.div>
            </AnimatePresence>
        </div>
    </a>
  );
}
