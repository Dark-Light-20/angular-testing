import { createRoutingFactory, Spectator } from '@ngneat/spectator/jest';
import { LayoutComponent } from './layout.component';
import { CartService } from '@shared/services/cart.service';
import { signal, computed } from '@angular/core';

describe('LayoutComponent', () => {
  let spectator: Spectator<LayoutComponent>;

  const createComponent = createRoutingFactory({
    component: LayoutComponent,
    providers: [
      {
        provide: CartService,
        useValue: {
          cart: signal([]),
          total: computed(() => 0),
          addToCart: jest.fn(),
        },
      },
    ],
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should render header component', () => {
    spectator.detectChanges();
    const header = spectator.query('app-header');
    expect(header).toBeTruthy();
  });

  it('should render router outlet for page navigation', () => {
    spectator.detectChanges();
    const routerOutlet = spectator.query('router-outlet');
    expect(routerOutlet).toBeTruthy();
  });
});
