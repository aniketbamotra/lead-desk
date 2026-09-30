"use client"

import Image from "next/image"
import { useState } from "react"
import s from "./harlow.module.css"

// Before and after comparison on a native range input: keyboard, touch and
// screen readers work without custom handlers. The input is invisible and
// covers the frame; the handle shows its focus through :has().
export function CompareSlider({ src, width, height, alt }: { src: string; width: number; height: number; alt: string }) {
  const [pos, setPos] = useState(50)

  return (
    <div className={s.compare} style={{ "--pos": `${pos}%` } as React.CSSProperties}>
      <Image src={src} alt={alt} width={width} height={height} className={s.compareAfter} sizes="(min-width: 1368px) 1320px, 100vw" />
      <div className={s.compareBefore} aria-hidden>
        <Image src={src} alt="" width={width} height={height} sizes="(min-width: 1368px) 1320px, 100vw" />
      </div>
      <span className={`${s.compareTag} ${s.tagBefore}`} aria-hidden>
        Before
      </span>
      <span className={`${s.compareTag} ${s.tagAfter}`} aria-hidden>
        After
      </span>
      <span className={s.compareLine} aria-hidden />
      <span className={s.compareKnob} aria-hidden>
        <svg width="18" height="12" viewBox="0 0 18 12">
          <path d="M5 1L1 6l4 5M13 1l4 5-4 5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <input
        type="range"
        min={0}
        max={100}
        step={1}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-label="Before and after comparison. Left shows before, right shows after."
        aria-valuetext={`${pos}% before, ${100 - pos}% after`}
        className={s.compareInput}
      />
    </div>
  )
}
