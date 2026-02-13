import { createRoutingFactory, Spectator } from '@ngneat/spectator/jest';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let spectator: Spectator<AppComponent>;

  const createComponent = createRoutingFactory(AppComponent);

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should have store title property', () => {
    expect(spectator.component.title).toBe('store');
  });

  it('should render router-outlet for navigation', () => {
    const routerOutlet = spectator.query('router-outlet');
    expect(routerOutlet).toBeTruthy();
  });
});
