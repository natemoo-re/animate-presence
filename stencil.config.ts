import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'animate-presence',
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
