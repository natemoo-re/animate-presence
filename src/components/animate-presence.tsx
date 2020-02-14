import { Component, h, Element, Host, Prop, Watch } from '@stencil/core';


const isHTMLElement = (node: Node): node is HTMLElement => node && node.nodeType === node.ELEMENT_NODE && typeof (node as HTMLElement).tagName !== 'undefined';
const is = (el: HTMLElement, key: string) => typeof el.dataset[key] !== 'undefined';

const presence = async (element: HTMLElement) => new Promise(resolve => {
    const onEnd = () => {
      element.removeEventListener('transitionend', onEnd);
      element.removeEventListener("animationend", onEnd);
      resolve();
    }
    element.addEventListener("transitionend", onEnd);
    element.addEventListener("animationend", onEnd);
})

@Component({
  tag: "animate-presence",
  shadow: true
})
export class AnimatePresence {
  @Element() element: HTMLElement;

  @Prop({ attribute: "mount" }) observeMount: boolean = true;
  @Prop({ attribute: "unmount" }) observeUnmount: boolean = true;
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
        attributeFilter: ["data-key", "data-unmounting"]
      });
    } else {
      this.mo.disconnect();
    }
  }

  private mo: MutationObserver;

  constructor() {
    this.handleMutation = this.handleMutation.bind(this);
    this.handleMount = this.handleMount.bind(this);
    this.handleUnmount = this.handleUnmount.bind(this);
  }

  componentDidLoad() {
    this.addMO();
  }

  componentDidUnload() {
    this.mo.disconnect();
    this.mo = undefined;
  }

  async mount(el: HTMLElement) {
    el.dataset.mount = "";
    await presence(el);
    delete el.dataset.mount;
    console.log("mount");
  }

  async unmount(el: HTMLElement) {
    delete el.dataset.unmounting;
    setTimeout(() => (el.dataset.unmount = ""), 0);
    await presence(el);
    el.remove();
  }

  async handleMount(node: Node, _record: MutationRecord) {
    if (!isHTMLElement(node)) return;
    if (is(node, "unmount")) return;

    if (is(node, "unmounting")) {
      return this.unmount(node);
    } else if (this.observeMount) {
      return this.mount(node);
    }
  }

  async handleUnmount(node: Node, record: MutationRecord) {
    if (!isHTMLElement(node)) return;
    if (is(node, "unmount") || is(node, "unmounting")) {
      console.log("unmount");
      return;
    }

    node.dataset.unmounting = "";
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

    await this.unmount(node);
    delete node.dataset.unmount;
    if (isHTMLElement(sibling)) {
      sibling.insertAdjacentElement("afterend", node);
    } else {
      parent.prepend(node);
    }
    await this.mount(node);
    console.log("keychange", node, record);
  }

  handleMutation(records: MutationRecord[]) {
    for (const record of records.reverse()) {
      if (record.type === "attributes") {
        if (record.attributeName === "data-unmounting") {
          this.unmount(record.target as HTMLElement);
        } else {
          this.handleKeyChange(record.target, record);
        }
      }
      if (record.addedNodes.length === 1) {
        this.handleMount(record.addedNodes[0], record);
      }
      if (this.observeUnmount && record.removedNodes.length === 1) {
        this.handleUnmount(record.removedNodes[0], record);
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

  render() {
    return (
      <Host style={{ display: 'contents' }}>
        <slot />
      </Host>
    );
  }
}
