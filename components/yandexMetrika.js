"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import ym, { YMInitializer } from "react-yandex-metrika";

const YM_COUNTER_ID = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID || 105281650;

const YandexMetrika = () => {
  const pathname = usePathname();

  useEffect(() => {
    console.log(YM_COUNTER_ID);
    if (pathname) {
      ym("hit", pathname);
    }
  }, [pathname]);

  return (
    <YMInitializer
      accounts={[YM_COUNTER_ID]}
      options={{
        defer: true,
        webvisor: true,
        clickmap: true,
        trackLinks: true,
        accurateTrackBounce: true,
      }}
      version="2"
    />
  );
};

export default YandexMetrika;
