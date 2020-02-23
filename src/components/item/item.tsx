import { Component, h, Host } from '@stencil/core';


@Component({
    tag: 'test-item',
    styleUrl: 'item.css'
})
export class Item {

    render() {
        return (
          <Host class="item">
            <animate-presence>
              <div class="dot" />
              <div class="dot" />
              <div class="dot" />
              <slot />
            </animate-presence>
          </Host>
        );
    }
}
