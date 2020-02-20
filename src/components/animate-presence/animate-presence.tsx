import { Component, h, Element, Host, Prop, Watch, Method, Event, EventEmitter } from '@stencil/core';
import { presence, nextTick } from "../../utils";

const isHTMLElement = (node: Node): node is HTMLElement => node && node.nodeType === node.ELEMENT_NODE && typeof (node as HTMLElement).tagName !== 'undefined';
const is = (el: HTMLElement, key: string) => typeof el.dataset[key] !== 'undefined';

@Component({
  tag: "animate-presence"
})
export class AnimatePresence {
  @Prop({ mutable: true }) registry: HTMLAnimatePresenceElement[] = [];

  @Watch("registry")
  registryChanged() {
    const { registry } = this;
    console.log("registry changed to ", registry);
  }

  @Element() element: HTMLElement;

  /** By setting initial to `false`, children present when `<animate-presence>` first loads will not use `enter` animations.
   * Only elements that enter after the initial render will animate in.
   */
  @Prop({ attribute: "initial" }) initial = true;

  /** staggerChildren will automatically pass a CSS custom property to each child (`--i`) */
  @Prop() staggerChildren = true;

  @Prop() observe: boolean = true;
  @Prop() shallow: boolean = true;

  /** Fires when all exiting nodes have completed animating out. */
  @Event() exitComplete: EventEmitter<void>;

  private _id: number;

  @Watch("observe")
  observeChanged() {
    if (!this.mo) return;

    if (this.observe) {
      this.mo.observe(this.element, {
        childList: true,
        // subtree: true,
        attributes: true,
        attributeOldValue: true,
        attributeFilter: ["data-key"]
      });
    } else {
      this.removeMO();
    }
  }

  private mo: MutationObserver;
  private parent: any;

  constructor() {
    this.handleMutation = this.handleMutation.bind(this);
    this.handleEnter = this.handleEnter.bind(this);
    this.handleExit = this.handleExit.bind(this);
  }

  async componentDidLoad() {
    this.addMO();
    if (this.initial) {
      this.animateEnter();
    }

    console.log(this.getChildren());

    const parent = this.element.parentElement.closest("animate-presence");
    // ?? this.element.parentElement.closest("animated-route-switch");

    if (!parent) return;
    this.parent = parent;
    const self = this.element as HTMLAnimatePresenceElement;
    this._id = await parent.registerChild(self);
  }

  componentDidUnload() {
    this.removeMO();
    if (!this.parent) return;
    this.parent.unregisterChild(this._id);
  }

  animateEnter() {
    const elements = Array.from(this.element.children).filter(x =>
      isHTMLElement(x)
    ) as HTMLElement[];

    for (let i = 0; i < elements.length; i++) {
      const el = elements[i];
      el.style.setProperty("--i", `${i}`);
      el.dataset.initial = "";
      this.enterNode(el);
    }
  }

  async enterNode(el: HTMLElement) {
    await presence(el, {
      afterChildren: () => {
        el.dataset.enter = "";
      },
      afterSelf: () => {
        delete el.dataset.initial;
        delete el.dataset.enter;
        el.style.removeProperty("--i");
      }
    });
  }

  exiting = new WeakMap();

  exitNode = async (
    el: HTMLElement,
    onRemove = (el: HTMLElement) => el.remove()
  ) => {
    delete el.dataset.enter;
    delete el.dataset.initial;
    if (this.exiting.has(el)) return;
    
    delete el.dataset.willExit;
    this.exiting.set(el, true);
    return nextTick(async () => {
      await presence(el, {
        afterChildren: () => {
          el.dataset.exit = "";
        },
        afterSelf: () => {
          onRemove(el);
          this.exiting.delete(el);
        }
      });
    });
  };

  @Method()
  async registerChild(child) {
    const id = this.registry.length;
    this.registry = [...this.registry, child];
    return id;
  }

  @Method()
  async unregisterChild(id: any) {
    this.registry = this.registry.filter(child => child.id !== id);
  }

  _positioning = false;
  async position(el: HTMLElement) {
    this._positioning = true;
    nextTick(async () => {
      el.dataset.position = "";
      el.style.transform = `translate(0, 0)`;
      el.style.transitionProperty = "transform";
      await presence(el, {
        afterSelf: () => {
          delete el.dataset.position;
          el.style.removeProperty("transform");
          el.style.removeProperty("transition-property");
          el.style.removeProperty("--distance");
          this._positioning = false;
        }
      });
    });
  }

