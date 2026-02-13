import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { RelatedComponent } from './related.component';
import { ProductService } from '@shared/services/product.service';
import { generateFakeProduct } from '@shared/models/product.mock';
import { of } from 'rxjs';

describe('RelatedComponent', () => {
  let spectator: Spectator<RelatedComponent>;
  let productService: ProductService;

  const createComponent = createComponentFactory({
    component: RelatedComponent,
    providers: [ProductService],
    mocks: [ProductService],
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent({
      detectChanges: false,
    });
    spectator.setInput('slug', 'test-product');
    productService = spectator.inject(ProductService);
  });

  describe('Component Initialization', () => {
    it('should accept slug input', () => {
      expect(spectator.component.$slug()).toBe('test-product');
    });

    it('should inject ProductService dependency', () => {
      expect(spectator.component.productService).toBe(productService);
    });
  });

  describe('Related Products Resource', () => {
    it('should have relatedProducts rxResource defined', () => {
      expect(spectator.component.relatedProducts).toBeDefined();
    });
  });

  describe('Product Loading', () => {
    it('should load related products when slug input provided', () => {
      const mockProducts = [generateFakeProduct(), generateFakeProduct()];
      const getRelatedProductsSpy = jest
        .spyOn(productService, 'getRelatedProducts')
        .mockReturnValue(of(mockProducts));

      spectator.setInput('slug', 'laptop-bag');
      spectator.detectChanges();

      expect(getRelatedProductsSpy).toHaveBeenCalledWith('laptop-bag');
    });

    it('should call getRelatedProducts with updated slug when input changes', () => {
      const mockProducts = [generateFakeProduct()];
      jest
        .spyOn(productService, 'getRelatedProducts')
        .mockReturnValue(of(mockProducts));

      spectator.setInput('slug', 'initial-slug');
      spectator.detectChanges();
      expect(productService.getRelatedProducts).toHaveBeenCalledWith(
        'initial-slug'
      );

      spectator.setInput('slug', 'updated-slug');
      spectator.detectChanges();
      expect(productService.getRelatedProducts).toHaveBeenCalledWith(
        'updated-slug'
      );
    });

    it('should handle product service returning multiple products', () => {
      const mockProducts = [
        generateFakeProduct(),
        generateFakeProduct(),
        generateFakeProduct(),
      ];
      jest
        .spyOn(productService, 'getRelatedProducts')
        .mockReturnValue(of(mockProducts));

      spectator.setInput('slug', 'test-product');
      spectator.detectChanges();

      expect(productService.getRelatedProducts).toHaveBeenCalled();
    });
  });
});
