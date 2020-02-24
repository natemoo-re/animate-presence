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
              <stencil-route url="/" routeRender={(...args) => (
                  <animated-route-switch {...(args as any)}>
                    <stencil-route
                      url="/"
                      exact={true}
                      routeRender={() => (
                        <div>
                          <h1>Hello world!</h1>
                          <animate-presence>
                            <div class="balls">
                              <animate-presence>
                                <div class="ball" />
                                <div class="ball" />
                                <div class="ball" />
                                <div class="ball" />
                                <div class="ball" />
                              </animate-presence>
                            </div>
                            <div class="item">
                              Item A
                              <stencil-route-link url="/c">
                                C
                              </stencil-route-link>
                            </div>
                            <div class="item">Item B</div>
                            <div class="item">Item C</div>
                            <div class="item">Item D</div>
                            <div>
                              <animate-presence>
                                <div class="item">Item A1</div>
                                <div class="item">Item B1</div>
                                <div class="item">Item C1</div>
                                <div class="item">Item D1</div>
                              </animate-presence>
                            </div>
                          </animate-presence>
                        </div>
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
                )}>
              </stencil-route>
            </main>
          </stencil-router>
        );
    }
}
