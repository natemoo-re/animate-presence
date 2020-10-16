export default function Logo(props: any) {
  return (
    <svg
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 360 360"
      {...props}
    >
      <g clipPath="url(#clip0)">
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M172 46c4-8 16-8 21 0l135 234c6 11-2 25-15 25H43c-9 0-15-10-10-18L172 46zm-56 209c-3 0-5-3-4-6l67-115c1-3 5-3 7 0l66 115c2 3 0 6-3 6H116z"
          fill="#1B99FF"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M172 46c4-8 16-8 21 0l135 234c6 11-2 25-15 25H43c-9 0-15-10-10-18L172 46zm-56 209c-3 0-5-3-4-6l67-115c1-3 5-3 7 0l66 115c2 3 0 6-3 6H116z"
          fill="url(#paint0_linear)"
          style={{ mixBlendMode: 'multiply' }}
        />
        <path
          d="M307 115c31 32 31 84 0 115a81 81 0 01-115 0 82 82 0 010-115c32-32 83-32 115 0z"
          fill="#1B99FF"
        />
        <path
          d="M307 115c31 32 31 84 0 115a81 81 0 01-115 0 82 82 0 010-115c32-32 83-32 115 0z"
          fill="url(#paint1_radial)"
          style={{ mixBlendMode: 'screen' }}
        />
        <path
          d="M307 115c31 32 31 84 0 115a81 81 0 01-115 0 82 82 0 010-115c32-32 83-32 115 0z"
          fill="url(#paint2_radial)"
          style="mix-blend-mode:multiply"
        />
      </g>
      <defs>
        <linearGradient
          id="paint0_linear"
          x1="266.1"
          y1="270.5"
          x2="44.1"
          y2="273"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#8621D0" />
          <stop offset="1" stop-color="#8621D0" stop-opacity="0" />
        </linearGradient>
        <radialGradient
          id="paint1_radial"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="matrix(-136.96305 136.96305 -102.67332 -102.67332 333 95)"
        >
          <stop stop-color="#64E7FF" />
          <stop offset="1" stop-color="#64E7FF" stop-opacity="0" />
        </radialGradient>
        <radialGradient
          id="paint2_radial"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="rotate(135 106 120) scale(576.743)"
        >
          <stop stop-color="#8621D0" stop-opacity="0" />
          <stop offset="1" stop-color="#8621D0" />
        </radialGradient>
        <clipPath id="clip0">
          <path d="M0 0h360v360H0V0z" fill="#fff" />
        </clipPath>
      </defs>
    </svg>
  );
}
