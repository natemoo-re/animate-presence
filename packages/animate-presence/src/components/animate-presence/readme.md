# animate-presence

<!-- Auto Generated Below -->

## Properties

| Property           | Attribute           | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | Type                         | Default     |
| ------------------ | ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- | ----------- |
| `observe`          | `observe`           | If `true` (default), a MutationObserver will automatically be connected to enable animations when a child node enters/exits. If you know the children are static (typical `animated-route-switch` use case), `false` may improve performance. Note: `<animate-presence>` elements which are children of a parent `<animate-presence>` element will inherit this value, which means MutationObservers can be disabled for the entire tree by setting `observe={false}` on the top-level element. However, directly set values always take precedence over inherited values. | `boolean`                    | `undefined` |
| `orchestrate`      | `orchestrate`       | Changes the behavior of nested `<animate-presence>` elements. `sequential` (default) will enter from the top-down and exit from the bottom-up. `parallel` will trigger all entrances and exits in parallel Note: `<animate-presence>` elements which are children of a parent `<animate-presence>` element will inherit this value,                                                                                                                                                                                                                                        | `"parallel" \| "sequential"` | `undefined` |
| `orchestrateEnter` | `orchestrate-enter` |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | `"parallel" \| "sequential"` | `undefined` |
| `orchestrateExit`  | `orchestrate-exit`  |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | `"parallel" \| "sequential"` | `undefined` |

## Events

| Event                         | Description                                                                                                                                                                            | Type                          |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| `animatePresenceEnter`        | Dispatched on a child when it enters. `event.target` is the entering child element. It is recommended to use an animation handler created with `createPresenceHandler` for this event. | `CustomEvent<{ i: number; }>` |
| `animatePresenceExit`         | Dispatched on a child when it exits. `event.target` is the exiting child element. It is recommended to use an animation handler created with `createPresenceHandler` for this event.   | `CustomEvent<{ i: number; }>` |
| `animatePresenceExitComplete` | Fires when all exiting nodes have completed animating out. To simplify listener behavior, this event bubbles, but never beyond the closest `<animate-presence>` parent.                | `CustomEvent<void>`           |

## Methods

### `enter() => Promise<void>`

Programmatically triggers an entrance.

Nested `<animate-presence>` children will be animated in from the top down, meaning that parent elements trigger a child's entrance after their own entrance finishes.

#### Returns

Type: `Promise<void>`

### `exit() => Promise<void>`

Programmatically triggers an exit.

Nested `<animate-presence>` children will be animated out from the bottom up, meaning that children elements trigger a parent's exit after their own exit finishes.

#### Returns

Type: `Promise<void>`

---

_Built with [StencilJS](https://stenciljs.com/)_
