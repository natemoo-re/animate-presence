const keyframes = () => {
  const seed = Math.random() * 15;
  const frames = Math.floor(Math.random() * 6);

  const result = [
    `0% {
      transform: translate(
        ${Math.floor(seed * 5)}%, 
        ${Math.floor(seed * 10)}%
      ) scale(${0.5 + Math.random() * 2});
    }`,
  ];

  for (let i = 1; i < frames + 1; i++) {
    result.push(`${Math.floor((i / frames) * 100)}% {
      transform: translate(
        ${Math.floor(seed * i * 10)}%, 
        ${Math.floor(seed * i * -20)}%
      ) scale(${0.5 + Math.random() * 2});
    }\n`);
  }
  return result.join('');
};

const Metaballs = () => {
  return (
    <>
      <div className="host">
        <div id="metaball-01" className="outer">
          <div className="inner">
            <div className="ball" />
            <div className="ball" />
            <div className="ball" />
          </div>
        </div>
        <div className="color" />
      </div>

      <style jsx>{`
        .host,
        .color,
        .outer,
        .inner {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
        }

        .host {
          mix-blend-mode: multiply;
        }

        .color {
          background: linear-gradient(
              0deg,
              #e0e0e0 -54.64%,
              rgba(255, 255, 255, 0) 87.9%
            ),
            #fcfcfc;
          mix-blend-mode: lighten;
        }

        .outer {
          background: white;
          filter: brightness(100%) contrast(1200%);
        }

        .inner {
          filter: blur(64px);
        }

        .ball {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          margin: auto;
          --size: 256px;
          width: var(--size);
          height: var(--size);
          background: black;
          border-radius: 50%;
        }
      `}</style>

      <style jsx>{`
        .ball:nth-child(1) {
          animation: a 120s linear infinite alternate-reverse;
        }
        .ball:nth-child(2) {
          animation: b 45s linear infinite alternate-reverse;
        }
        .ball:nth-child(3) {
          animation: c 60s linear infinite alternate;
        }
        @keyframes a {
          0%,
          100% {
            transform: translate(-10vw, -25vh) scale(1.25) skew(var(--offset));
          }
          25% {
            transform: translate(50vw, 25vh) scale(3) skew(var(--offset));
          }
          75% {
            transform: translate(0vw, 10vh) scale(0.5) skew(var(--offset));
          }
        }
        @keyframes b {
          0% {
            transform: translate(-67vw, -20vh) scale(0.5) skew(var(--offset));
          }
          50% {
            transform: translate(25vw, 10vh) scale(1) skew(var(--offset));
          }
          100% {
            transform: translate(-25vw, -10vh) scale(2.5) skew(var(--offset));
          }
        }
        @keyframes c {
          0% {
            transform: translate(-50vw, -5vh) scale(0.25) skew(var(--offset));
          }
          50% {
            transform: translate(25vw, 5vh) scale(3) skew(var(--offset));
          }
          100% {
            transform: translate(-33vw, 10vh) scale(1) skew(var(--offset));
          }
        }
      `}</style>
    </>
  );
};

export default Metaballs;
