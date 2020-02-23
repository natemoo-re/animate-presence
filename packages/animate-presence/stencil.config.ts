import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'animate-presence',
  copy: [
    { src: 'static' }
  ],
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader'
    },
    {
      type: 'docs-readme'
    },
    {
      type: 'www',
      serviceWorker: null
    }
  ]
};
