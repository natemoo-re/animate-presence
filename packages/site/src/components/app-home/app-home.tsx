import { Component, h } from '@stencil/core';
import { Logo } from '../logo';

@Component({
  tag: 'app-home',
  styleUrl: 'app-home.css',
  scoped: true
})
export class AppHome {

  render() {
    return (
      <div class="app-home">
        <section>
          <Logo />
          <h1>Animate Presence</h1>
          <h2>Effortless element entrance/exit animations.</h2>
        </section>
      </div>
    );
  }
}
