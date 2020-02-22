import { Component, h, Element, Host, Prop, Watch, Method } from "@stencil/core";
import { setCustomProperties, isHTMLElement, hasData, presence } from "../../utils";

const willExit = (el: HTMLElement, i?: number) => {
  el.dataset.willExit = '';
  setCustomProperties(el, { i });
}

@Component({
  tag: "animate-presence",
  shadow: true
})
export class AnimatePresence {
  @Element() element: HTMLElement;

  @Prop() observe: boolean = true;
  @Prop() shallow: boolean = true;

  @Watch("observe")
  observeChanged() {
    if (!this.mo) return;

    if (this.observe) {
      this.mo.observe(this.element, {
        childList: true,
        subtree: this.shallow,
        attributes: true,
        attributeFilter: ["data-key", "data-will-exit"]
      });
    } else {
      this.mo.disconnect();
    }
  }

  private mo: MutationObserver;

  constructor() {
    this.handleMutation = this.handleMutation.bind(this);
  }

  componentDidLoad() {
    this.addMO();
  }

  disconnectedCallback() {
    this.mo.disconnect();
    this.mo = undefined;
  }

  async enterNode(el: HTMLElement, i?: number) {
    el.dataset.initial = "";
    el.dataset.enter = "";
    setCustomProperties(el, { i });

    await presence(el, {
      afterSelf: () => {
        delete el.dataset.initial;
        delete el.dataset.enter;
        el.style.removeProperty('--i');
      }
    });
  }

  async exitNode(el: HTMLElement) {
    delete el.dataset.willExit;
    el.dataset.exit = "";

    await presence(el, {
      afterSelf: () => el.remove()
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

  @Method()
  async exit() {}

  @Method()
  async enter() {}

  render() {
    return (
      <Host style={{ display: "contents" }}>
        <slot />
      </Host>
    );
  }
}
