import {
  Component,
  h,
  Element,
  Host,
  Prop,
  Watch,
  Method,
  Event,
  EventEmitter,
  Listen,
} from '@stencil/core';
import {
  setCustomProperties,
  isHTMLElement,
  hasData,
  presence,
  closest,
  enterChildren,
  exitChildren,
  injectGlobalStyle,
  getBounds,
  getDelta,
} from '../../utils';

const hold = (el: HTMLElement) => async (cb: any) => {
  el.dataset.hold = '';
  await cb(el).then((r?: Animation) => {
    if (r && 'finished' in r) {
      return r.finished;
    }
    return;
  });
  delete el.dataset.hold;
};

@Component({
  tag: 'animate-presence',
  shadow: true,
})
export class AnimatePresence {
  @Element() element: HTMLAnimatePresenceElement;

  /** @internal */
  @Prop() __presenceKey = `animate-presence-${ids++}`;

  /** @internal */
  @Prop() descendants: HTMLAnimatePresenceElement[] = [];

  private ancestor: HTMLAnimatePresenceElement;
  private flipCache = new Map();

  @Prop({ attribute: '__unstable-flip' }) flip: boolean = false;

  /**
   * If `true` (default), a MutationObserver will automatically be connected to enable animations when a child node enters/exits.
   *
   * If you know the children are static (typical `animated-route-switch` use case), `false` may improve performance.
   *
   * Note: `<animate-presence>` elements which are children of a parent `<animate-presence>` element will inherit this value,
   *
   * which means MutationObservers can be disabled for the entire tree by setting `observe={false}` on the top-level element.
   *
   * However, directly set values always take precedence over inherited values.
   */
  @Prop({ mutable: true }) observe: boolean;

  @Watch('observe')
  observeChanged() {
    if (this.observe) {
      this.addMO();
      this.mo.observe(this.element, {
        subtree: this.flip,
        childList: true,
        attributes: true,
        attributeOldValue: this.flip,
        attributeFilter: this.flip ? ['data-key', 'class', 'style'] : undefined,
      });
    } else {
      this.removeMO();
    }
  }

  private mo: MutationObserver;
  private getClosestParent = () => {
    const base =
      this.element.parentElement ?? (this.element.getRootNode() as any).host;
    return closest(this.element.tagName, base) as
      | HTMLAnimatePresenceElement
      | undefined;
  };

  constructor() {
    this.handleMutation = this.handleMutation.bind(this);
  }

  async componentWillLoad() {
    injectGlobalStyle();
    this.ancestor = this.getClosestParent();
    if (typeof this.observe === 'undefined') {
      this.observe = this.ancestor?.observe ?? true;
    }
    Array.from(this.element.children).map((el: HTMLElement, i) => {
      if (hasData(el, 'key')) {
        this.flipCache.set(el.dataset.key, getBounds(el));
      } else {
        setCustomProperties(el, { i });
        el.style.setProperty('animation-play-state', 'paused');
        (el as HTMLElement).dataset.enter = '';
      }
    });
  }

  async componentDidLoad() {
    this.observeChanged();
    this.ancestor?.registerChild(this.element);
    if (!this.ancestor) {
      this.enter();
    }
  }

  async componentDidUnload() {
    this.removeMO();
    this.ancestor?.unregisterChild(this.__presenceKey);
    this.descendants = [];
  }

  private async enterNode(el: HTMLElement, i: number = 0) {
    if (hasData(el, 'key')) {
      return this.handleFlip(el);
    }

    delete el.dataset.exit;
    const event = new CustomEvent('animatePresenceEnter', {
      bubbles: true,
      detail: {
        i,
        hold: hold(el),
      },
    });
    el.dispatchEvent(event);
    el.style.removeProperty('animation-play-state');
    el.dataset.enter = '';
    setCustomProperties(el, { i });

    await presence(el, {
      afterSelf: async () => {
        delete el.dataset.enter;
        el.style.removeProperty('--i');
      },
    });

    return enterChildren(el);
  }

