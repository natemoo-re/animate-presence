import { Component, Element, Prop, Watch, h } from '@stencil/core';
import { QueueApi } from "@stencil/core/dist/declarations";
import {
  injectHistory,
  matchPath,
  MatchResults,
  LocationSegments
} from "@stencil/router";

import { presence } from '../../utils';

const exitChildren = async (el: HTMLElement) => {
    return Promise.all(Array.from(el.querySelectorAll("animate-presence")).map(el => el.exit()));
}

const enterChildren = async (el: HTMLElement) => {
  return Promise.all(
    Array.from(el.children).map(async (child: HTMLElement) => {
        await presence(child, {
          afterChildren: () => {
            child.dataset.enter = "";
          },
          afterSelf: () => {
            delete child.dataset.enter;
          }
        });
        return;
    })
  );
};


interface Child {
  el: HTMLStencilRouteElement,
  match: MatchResults | null
}

const getUniqueId = () => {
  return ((Math.random() * 10e16).toString().match(/.{4}/g) || []).join('-');
}

const getMatch = (pathname: string, url: any, exact: boolean) => {
  return matchPath(pathname, {
    path: url,
    exact: exact,
    strict: true
  });
}

const isHTMLStencilRouteElement = (elm: Element): elm is HTMLStencilRouteElement => {
  return elm.tagName === 'STENCIL-ROUTE';
}


@Component({
  tag: "animated-route-switch"
})
export class AnimatedRouteSwitch {
  @Element() el!: HTMLElement;

  @Prop() registry: HTMLAnimatePresenceElement[] = [];
  
  @Prop({ context: "queue" }) queue!: QueueApi;

  @Prop({ reflectToAttr: true }) group: string = getUniqueId();
  @Prop() scrollTopOffset?: number;
  @Prop() location?: LocationSegments;
  @Prop() routeViewsUpdated?: (options: any) => void;

  activeIndex?: number;
  prevIndex?: number;
  subscribers: Child[] = [];

  componentWillLoad() {
    if (this.location != null) {
      this.regenerateSubscribers(this.location);
    }
  }

  @Watch("location")
  async regenerateSubscribers(newLocation: LocationSegments) {
    if (newLocation == null) {
      return;
    }

    let newActiveIndex = -1;

    this.subscribers = Array.prototype.slice
      .call(this.el.children)
      .filter(isHTMLStencilRouteElement)
      .map(
        (childElement, index): Child => {
          const match = getMatch(
            newLocation.pathname,
            childElement.url,
            childElement.exact
          );

          if (match && newActiveIndex === -1) {
            newActiveIndex = index;
          }
          return {
            el: childElement,
            match: match
          };
        }
      );

    if (newActiveIndex === -1) {
      return;
    }

    // Check if this actually changes which child is active
    // then just pass the new match down if the active route isn't changing.
    if (this.activeIndex === newActiveIndex) {
      this.subscribers[newActiveIndex].el.match = this.subscribers[
        newActiveIndex
      ].match;
      return;
    }
    this.prevIndex = this.activeIndex;
    this.activeIndex = newActiveIndex;

    // Set all props on the new active route then wait until it says that it
    // is completed
    const prevChild = this.subscribers[this.prevIndex];
    if (prevChild) {
      await exitChildren(prevChild.el);
    }
    const activeChild = this.subscribers[this.activeIndex];
    if (this.scrollTopOffset) {
      activeChild.el.scrollTopOffset = this.scrollTopOffset;
    }
    activeChild.el.group = this.group;
    activeChild.el.match = activeChild.match;
    activeChild.el.componentUpdated = (routeViewUpdatedOptions: any) => {
      // After the new active route has completed then update visibility of routes
      this.queue.write(() => {
        this.subscribers.forEach((child, index) => {
          child.el.componentUpdated = undefined;

          if (index === this.activeIndex) {
            child.el.style.display = "";
            return enterChildren(child.el);
          }

          if (this.scrollTopOffset) {
            child.el.scrollTopOffset = this.scrollTopOffset;
          }
          child.el.group = this.group;
          child.el.match = null;
          child.el.style.display = "none";
        });
      });

      if (this.routeViewsUpdated) {
        this.routeViewsUpdated({
          scrollTopOffset: this.scrollTopOffset,
          ...routeViewUpdatedOptions
        });
      }
    };
  }

  render() {
    return <slot />;
  }
}
injectHistory(AnimatedRouteSwitch);