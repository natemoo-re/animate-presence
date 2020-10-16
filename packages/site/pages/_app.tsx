import { AppProps } from 'next/app';
import Head from 'next/head';
import { FC, useEffect } from 'react';
import { defineCustomElements } from 'animate-presence/loader';

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  useEffect(() => {
    defineCustomElements();
  }, []);

  return (
    <>
      <Head>
        <link rel="stylesheet" href="https://use.typekit.net/igs1wpt.css" />
      </Head>
      <Component {...pageProps} />
      <style jsx global>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          font-family: obviously, sans-serif;
          font-weight: 400;
          font-style: normal;
        }

        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
          font-family: obviously, sans-serif;
          font-weight: 700;
          font-style: normal;
        }
      `}</style>
    </>
  );
};

export default MyApp;