  private async exitNode(
    el: HTMLElement,
    method: 'remove' | 'hide' = 'remove',
    i: number = 0
  ) {
    const handleEnd = () => {
      if (method === 'remove') {
        el.remove();
      } else if (method === 'hide') {
        el.style.setProperty('visibility', 'hidden');
      }
    };
    if (hasData(el, 'key')) {
      this.flipCache.set(el.dataset.key, getBounds(el));
      handleEnd();
      return Promise.resolve();
    }

    await exitChildren(el);

    delete el.dataset.willExit;
    setCustomProperties(el, { i });
    const event = new CustomEvent('animatePresenceExit', {
      bubbles: true,
      detail: {
        i,
        hold: hold(el),
      },
    });
    el.dispatchEvent(event);
    el.dataset.exit = '';

    await presence(el, {
      afterSelf: handleEnd,
    });

    return Promise.resolve();
  }

  // private async flipNode(el: HTMLElement) {
  //   if (hasData(el, 'flip')) return;
  //   const prev = this.flipCache.get(el.dataset.key);
  //   const curr = getStyle(el);
  //   const initialStyle = el.getAttribute('style');

  //   const diff = diffStyles(curr, prev);

  //   if (Object.keys(diff).length > 0) {
  //     for (const [key, { previous }] of Object.entries(diff)) {
  //       el.style.setProperty(key, `${previous}`);
  //     }
  //     await Promise.resolve();
  //     el.dataset.flip = '';
  //     await presence(el, {
  //       init: () => {
  //         el.setAttribute('style', initialStyle);
  //       },
  //       afterSelf: () => {
  //         delete el.dataset.flip;
  //         this.flipCache.set(el.dataset.key, curr);
  //       },
  //       onCancel: () => {
  //         this.flipCache.set(el.dataset.key, {});
  //         delete el.dataset.flip;
  //       },
  //     });
  //   } else {
  //     this.flipCache.set(el.dataset.key, curr);
  //   }
  // }

  private async handleEnter(node: Node, _record: MutationRecord, i?: number) {
    if (!isHTMLElement(node)) return;
    if (hasData(node, 'exit')) return;

    if (hasData(node, 'willExit')) {
      return this.exitNode(node, 'remove', i);
    } else {
      return this.enterNode(node, i);
    }
  }

  private async handleExit(node: Node, record: MutationRecord, i?: number) {
    if (!isHTMLElement(node)) return;
    if (hasData(node, 'exit') || hasData(node, 'willExit')) {
      return;
    }

    node.dataset.willExit = '';
    setCustomProperties(node, { i });

    if (isHTMLElement(record.previousSibling)) {
      record.previousSibling.insertAdjacentElement('afterend', node);
    } else if (isHTMLElement(record.target)) {
      record.target.prepend(node);
    }
  }

  private async handleFlip(node: Node) {
    if (!isHTMLElement(node)) return;
    if (!hasData(node, 'key')) return;

    const key = node.dataset.key;
    if (hasData(node, 'flip')) return;

    const prev = this.flipCache.get(key);
    const curr = getBounds(node);

    if (prev.width === 0 && prev.height === 0) {
      this.flipCache.set(key, curr);
      return;
    }

    if (!hasData(node, 'willFlip')) {
      const delta = getDelta(prev, curr);
      console.log(delta);

      node.dataset.willFlip = '';
      node.style.setProperty(
        'transform',
        `translate(${delta.left}px, ${delta.top}px) scale(${delta.width}, ${delta.height})`
      );
      await new Promise(resolve =>
        requestAnimationFrame(() => requestAnimationFrame(resolve))
      );
      node.dataset.flip = '';
      await new Promise(resolve =>
        requestAnimationFrame(() => requestAnimationFrame(resolve))
      );

      await presence(node, {
        init: () => {
          node.style.removeProperty('transform');
          delete node.dataset.willFlip;
        },
        afterSelf: async () => {
          this.flipCache.set(key, curr);
          delete node.dataset.flip;
        },
        onCancel() {
          node.dataset.flip = 'continue';
        },
      });
    }
  }

