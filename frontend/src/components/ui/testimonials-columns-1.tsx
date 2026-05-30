"use client";
import React from "react";
import { motion } from "framer-motion";

/* ─── Edit card appearance here ──────────────────────────────────────────
   CARD_BG      → card background color
   CARD_BORDER  → card border color / opacity
   CARD_SHADOW  → card drop-shadow
   TEXT_PRIMARY → main testimonial text color
   TEXT_NAME    → reviewer name color
   TEXT_ROLE    → reviewer role color (dimmed)
──────────────────────────────────────────────────────────────────────── */
const CARD_BG     = "bg-[#0a1428]";
const CARD_BORDER = "border-[#0066ff22]";
const CARD_SHADOW = "shadow-[0_4px_24px_rgba(0,102,255,0.08)]";
const TEXT_PRIMARY = "text-gray-300";
const TEXT_NAME    = "text-white font-semibold";
const TEXT_ROLE    = "text-gray-500";

export type Testimonial = {
  text: string;
  image: string;
  name: string;
  role: string;
};

export const TestimonialsColumn = (props: {
  className?: string;
  testimonials: Testimonial[];
  duration?: number;
}) => {
  return (
    <div className={props.className}>
      <motion.div
        animate={{ translateY: "-50%" }}
        transition={{
          duration: props.duration ?? 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-5 pb-5"
      >
        {[...new Array(2).fill(0).map((_, index) => (
          <React.Fragment key={index}>
            {props.testimonials.map(({ text, image, name, role }, i) => (
              /* ── Individual card ── edit padding, radius, width here ── */
              <div
                key={i}
                className={`p-6 rounded-2xl border ${CARD_BG} ${CARD_BORDER} ${CARD_SHADOW} max-w-xs w-full`}
              >
                {/* ── Testimonial body text ── */}
                <p className={`text-[13.5px] leading-[1.7] ${TEXT_PRIMARY}`}>
                  &ldquo;{text}&rdquo;
                </p>

                {/* ── Reviewer row ── */}
                <div className="flex items-center gap-3 mt-5">
                  <img
                    width={40}
                    height={40}
                    src={image}
                    alt={name}
                    className="h-10 w-10 rounded-full object-cover ring-2 ring-[#0066ff30]"
                  />
                  <div className="flex flex-col">
                    <span className={`text-[13px] leading-5 tracking-tight ${TEXT_NAME}`}>
                      {name}
                    </span>
                    <span className={`text-[12px] leading-5 tracking-tight ${TEXT_ROLE}`}>
                      {role}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </React.Fragment>
        ))]}
      </motion.div>
    </div>
  );
};
