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
      <div>
        <header>
          <h1>Stencil App Starter</h1>
        </header>

        <main>
          <stencil-router>
            <animated-route-switch location={this.location}>
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