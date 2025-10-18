'use client';

import { useEffect } from 'react';
import Script from 'next/script';

export function Analytics() {
  const yandexMetrikaId = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID;
  const googleAnalyticsId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;

  useEffect(() => {
    // Инициализация Яндекс.Метрики после загрузки (если ID указан)
    if (yandexMetrikaId && typeof window !== 'undefined') {
      setTimeout(() => {
        // @ts-ignore
        if (window.ym) {
          console.log('Яндекс.Метрика initialized');
        }
      }, 2000);
    }
  }, [yandexMetrikaId]);

  return (
    <>
      {/* Яндекс.Метрика - загружается с задержкой */}
      {yandexMetrikaId && (
        <>
          <Script
            id="yandex-metrika"
            strategy="lazyOnload"
            dangerouslySetInnerHTML={{
              __html: `
                (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                m[i].l=1*new Date();
                for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
                k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
                (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

                ym(${yandexMetrikaId}, "init", {
                  clickmap:true,
                  trackLinks:true,
                  accurateTrackBounce:true,
                  webvisor:true
                });
              `,
            }}
          />
          <noscript>
            <div>
              <img
                src={`https://mc.yandex.ru/watch/${yandexMetrikaId}`}
                style={{ position: 'absolute', left: '-9999px' }}
                alt=""
              />
            </div>
          </noscript>
        </>
      )}

      {/* Google Analytics - загружается с задержкой */}
      {googleAnalyticsId && (
        <>
          <Script
            strategy="lazyOnload"
            src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
          />
          <Script
            id="google-analytics"
            strategy="lazyOnload"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${googleAnalyticsId}');
              `,
            }}
          />
        </>
      )}

      {/* Mock: Если переменные окружения не заданы, показываем предупреждение в dev режиме */}
      {process.env.NODE_ENV === 'development' && !yandexMetrikaId && !googleAnalyticsId && (
        <Script
          id="analytics-mock"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `console.log('%c⚠️ Analytics Mock Mode', 'color: orange; font-size: 14px; font-weight: bold;', '\\nДобавьте NEXT_PUBLIC_YANDEX_METRIKA_ID и NEXT_PUBLIC_GOOGLE_ANALYTICS_ID в .env файл');`,
          }}
        />
      )}
    </>
  );
}

