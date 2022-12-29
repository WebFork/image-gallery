import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Head from 'next/head';
import Script from 'next/script';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Jiji Memes</title>
        <meta name="HandheldFriendly" content="True" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel='canonical' href='https://pics.navaneeth.live/' />
        <meta name="description" content="An advanced image sharing platform from Jiji." />
        <link href="/favicon.ico" rel="icon shortcut" type="image/x-icon"></link>
        <Script strategy='afterInteractive' async src="https://www.googletagmanager.com/gtag/js?id=G-GXB4L7YK50" />
        <Script
          id='google-analytics'
          strategy='afterInteractive'
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-GXB4L7YK50', {
                page_path: window.location.pathname,
              });
            `
          }}
        />
      </Head>
      <Component {...pageProps} />
      <ToastContainer />
    </>
  );
}

export default MyApp
