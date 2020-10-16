import React, { FC } from 'react';
import Metaballs from '../components/Metaballs';
import Words from '../components/Words';
import SimpleDemo from '../components/SimpleDemo';
import Layout from '../components/Layout';
import { GetStaticProps } from 'next';
import { getHighlighter } from 'shiki';
import dedent from 'dedent';

const Home: FC<{ code: string }> = ({ code }) => {
  return (
    <>
      <Layout>
        <div>
          <section className="lede">
            <Metaballs />

            <div className="content">
              <animate-presence>
                <h1>
                  <Words
                    duration="750ms"
                    delay="calc((var(--i, 0) * 100ms) + 300ms)"
                  >
                    Effortless entrance and exit&nbsp;animations
                  </Words>
                </h1>
                <p>
                  <Words
                    duration="300ms"
                    delay="calc((var(--i, 0) * 35ms) + 900ms)"
                  >
                    With Animate Presence, there's no new API to
                    learn&mdash;just use CSS or the Web Animations API.
                  </Words>
                </p>
              </animate-presence>
            </div>
          </section>
        </div>

        <section className="code" dangerouslySetInnerHTML={{ __html: code }} />
        <section>
          <SimpleDemo />
        </section>
      </Layout>
      <style jsx>
        {`
          .lede {
            --skew: -5deg;
            --offset: calc(var(--skew) * -1);
            text-align: center;
            padding: 256px 0 128px;
            margin-top: -128px;
            background: linear-gradient(
                0deg,
                #e0e0e0 -54.64%,
                rgba(255, 255, 255, 0) 87.9%
              ),
              #fcfcfc;
            width: 110vw;
            margin-left: -5vw;
            margin-right: -5vw;
            transform: rotate(var(--skew)) skew(var(--skew));
            overflow: hidden;
            margin-bottom: 64px;
          }

          .content {
            max-width: 48ch;
            width: calc(100% - 2rem);
            margin: 0 auto;
            transform: rotate(var(--offset)) skew(var(--offset));
          }

          h1 {
            font-size: clamp(1.5rem, 3vw + 1rem, 3rem);
            line-height: 1.25;
          }

          p {
            margin: 0 auto;
            margin-top: 1rem;
            font-size: clamp(0.75rem, 1vw + 0.5rem, 1rem);
            line-height: 1.5;
            max-width: calc(100% - 2rem);
          }

          .code {
            display: flex;
            max-width: 80ch;
            width: calc(100% - 2rem);
            margin: 0 auto;
            background: #1f1f1f;
            border-radius: 16px;
            overflow: hidden;
          }

          :global(.shiki) {
            padding: 1rem 1.5rem;
          }
        `}
      </style>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const highlighter = await getHighlighter({ theme: 'min-dark' });

  return {
    props: {
      code: highlighter.codeToHtml!(
        dedent`
        <animate-presence>
          {items.map(item => <div>{item}</div>)}
        </animate-presence>

        <style>
          [data-enter] {
            animation: enter 300ms linear;
          }
          [data-exit] {
            animation: exit 300ms linear;
          }

          @keyframes enter {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes exit {
            from { opacity: 1; }
            to { opacity: 0; }
          }
        </style>`,
        'html'
      ),
    },
  };
};

export default Home;
