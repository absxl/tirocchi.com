"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { Observer } from "gsap/Observer";
import { CustomEase } from "gsap/CustomEase";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, ScrollToPlugin, Observer, CustomEase);
  // Custom in-out ease (reimplemented, in the spirit of the reference sites).
  CustomEase.create("matteoInOut", "M0,0 C0.42,0 0.18,1 1,1");
}

export { gsap, ScrollTrigger, SplitText, ScrollToPlugin, Observer, CustomEase };
