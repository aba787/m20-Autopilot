import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="ar" dir="rtl">
      <Head>
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/m20-logo.png" />
        <meta property="og:image" content="/m20-logo.png" />
        <meta property="og:title" content="M20 Autopilot — Amazon Advertising AI" />
        <meta property="og:description" content="AI-powered Amazon advertising optimization platform." />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="/m20-logo.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800;900&display=swap" rel="stylesheet" />
        <meta name="description" content="M20 Autopilot - منصة تحسين إعلانات أمازون الذكية" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
