import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { ThemeProvider } from '@/components/ThemeProvider';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';

const noLayoutPages = ['/', '/login'];

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const useLayout = !noLayoutPages.includes(router.pathname);

  return (
    <ThemeProvider>
      {useLayout ? (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      ) : (
        <Component {...pageProps} />
      )}
    </ThemeProvider>
  );
}
