<div align="center">
    <img src="https://raw.githubusercontent.com/natemoo-re/animate-presence/master/.github/assets/logo.svg?sanitize=true" alt="Animate Presence" width="175" style="margin:0 auto;"/>
</div>
<h3 align="center" style="text-align:center;">Effortless element entrance/exit animations.</h3>

<h3 align="center" style="text-align:center;color:#eee">
  <a href="https://github.com/natemoo-re/animate-presence">
    <img src="https://raw.githubusercontent.com/natemoo-re/animate-presence/master/.github/assets/logo-github.svg?sanitize=true" alt="GitHub" height="24"/>
  </a>
  &nbsp;/&nbsp;
  <a href="https://www.npmjs.com/package/animate-presence">
    <img src="https://raw.githubusercontent.com/natemoo-re/animate-presence/master/.github/assets/logo-npm.svg?sanitize=true" alt="NPM" height="24"/>
  </a>
  &nbsp;/&nbsp;
  <a href="https://animate-presence.now.sh/">
    <img src="https://raw.githubusercontent.com/natemoo-re/animate-presence/master/.github/assets/learn.svg?sanitize=true" alt="Examples" height="24"/>
  </a>
</h3>

<br />

---

Unlike most animation libraries, there's no new API to learn&mdash;just use CSS or the [Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API/Using_the_Web_Animations_API).

Here's a basic example:

```html
<animate-presence>
  <div class="item">Item A</div>
  <div class="item">Item B</div>
  <div class="item">Item C</div>
</animate-presence>

<style>
  .item[data-enter] {
    animation: fade 1s ease-in;
  }
  .item[data-exit] {
    animation: fade 1s ease-out reverse;
  }
  @keyframes fade {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
</style>
```

As child elements are added or removed, `data-enter` and `data-exit` attributes are automatically applied.

Using CSS, you can use these attributes as hooks to apply an animation or transition.

Once the animation finishes, `<animate-presence>` automatically cleans itself up, removing the attribute and any listeners.

## Attributes

| Attribute    | Description                                                                                                                    |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| `data-enter` | Applied immediately when a node enters. Trigger your entrance animation here.                                                  |
| `data-exit`  | Applied when a node will be removed. Trigger your exit animations here. The node will be removed when the animation completes. |

> **Note** Animate Presence overrides the default `animation-fill-mode` of animating children to `both` (rather than `none`).
> This provides more reasonable default behavior in most situations, so the rule is injected with a [specificity](https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity) (`021`) high enough to override the `animation` shorthand for most rules (like `.item[data-enter]`).

> If you experience visual flickering at the start or end of an animation, you may be using a selector with a higher specificity than `021`.
> The `animation` shorthand resets the `animation-fill-mode` to `none`, so you likely need to manually specify `both`.

## Stagger

When multiple elements enter/exit, Animate Presence automatically sets a custom property, `--i`, on each child.

This makes staggered animations simple with a small `calc` function.

```css
[data-enter] {
  animation-delay: calc(var(--i, 0) * 50ms);
}
```

## Nesting

Animate Presence uses a tree-based approach, meaning that nested `animate-presence` elements are aware of their parents and children.

**Enter** animations are applied top-down, meaning the top-level parent enters, which triggers the next child entrance, and so on.

**Exit** animations are applied bottom-up, meaning the deepest child exits, which triggers the next parent exit, and so on.

> Animate Presence relies on `querySelectorAll` to construct the internal tree, so it does not (yet) work with Shadow Roots.
> This is an area I'm actively looking into.

## Usage with [@stencil/router](https://github.com/ionic-team/stencil-router)

For Stencil apps using `@stencil/router`, Animate Presence has an `<animated-route-switch>` component which allows you to smoothly animate between routes.

1. Swap your `<stencil-route-switch>` component with `<animated-route-switch>`

2. Due to a current bug in `@stencil/router`, you will need to use `injectHistory` to pass `location` down to `animated-route-switch`.

   Hopefully this will be fixed soon, but there's a simple work around for now.

```tsx
import { Component, h, Prop } from '@stencil/core';
import { injectHistory, LocationSegments } from '@stencil/router';

@Component({
  tag: 'app-root',
  styleUrl: 'app-root.css',
  scoped: true,
})
export class AppRoot {
  @Prop() location: LocationSegments;

  render() {
    return (
      <div>
        <header>
          <h1>Stencil App Starter</h1>
        </header>

        <main>
          <stencil-router>
            {/* Pass `location` to animated-route-switch */}
            <animated-route-switch location={this.location}>
              {/* <animate-presence> should exist somewhere within these components */}
              <stencil-route url="/" exact={true} component="app-home" />
              <stencil-route url="/profile/:name" component="app-profile" />
            </animated-route-switch>
          </stencil-router>
        </main>
      </div>
    );
  }
}
injectHistory(AppRoot);
```

3. Apply your animations on `[data-enter]` and `[data-exit]` as usual.

> As noted above, if your Stencil components rely on `shadow` encapsulation, Animate Presence won't work as expected (yet). I'm working on it.
> For now, you can either use `scoped` encapsulation or stay tuned for updates!
