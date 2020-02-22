import { Component, h, Element, Host, Prop, Watch, Method } from "@stencil/core";

const isHTMLElement = (node: Node): node is HTMLElement =>
  node &&
  node.nodeType === node.ELEMENT_NODE &&
  typeof (node as HTMLElement).tagName !== "undefined";
const is = (el: HTMLElement, key: string) =>
  typeof el.dataset[key] !== "undefined";

const presence = async (element: HTMLElement) =>
  new Promise(resolve => {
    const onEnd = () => {
      element.removeEventListener("transitionend", onEnd);
      element.removeEventListener("animationend", onEnd);
      resolve();
    };
    element.addEventListener("transitionend", onEnd);
    element.addEventListener("animationend", onEnd);
  });

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

  componentDidUnload() {
    this.mo.disconnect();
    this.mo = undefined;
  }

  async enterNode(el: HTMLElement) {
    el.dataset.enter = "";
    await presence(el);
    delete el.dataset.enter;
    console.log("enter");
  }

  async exitNode(el: HTMLElement) {
    delete el.dataset.willExit;
    setTimeout(() => (el.dataset.exit = ""), 0);
    await presence(el);
    el.remove();
  }

  async handleEnter(node: Node, _record: MutationRecord) {
    if (!isHTMLElement(node)) return;
    if (is(node, "exit")) return;

    if (is(node, "willExit")) {
      return this.exitNode(node);
    } else {
      return this.enterNode(node);
    }
  }

  async handleExit(node: Node, record: MutationRecord) {
    if (!isHTMLElement(node)) return;
    if (is(node, "exit") || is(node, "willExit")) {
      console.log("exit");
      return;
    }

    node.dataset.willExit = "";
    if (isHTMLElement(record.previousSibling)) {
      record.previousSibling.insertAdjacentElement("afterend", node);
    } else if (isHTMLElement(record.target)) {
      record.target.prepend(node);
    }
  }

  async handleKeyChange(node: Node, record: MutationRecord) {
    if (!isHTMLElement(node)) return;
    const sibling = node.previousSibling;
    const parent = node.parentElement;

    await this.exitNode(node);
    delete node.dataset.exit;
    if (isHTMLElement(sibling)) {
      sibling.insertAdjacentElement("afterend", node);
    } else {
      parent.prepend(node);
    }
    await this.enterNode(node);
    console.log("keychange", node, record);
  }

  handleMutation(records: MutationRecord[]) {
    for (const record of records.reverse()) {
      if (record.type === "attributes") {
        if (record.attributeName === "data-will-exit") {
          this.exitNode(record.target as HTMLElement);
        } else {
          this.handleKeyChange(record.target, record);
        }
      }
      if (record.addedNodes.length === 1) {
        this.handleEnter(record.addedNodes[0], record);
      }
      if (record.removedNodes.length === 1) {
        this.handleExit(record.removedNodes[0], record);
      }
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
  async exit() {
    
  }

  @Method()
  async enter() {
    
  }

  render() {
    return (
      <Host style={{ display: "contents" }}>
        <slot />
      </Host>
    );
  }
}
