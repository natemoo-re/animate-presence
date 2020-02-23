import { Component, h, Element, Host, Prop, Watch, Method, State } from "@stencil/core";
import { setCustomProperties, isHTMLElement, hasData, presence, closest, nextTick } from "../../utils";


const willExit = (el: HTMLElement, i?: number) => {
  el.dataset.willExit = '';
  i !== 0 && setCustomProperties(el, { i });
}

@Component({
  tag: "animate-presence",
  shadow: true
})
export class AnimatePresence {
  /** @private */
  @Prop() __presenceKey = `animate-presence-${ids++}`;

  @Element() element: HTMLAnimatePresenceElement;

  @Prop() observe: boolean = true;
  @Prop() initial: boolean = true;

  @Prop() descendants: HTMLAnimatePresenceElement[] = [];
  // @Watch("descendants")
  // async descendantsChanged(descendants) {
  //   // for (const el of descendants) {
  //   //   if (!this._entering.has(el)) {
  //   //     this._entering.set(el, true);
  //   //     el.enter();
  //   //   }
  //   // }
  // }

  private ancestor: HTMLAnimatePresenceElement;

  @Watch("observe")
  observeChanged() {
    if (!this.mo) return;

    if (this.observe) {
      this.mo.observe(this.element, {
        childList: true,
        attributes: true,
        attributeFilter: ["data-key"]
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
    this.ancestor = this.getClosestParent();
  }

  async componentDidLoad() {
    this.addMO();
    this.ancestor?.registerChild(this.element);
    Array.from(this.element.children).map(el => (el as HTMLElement).dataset.initial = '');
    if (!this.ancestor) this.enter();
  }

  async componentDidUnload() {
    this.removeMO();
    this.ancestor?.unregisterChild(this.__presenceKey);
    this.descendants = [];
  }

  async enterNode(el: HTMLElement, i?: number) {
    el.dataset.initial = "";
    el.dataset.enter = "";
    i !== 0 && setCustomProperties(el, { i });

    await presence(el, {
      afterSelf: async () => {
        delete el.dataset.initial;
        delete el.dataset.enter;
        i !== 0 && el.style.removeProperty("--i");
      }
    });

    const children = Array.from(el.querySelectorAll("animate-presence"));
    console.log(children);
    return Promise.all(children.map(child => child.enter()));
  }

  async exitNode(
    el: HTMLElement,
    method: "remove" | "hide" = "remove",
    i?: number
  ) {
    await Promise.all(
      Array.from(el.querySelectorAll("animate-presence")).map(el => el.exit())
    );
    return presence(el, {
      afterChildren: async () => {
        delete el.dataset.willExit;
        i !== 0 && setCustomProperties(el, { i });
        el.dataset.exit = "";
      },
      afterSelf: () => {
        if (method === "remove") {
          el.remove();
        } else if (method === "hide") {
          el.style.setProperty("visibility", "hidden");
        }
      }
    });
  }

  async handleEnter(node: Node, _record: MutationRecord, i?: number) {
    if (!isHTMLElement(node)) return;
    if (hasData(node, "exit")) return;

    if (hasData(node, "willExit")) {
      return this.exitNode(node);
    } else {
      return this.enterNode(node, i);
    }
  }

  async handleExit(node: Node, record: MutationRecord, i?: number) {
    if (!isHTMLElement(node)) return;
    if (hasData(node, "exit") || hasData(node, "willExit")) {
      return;
    }

    willExit(node, i);
    if (isHTMLElement(record.previousSibling)) {
      record.previousSibling.insertAdjacentElement("afterend", node);
    } else if (isHTMLElement(record.target)) {
      record.target.prepend(node);
    }
  }

  handleMutation(records: MutationRecord[]) {
    let i = 0;
    for (const record of records.reverse()) {
      if (record.addedNodes.length === 1) {
        this.handleEnter(record.addedNodes[0], record, records.length - i);
      }
      if (record.removedNodes.length === 1) {
        this.handleExit(record.removedNodes[0], record, i);
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

  @Method()
  async registerChild(el: HTMLAnimatePresenceElement) {
    const key = el.__presenceKey;
    // Remove existing elements with same key to handle HMR
    this.descendants = [
      ...this.descendants.filter(element => element.__presenceKey !== key),
      el
    ];
    return;
  }

  @Method()
  async unregisterChild(key: string) {
    this.descendants = this.descendants.filter(el => el.__presenceKey !== key);
    return;
  }

  @Method()
  async exit() {
    return Promise.all(
      Array.from(this.element.children).map((el, i) =>
        this.exitNode(el as HTMLElement, "hide", i)
      )
    );
  }

  private willEnter: boolean = false;
  private didEnter: boolean = false;

  @Method()
  async enter() {
    if (this.didEnter || this.willEnter) return;
    this.willEnter = true;
    await Promise.all(
      Array.from(this.element.children).map((el, i) =>
        this.enterNode(el as HTMLElement, i)
      )
    );
    await Promise.all(
      Array.from(this.element.querySelectorAll("animate-presence")).map(el =>
        el.enter()
      )
    );
    this.didEnter = true;
    this.willEnter = false;
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
let ids = 0;