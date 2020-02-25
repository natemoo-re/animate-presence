import { Component, h, Host, Prop } from '@stencil/core';


@Component({
    tag: 'test-item',
    styleUrl: 'item.css'
})
export class Item {

    @Prop() index: number = 0;

    render() {
        return (
          <Host class="item">
            <animate-presence>
              {Array.from({ length: this.index }, () => (
                  <div class="dot" />
              ))}
              <slot />
            </animate-presence>
          </Host>
        );
    }
}
