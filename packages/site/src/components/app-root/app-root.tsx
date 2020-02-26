import { Component, h, Prop } from '@stencil/core';
import { injectHistory, LocationSegments } from '@stencil/router';

@Component({
  tag: "app-root",
  styleUrl: "app-root.css",
  scoped: true
})
export class AppRoot {
  @Prop() location: LocationSegments;

  render() {
    return (
      <main>
        <stencil-router>
          <animated-route-switch location={this.location}>
            <stencil-route url="/" exact={true} component="app-home" />
            <stencil-route url="/profile/:name" component="app-profile" />
          </animated-route-switch>
        </stencil-router>
      </main>
    );
  }
}
injectHistory(AppRoot);