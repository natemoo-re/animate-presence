import { HTMLAttributes } from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'animate-presence': HTMLAttributes<HTMLAnimatePresenceElement> & {
        ref?: any;
      };
    }
  }
}
