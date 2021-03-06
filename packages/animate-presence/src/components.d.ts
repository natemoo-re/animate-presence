/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */

import { HTMLStencilElement, JSXBase } from '@stencil/core/internal';
import { LocationSegments } from './utils/router';

export namespace Components {
  interface AnimatePresence {
    __presenceKey: string;
    descendants: HTMLAnimatePresenceElement[];
    /**
     * Programmatically triggers an entrance.  Nested `<animate-presence>` children will be animated in from the top down, meaning that parent elements trigger a child's entrance after their own entrance finishes.
     */
    enter: () => Promise<void>;
    /**
     * Programmatically triggers an exit.  Nested `<animate-presence>` children will be animated out from the bottom up, meaning that children elements trigger a parent's exit after their own exit finishes.
     */
    exit: () => Promise<void>;
    /**
     * If `true` (default), a MutationObserver will automatically be connected to enable animations when a child node enters/exits.  If you know the children are static (typical `animated-route-switch` use case), `false` may improve performance.  Note: `<animate-presence>` elements which are children of a parent `<animate-presence>` element will inherit this value,  which means MutationObservers can be disabled for the entire tree by setting `observe={false}` on the top-level element.  However, directly set values always take precedence over inherited values.
     */
    observe: boolean;
    registerChild: (el: HTMLAnimatePresenceElement) => Promise<void>;
    unregisterChild: (key: string) => Promise<void>;
  }
  interface AnimatedRouteSwitch {
    group: string;
    location: LocationSegments;
    routeViewsUpdated?: (options: any) => void;
    scrollTopOffset?: number;
  }
}

declare global {
  interface HTMLAnimatePresenceElement
    extends Components.AnimatePresence,
      HTMLStencilElement {}
  var HTMLAnimatePresenceElement: {
    prototype: HTMLAnimatePresenceElement;
    new (): HTMLAnimatePresenceElement;
  };

  interface HTMLAnimatedRouteSwitchElement
    extends Components.AnimatedRouteSwitch,
      HTMLStencilElement {}
  var HTMLAnimatedRouteSwitchElement: {
    prototype: HTMLAnimatedRouteSwitchElement;
    new (): HTMLAnimatedRouteSwitchElement;
  };
  interface HTMLElementTagNameMap {
    'animate-presence': HTMLAnimatePresenceElement;
    'animated-route-switch': HTMLAnimatedRouteSwitchElement;
  }
}

declare namespace LocalJSX {
  interface AnimatePresence {
    /**
     * If `true` (default), a MutationObserver will automatically be connected to enable animations when a child node enters/exits.  If you know the children are static (typical `animated-route-switch` use case), `false` may improve performance.  Note: `<animate-presence>` elements which are children of a parent `<animate-presence>` element will inherit this value,  which means MutationObservers can be disabled for the entire tree by setting `observe={false}` on the top-level element.  However, directly set values always take precedence over inherited values.
     */
    observe?: boolean;
    /**
     * Dispatched on a child when it enters. `event.target` is the entering child element.  It is recommended to use an animation handler created with `createPresenceHandler` for this event.
     */
    onAnimatePresenceEnter?: (event: CustomEvent<{ i: number }>) => void;
    /**
     * Dispatched on a child when it exits. `event.target` is the exiting child element.  It is recommended to use an animation handler created with `createPresenceHandler` for this event.
     */
    onAnimatePresenceExit?: (event: CustomEvent<{ i: number }>) => void;
    /**
     * Fires when all exiting nodes have completed animating out.  To simplify listener behavior, this event bubbles, but never beyond the closest `<animate-presence>` parent.
     */
    onAnimatePresenceExitComplete?: (event: CustomEvent<void>) => void;
  }
  interface AnimatedRouteSwitch {
    location?: LocationSegments;
    scrollTopOffset?: number;
  }

  interface IntrinsicElements {
    'animate-presence': AnimatePresence;
    'animated-route-switch': AnimatedRouteSwitch;
  }
}

export { LocalJSX as JSX };

declare module '@stencil/core' {
  export namespace JSX {
    interface IntrinsicElements {
      'animate-presence': LocalJSX.AnimatePresence &
        JSXBase.HTMLAttributes<HTMLAnimatePresenceElement>;
      'animated-route-switch': LocalJSX.AnimatedRouteSwitch &
        JSXBase.HTMLAttributes<HTMLAnimatedRouteSwitchElement>;
    }
  }
}
