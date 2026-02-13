import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import ListComponent from './list.component';
import { ProductService } from '@shared/services/product.service';
import { CategoryService } from '@shared/services/category.service';
import { CartService } from '@shared/services/cart.service';
import { generateFakeProduct } from '@shared/models/product.mock';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

describe('ListComponent', () => {
  let spectator: Spectator<ListComponent>;
  let productService: ProductService;
  let categoryService: CategoryService;
  let cartService: CartService;

  const createComponent = createComponentFactory({
    component: ListComponent,
    providers: [
      mockProvider(ProductService),
      mockProvider(CategoryService),
      mockProvider(CartService),
      mockProvider(ActivatedRoute),
    ],
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        slug: 'electronics',
      },
      detectChanges: false,
    });
    productService = spectator.inject(ProductService);
    categoryService = spectator.inject(CategoryService);
    cartService = spectator.inject(CartService);
  });

  describe('Component Inputs', () => {
    it('should accept slug input parameter', () => {
      expect(spectator.component.slug()).toBe('electronics');
    });

    it('should update slug when input changes', () => {
      spectator.setInput('slug', 'clothing');
      expect(spectator.component.slug()).toBe('clothing');
    });

    it('should handle undefined slug input', () => {
      spectator.setInput('slug', undefined);
      expect(spectator.component.slug()).toBeUndefined();
    });
  });

  describe('Resources', () => {
    it('should have categoriesResource defined', () => {
      expect(spectator.component.categoriesResource).toBeDefined();
    });

    it('should have productsResource defined', () => {
      expect(spectator.component.productsResource).toBeDefined();
    });
  });

  describe('Category Loading', () => {
    it('should load categories on initialization', () => {
      jest.spyOn(categoryService, 'getAllPromise').mockResolvedValue([]);
      spectator.detectChanges();

      expect(categoryService.getAllPromise).toHaveBeenCalled();
    });

    it('should reset categories to empty array', () => {
      spectator.detectChanges();
      spectator.component.resetCategories();

      expect(spectator.component.categoriesResource.value()).toEqual([]);
    });

    it('should reload categories when reload is called', () => {
      spectator.detectChanges();
      const reloadSpy = jest.spyOn(
        spectator.component.categoriesResource,
        'reload'
      );

      spectator.component.reloadCategories();

      expect(reloadSpy).toHaveBeenCalled();
    });
  });

  describe('Product Loading', () => {
    it('should load products based on slug input', () => {
      const mockProducts = [generateFakeProduct()];
      jest
        .spyOn(productService, 'getProducts')
        .mockReturnValue(of(mockProducts));

      spectator.detectChanges();
      expect(productService.getProducts).toHaveBeenCalled();
    });

    it('should reload products when reload is called', () => {
      spectator.detectChanges();
      const reloadSpy = jest.spyOn(
        spectator.component.productsResource,
        'reload'
      );

      spectator.component.reloadProducts();

      expect(reloadSpy).toHaveBeenCalled();
    });
  });

  describe('Cart Integration', () => {
    it('should add product to cart when addToCart is called', () => {
      const mockProduct = generateFakeProduct();
      const addToCartSpy = jest.spyOn(cartService, 'addToCart');

      spectator.component.addToCart(mockProduct);

      expect(addToCartSpy).toHaveBeenCalledWith(mockProduct);
    });

    it('should handle adding multiple products to cart', () => {
      const product1 = generateFakeProduct();
      const product2 = generateFakeProduct();
      const addToCartSpy = jest.spyOn(cartService, 'addToCart');

      spectator.component.addToCart(product1);
      spectator.component.addToCart(product2);

      expect(addToCartSpy).toHaveBeenCalledTimes(2);
      expect(addToCartSpy).toHaveBeenCalledWith(product1);
      expect(addToCartSpy).toHaveBeenCalledWith(product2);
    });
  });

  describe('Service Injection', () => {
    it('should inject ProductService', () => {
      expect(productService).toBeDefined();
    });

    it('should inject CategoryService', () => {
      expect(categoryService).toBeDefined();
    });

    it('should inject CartService', () => {
      expect(cartService).toBeDefined();
    });
  });
});
