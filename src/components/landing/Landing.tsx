"use client";

import { useMemo } from "react";
import { getDictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/types";
import { buildRooms } from "@/lib/rooms";
import { PageTransition } from "@/components/motion/PageTransition";
import { Preloader } from "@/components/home/Preloader";
import { RoomScene } from "@/components/home/RoomScene";
import styles from "./Landing.module.css";

interface LandingProps {
  lang: Locale;
  social: { label: string; url: string }[];
}

export function Landing({ lang, social }: LandingProps) {
  const dict = getDictionary(lang);

  const rooms = useMemo(() => buildRooms({ lang, dict }), [lang, dict]);

  return (
    <PageTransition>
      <Preloader name={dict.landing.name} loadingLabel={dict.landing.loading} />
      <div className={styles.landing}>
        <RoomScene
          rooms={rooms}
          social={social}
          hint={dict.landing.scrollHint}
          prevLabel={dict.progetto.previous}
          nextLabel={dict.progetto.next}
          chaptersLabel={dict.landing.chapters}
          exploreLabel={dict.landing.explore}
        />
      </div>
    </PageTransition>
  );
}
