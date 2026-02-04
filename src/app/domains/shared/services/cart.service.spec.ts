import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { CartService } from './cart.service';
import { Product } from '@shared/models/product.model';

describe('CartService', () => {
  let spectator: SpectatorService<CartService>;
  const createService = createServiceFactory(CartService);

  const productMock: Product = {
    id: 1,
    title: 'Test Product',
    description: 'A product for testing',
    price: 100,
    images: [],
    creationAt: new Date().toISOString(),
    category: {
      id: 1,
      name: 'Test Category',
      image: '',
      slug: 'category-slug',
    },
    slug: 'test-product',
  };

  const productMock2: Product = {
    id: 2,
    title: 'Second Product',
    description: 'Another product for testing',
    price: 50,
    images: [],
    creationAt: new Date().toISOString(),
    category: {
      id: 2,
      name: 'Second Category',
      image: '',
      slug: 'second-category',
    },
    slug: 'second-product',
  };

  beforeEach(() => {
    spectator = createService();
  });

  it('should be created', () => {
    expect(spectator.service).toBeTruthy();
  });

  it('should initialize with an empty cart', () => {
    expect(spectator.service.cart()).toEqual([]);
    expect(spectator.service.cart()).toHaveLength(0);
  });

  it('should initialize with total of 0', () => {
    expect(spectator.service.total()).toBe(0);
  });

  it('should add a product to the cart', () => {
    spectator.service.addToCart(productMock);
    expect(spectator.service.cart()).toContain(productMock);
    expect(spectator.service.cart()).toHaveLength(1);
    expect(spectator.service.total()).toBe(100);
  });

  it('should add multiple products to the cart', () => {
    spectator.service.addToCart(productMock);
    spectator.service.addToCart(productMock2);
    expect(spectator.service.cart()).toHaveLength(2);
    expect(spectator.service.cart()).toContain(productMock);
    expect(spectator.service.cart()).toContain(productMock2);
  });

  it('should calculate total correctly with multiple products', () => {
    spectator.service.addToCart(productMock);
    spectator.service.addToCart(productMock2);
    expect(spectator.service.total()).toBe(150);
  });

  it('should add the same product multiple times', () => {
    spectator.service.addToCart(productMock);
    spectator.service.addToCart(productMock);
    expect(spectator.service.cart()).toHaveLength(2);
    expect(spectator.service.total()).toBe(200);
  });

  it('should update total when adding products', () => {
    expect(spectator.service.total()).toBe(0);
    spectator.service.addToCart(productMock);
    expect(spectator.service.total()).toBe(100);
    spectator.service.addToCart(productMock2);
    expect(spectator.service.total()).toBe(150);
  });

  it('should handle products with zero price', () => {
    const freeProduct: Product = {
      ...productMock,
      id: 3,
      price: 0,
    };
    spectator.service.addToCart(freeProduct);
    expect(spectator.service.cart()).toHaveLength(1);
    expect(spectator.service.total()).toBe(0);
  });

  it('should maintain cart order when adding products', () => {
    spectator.service.addToCart(productMock);
    spectator.service.addToCart(productMock2);
    const cart = spectator.service.cart();
    expect(cart[0]).toEqual(productMock);
    expect(cart[1]).toEqual(productMock2);
  });

  it('should handle adding products with decimal prices', () => {
    const decimalProduct: Product = {
      ...productMock,
      id: 4,
      price: 99.99,
    };
    spectator.service.addToCart(decimalProduct);
    expect(spectator.service.total()).toBe(99.99);
  });
});
