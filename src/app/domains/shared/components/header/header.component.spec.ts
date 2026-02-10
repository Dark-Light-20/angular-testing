import {
  byTestId,
  createRoutingFactory,
  Spectator,
} from '@ngneat/spectator/jest';
import { HeaderComponent } from './header.component';
import { CartService } from '@shared/services/cart.service';
import { generateFakeProduct } from '@shared/models/product.mock';

describe('HeaderComponent', () => {
  let spectator: Spectator<HeaderComponent>;
  let cartService: CartService;

  const createComponent = createRoutingFactory({
    component: HeaderComponent,
    providers: [CartService],
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    cartService = spectator.inject(CartService);
  });

  it('should create', () => {
    spectator.detectChanges();
    expect(spectator.component).toBeTruthy();
  });

  it('should toggle mobile menu state when toggleMenu is called', () => {
    spectator.detectChanges();

    expect(spectator.component.showMenu()).toBe(false);
    spectator.component.toggleMenu();
    spectator.detectChanges();

    expect(spectator.component.showMenu()).toBe(true);
  });

  it('should show and hide the menu container when toggling', () => {
    spectator.detectChanges();

    const menuContainer = spectator.query(byTestId('header-menu'));
    expect(menuContainer).toBeTruthy();
    expect(menuContainer).toHaveClass('hidden');

    spectator.component.toggleMenu();
    spectator.detectChanges();

    expect(menuContainer).not.toHaveClass('hidden');
  });

  it('should toggle side menu state when toogleSideMenu is called', () => {
    spectator.detectChanges();

    expect(spectator.component.hideSideMenu()).toBe(true);
    spectator.component.toogleSideMenu();
    spectator.detectChanges();

    expect(spectator.component.hideSideMenu()).toBe(false);
  });

  it('should hide side menu with translate class by default', () => {
    spectator.detectChanges();

    const sideMenu = spectator.query(byTestId('side-menu'));
    expect(sideMenu).toBeTruthy();
    expect(sideMenu).toHaveClass('translate-x-full');
  });

  it('should show side menu when toggle button is clicked', () => {
    spectator.detectChanges();

    spectator.click(byTestId('cart-toggle'));
    spectator.detectChanges();

    const sideMenu = spectator.query(byTestId('side-menu'));
    expect(sideMenu).not.toHaveClass('translate-x-full');
  });

  it('should update cart badge count when cart changes', () => {
    const productA = generateFakeProduct({ price: 10 });
    const productB = generateFakeProduct({ price: 20 });

    cartService.addToCart(productA);
    cartService.addToCart(productB);
    spectator.detectChanges();

    const badge = spectator.query(byTestId('cart-count'));
    expect(badge).toHaveText('2');
  });

  it('should render cart items and total when side menu is open', () => {
    const productA = generateFakeProduct({ price: 10 });
    const productB = generateFakeProduct({ price: 20 });

    cartService.addToCart(productA);
    cartService.addToCart(productB);
    spectator.component.toogleSideMenu();
    spectator.detectChanges();

    const items = spectator.queryAll(byTestId('cart-item'));
    expect(items.length).toBe(2);

    const total = spectator.query(byTestId('cart-total'));
    expect(total).toHaveText('Total: 30');
  });

  it('should render empty cart with zero total', () => {
    spectator.component.toogleSideMenu();
    spectator.detectChanges();

    const items = spectator.queryAll(byTestId('cart-item'));
    expect(items.length).toBe(0);

    const total = spectator.query(byTestId('cart-total'));
    expect(total).toHaveText('Total: 0');
  });

  it('should handle products with empty images list', () => {
    const product = generateFakeProduct({ images: [] });

    cartService.addToCart(product);
    spectator.component.toogleSideMenu();
    spectator.detectChanges();

    const items = spectator.queryAll(byTestId('cart-item'));
    expect(items.length).toBe(1);
  });

  it('should handle negative price edge case in total', () => {
    const product = generateFakeProduct({ price: -5 });

    cartService.addToCart(product);
    spectator.component.toogleSideMenu();
    spectator.detectChanges();

    const total = spectator.query(byTestId('cart-total'));
    expect(total).toHaveText('Total: -5');
  });
});