  async handleEnter(node: Node, record: MutationRecord, i?: number) {
    if (!isHTMLElement(node)) return;
    if (is(node, "exit")) return;

    if (is(node, "willExit")) {
      const target = record.target as HTMLElement;
      await this.exitNode(node);
      if (target.tagName === "STENCIL-ROUTE") {
        target.style.setProperty("display", "none");
      }
    } else {
      if (typeof i === "number") {
        node.style.setProperty("--i", `${i}`);
        node.dataset.initial = "";
      }
      await this.enterNode(node);
      return;
    }
  }

  handleExit(node: Node, record: MutationRecord, i?: number) {
    if (!isHTMLElement(node)) return;
    if (is(node, "exit") || is(node, "willExit")) return;

    console.log('will exit', node);

    node.dataset.willExit = "";
    if (typeof i === "number") {
      node.style.setProperty("--i", `${i}`);
    }
    if (isHTMLElement(record.previousSibling)) {
      record.previousSibling.insertAdjacentElement("afterend", node);
    } else if (isHTMLElement(record.target)) {
      record.target.prepend(node);
    }
  }

  async handlePositionTransition(records: MutationRecord[]) {
    if (records.length === 0 || this._positioning) return;
    let positions = new Map<string, any>();
    for (const record of records) {
      if (!isHTMLElement(record.target)) return;
      const from = record.target.dataset.key;
      const current = record.oldValue;
      const { left: x, top: y } = record.target.getBoundingClientRect();
      positions.set(current, { to: { x, y }, from, target: record.target });
    }

    const deltas = new Map<
      HTMLElement,
      { x: number; y: number; distX: number; distY: number }
    >();
    const uniqueX: number[] = [];
    const uniqueY: number[] = [];
    for (const { to, from: fromKey, target } of positions.values()) {
      const from = positions.get(fromKey)?.to ?? to;
      const deltaX = from.x - to.x;
      const distX = Math.abs(deltaX);
      if (!uniqueX.includes(distX)) uniqueX.push(distX);
      const deltaY = from.y - to.y;
      const distY = Math.abs(deltaY);
      if (!uniqueY.includes(distY)) uniqueY.push(distY);
      deltas.set(target, { x: deltaX, y: deltaY, distX, distY });
    }

    const getRelativeDistance = (distances: number[], value: number) => {
      if (distances.length === 1) return 1;
      const min = Math.min(...distances.filter(v => v !== 0));
      return value / min;
    };

    for (const [target, { x, y, distX, distY }] of deltas.entries()) {
      // TODO: calculate delta based on distanceX, distanceY
      const relX = getRelativeDistance(uniqueX, distX);
      const relY = getRelativeDistance(uniqueY, distY);
      console.log({ x, y }, { relX, relY });

      target.style.transform = `translate(${x}px, ${y}px)`;
      target.style.setProperty("--distance", `${relY === 1 ? 0 : relY}`);
      this.position(target);
    }
  }

  handleMutation(records: MutationRecord[]) {
    const multi = records.length > 1;
    const stagger = multi && this.staggerChildren;
    let i = 0;

    this.handlePositionTransition(
      records.filter(({ type }) => type === "attributes")
    );

    console.log(records);

    for (const record of records
      .filter(({ type }) => type !== "attributes")
      .reverse()) {
      if (!isHTMLElement(record.target)) return;

      if (record.addedNodes.length === 1) {
        this.handleEnter(
          record.addedNodes[0],
          record,
          stagger ? records.length - i : undefined
        );
      }
      if (record.removedNodes.length === 1) {
        this.handleExit(
          record.removedNodes[0],
          record,
          stagger ? i : undefined
        );
      }
      i++;
    }
  }

  private addMO() {
    if (!this.mo) {
      if ("MutationObserver" in window) {
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

  private getChildren() {
    let children: HTMLElement[] = [];
    for (const child of Array.from(this.element.children)) {
      if (child.tagName === "SLOT") {
        children.push(
          ...Array.from(
            ((child as HTMLSlotElement)
              .assignedElements as unknown) as HTMLElement[]
          )
        );
      } else {
        children.push(child as HTMLElement);
      }
    }
    return children;
  }

  @Method()
  async exit() {
    console.log('exit');
    this.removeMO();
    const nestedChildren = this.registry;
    const children = this.getChildren().reverse();
    await Promise.all(nestedChildren.map(el => el.exit()));
    await Promise.all(
      children.map((el, index) => {
        if (this.staggerChildren) {
          (el as HTMLElement).style.setProperty("--i", `${index}`);
        }
        return this.exitNode(
          el as HTMLElement,
          el => (el.style.visibility = "hidden")
        );
      })
    );
    this.exitComplete.emit();
    return Promise.resolve();
  }

  render() {
    return (
      <Host style={{ display: "contents" }}>
        <slot />
      </Host>
    );
  }
}

// injectHistory(AnimatePresence);