  private handleMutation(records: MutationRecord[]) {
    let i = 0;
    for (const record of records.reverse()) {
      if (record.addedNodes.length === 1) {
        this.handleEnter(record.addedNodes[0], record, records.length - 1 - i);
      }
      if (record.removedNodes.length === 1) {
        this.handleExit(record.removedNodes[0], record, i);
      }

      if (
        record.type === 'attributes' &&
        record.attributeName &&
        ['class', 'style'].includes(record.attributeName)
      ) {
        const el = record.target;
        if (isHTMLElement(el)) this.handleFlip(el);
      }
      i++;
    }
  }

  private addMO() {
    if (!this.mo) {
      if ('MutationObserver' in window) {
        this.mo = new MutationObserver(this.handleMutation);
        this.observeChanged();
      }
    }
  }

  private removeMO() {
    if (this.mo) {
      this.mo.disconnect();
      this.mo = undefined;
    }
  }

  /** @internal Registers a child element across shadow boundaries */
  @Method()
  async registerChild(el: HTMLAnimatePresenceElement) {
    const key = el.__presenceKey;
    // Remove existing elements with same key to handle HMR
    this.descendants = [
      ...this.descendants.filter(element => element.__presenceKey !== key),
      el,
    ];
    return;
  }

  /** @internal */
  @Method()
  async unregisterChild(key: string) {
    this.descendants = this.descendants.filter(el => el.__presenceKey !== key);
    return;
  }

  /**
   * Fires when all exiting nodes have completed animating out.
   *
   * To simplify listener behavior, this event bubbles, but never beyond the closest `<animate-presence>` parent.
   */
  @Event() animatePresenceExitComplete: EventEmitter<void>;

  /**
   * Dispatched on a child when it enters. `event.target` is the entering child element.
   *
   * It is recommended to use an animation handler created with `createPresenceHandler` for this event.
   */
  @Event() animatePresenceEnter: EventEmitter<{ i: number }>;

  /**
   * Dispatched on a child when it exits. `event.target` is the exiting child element.
   *
   * It is recommended to use an animation handler created with `createPresenceHandler` for this event.
   */
  @Event() animatePresenceExit: EventEmitter<{ i: number }>;

  private willExit: boolean = false;
  private didExit: boolean = false;

  @Listen('animatePresenceExitComplete')
  protected animatePresenceExitCompleteHandler(event: CustomEvent) {
    event.stopPropagation();
  }

  /**
   * Programmatically triggers an exit.
   *
   * Nested `<animate-presence>` children will be animated out from the bottom up, meaning that children elements trigger a parent's exit after their own exit finishes.
   */
  @Method()
  async exit() {
    if (this.didExit || this.willExit) return;
    this.willExit = true;
    await Promise.all(
      Array.from(this.element.children)
        .reverse()
        .map((el, i) => this.exitNode(el as HTMLElement, 'hide', i))
    );
    this.didExit = true;
    this.willExit = false;
    this.animatePresenceExitComplete.emit();
    return Promise.resolve();
  }

  private willEnter: boolean = false;
  private didEnter: boolean = false;

  /**
   * Programmatically triggers an entrance.
   *
   * Nested `<animate-presence>` children will be animated in from the top down, meaning that parent elements trigger a child's entrance after their own entrance finishes.
   */
  @Method()
  async enter() {
    this.didExit = false;
    this.willExit = false;
    if (this.didEnter || this.willEnter) return;
    this.willEnter = true;
    await Promise.all(
      Array.from(this.element.children).map((el, i) =>
        this.enterNode(el as HTMLElement, i)
      )
    );
    await enterChildren(this.element);
    this.didEnter = true;
    this.willEnter = false;
    return Promise.resolve();
  }

  render() {
    return (
      <Host style={{ display: 'contents' }}>
        <slot />
      </Host>
    );
  }
}
let ids = 0;
