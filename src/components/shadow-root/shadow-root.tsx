import { Component, h } from '@stencil/core';


@Component({
    tag: 'shadow-root',
    styleUrl: 'shadow-root.css',
    shadow: true
})
export class ShadowRoot {
    render() {
        return (
          <div>
            <animate-presence>
              <slot />
            </animate-presence>
          </div>
        );
    }
}
