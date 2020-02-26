import { Component, h, Prop } from '@stencil/core';
import { injectHistory, LocationSegments } from '@stencil/router';

@Component({
  tag: 'route-demo',
  styleUrl: 'route.css',
})
export class Route {
  @Prop() location: LocationSegments;

  render() {
    return (
      <stencil-router>
        <nav>
          <ul>
            <li>
              <stencil-route-link url="/">Home</stencil-route-link>
            </li>
            <li>
              <stencil-route-link url="/a">A</stencil-route-link>
            </li>
            <li>
              <stencil-route-link url="/b">B</stencil-route-link>
            </li>
            <li>
              <stencil-route-link url="/c">C</stencil-route-link>
            </li>
          </ul>
        </nav>

        <main>
          <stencil-route url="/">
            <animated-route-switch location={this.location}>
              <stencil-route
                url="/"
                exact={true}
                routeRender={() => (
                  <animate-presence class="home">
                    <div class="balls">
                      <animate-presence>
                        <div class="ball" />
                      </animate-presence>
                    </div>
                    <div class="item">Item A</div>
                    <div class="item">
                      <stencil-route-link url="/a">Go to /a</stencil-route-link>
                    </div>
                  </animate-presence>
                )}
              />
              <stencil-route
                url="/a"
                routeRender={() => (
                  <animate-presence class="a">
                    <div class="balls">
                      <animate-presence>
                        <div class="ball" />
                        <div class="ball" />
                      </animate-presence>
                    </div>
                    <div class="item">Item A1</div>
                    <div class="item">Item B1</div>
                    <div class="item">
                      <stencil-route-link url="/b">Go to /b</stencil-route-link>
                    </div>
                  </animate-presence>
                )}
              />
              <stencil-route
                url="/b"
                routeRender={() => (
                  <animate-presence class="b">
                    <div class="balls">
                      <animate-presence>
                        <div class="ball" />
                        <div class="ball" />
                        <div class="ball" />
                      </animate-presence>
                    </div>
                    <div class="item">Item A2</div>
                    <div class="item">Item B2</div>
                    <div class="item">Item C2</div>
                    <div class="item">
                      <stencil-route-link url="/c">Go to /c</stencil-route-link>
                    </div>
                  </animate-presence>
                )}
              />
              <stencil-route
                url="/c"
                routeRender={() => (
                  <animate-presence class="c">
                    <div class="balls">
                      <animate-presence>
                        <div class="ball" />
                        <div class="ball" />
                        <div class="ball" />
                        <div class="ball" />
                      </animate-presence>
                    </div>
                    <div class="item">Item A3</div>
                    <div class="item">Item B3</div>
                    <div class="item">Item C3</div>
                    <div class="item">Item D3</div>
                    <div class="item">
                      <stencil-route-link url="/">Go Home</stencil-route-link>
                    </div>
                  </animate-presence>
                )}
              />
            </animated-route-switch>
          </stencil-route>
        </main>
      </stencil-router>
    );
  }
}
injectHistory(Route);
