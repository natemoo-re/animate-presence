import { Component, h, State, Watch } from '@stencil/core';


@Component({
  tag: "list-demo",
  styleUrl: "list.css"
})
export class List {
  
  @State() items: number[] = [0, 1];
  @State() batch = false;
  @Watch('items')
  itemsChanged() {
      this.batch = this.items.length % 5 === 0;
  }

  render() {
    return (
      <main>
        <div class="buttons">
          <button
            id="add"
            onClick={() => {
              const max = Math.max(...this.items, 0);
              this.items = !this.batch
                ? [...this.items, max + 1]
                : [...this.items, max + 1, max + 2, max + 3, max + 4];
            }}
          >
            Add {this.batch ? "a few" : ""}
          </button>
          <button
            id="remove"
            onClick={() => {
              this.items = !this.batch
                ? this.items.slice(0, -1)
                : this.items.slice(0, -3);
            }}
          >
            Remove {this.batch ? "a few" : ""}
          </button>
          <button
            id="move"
            onClick={() => {
              this.items = [...this.items.slice(1), ...this.items.slice(0, 1)];
            }}
          >
            Move item to end
          </button>
        </div>
        <animate-presence>
          {this.items.map(i => (
            <test-item class="item" data-key={i}>
              Item {i + 1}
            </test-item>
          ))}
        </animate-presence>
      </main>
    );
  }
}
