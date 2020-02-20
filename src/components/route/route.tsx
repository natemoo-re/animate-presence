import { Component, h } from '@stencil/core';
import '@stencil/router';

@Component({
    tag: 'route-demo',
    styleUrl: 'route.css'
})
export class Route {
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
              <animated-route-switch>
                <stencil-route
                  url="/"
                  exact={true}
                  routeRender={() => (
                    <animate-presence>
                      <div class="balls">
                        <shadow-root>
                            <div class="ball" />
                            <div class="ball" />
                            <div class="ball" />
                            <div class="ball" />
                            <div class="ball" />
                        </shadow-root>
                      </div>
                      <div class="item">Item A</div>
                      <div class="item">Item B</div>
                      <div class="item">Item C</div>
                      <div class="item">Item D</div>
                    </animate-presence>
                  )}
                />
                <stencil-route
                  url="/a"
                  routeRender={() => (
                    <animate-presence>
                      <div class="item">Item E</div>
                      <div class="item">Item F</div>
                    </animate-presence>
                  )}
                />
                <stencil-route
                  url="/b"
                  routeRender={() => (
                    <animate-presence>
                      <div class="b">Render /b</div>
                    </animate-presence>
                  )}
                />
                <stencil-route
                  url="/c"
                  routeRender={() => (
                    <animate-presence>
                      <div class="c">Render /c</div>
                    </animate-presence>
                  )}
                />
              </animated-route-switch>
            </main>
          </stencil-router>
        );
    }
}
