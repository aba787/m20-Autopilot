import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { ThemeProvider } from '@/components/ThemeProvider';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { AuthCtx, useAuthState } from '@/lib/useAuth';
import { I18nProvider } from '@/lib/i18n';

const noLayoutPages = ['/', '/login'];

function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuthState();
  return <AuthCtx.Provider value={auth}>{children}</AuthCtx.Provider>;
}

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const useLayout = !noLayoutPages.includes(router.pathname);

  return (
    <ThemeProvider>
      <I18nProvider>
        <AuthProvider>
          {useLayout ? (
            <Layout>
              <Component {...pageProps} />
            </Layout>
          ) : (
            <Component {...pageProps} />
          )}
        </AuthProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}
