import {
  createComponentFactory,
  mockProvider,
  Spectator,
  byTestId,
  SpyObject,
} from '@ngneat/spectator/jest';
import ProductDetailComponent from './product-detail.component';
import { ProductService } from '@shared/services/product.service';
import { generateFakeProduct } from '@shared/models/product.mock';
import { of } from 'rxjs';
import { DeferBlockBehavior } from '@angular/core/testing';
import { RelatedComponent } from '@products/components/related/related.component';

globalThis.IntersectionObserver = jest.fn(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
  takeRecords: jest.fn(),
  root: null,
  rootMargin: '',
  thresholds: [],
}));

describe('ProductDetailComponent', () => {
  let spectator: Spectator<ProductDetailComponent>;
  let productService: SpyObject<ProductService>;

  const mockProduct = generateFakeProduct();

  const createComponent = createComponentFactory({
    component: ProductDetailComponent,
    deferBlockBehavior: DeferBlockBehavior.Manual,
    providers: [
      mockProvider(ProductService, {
        getOneBySlug: jest.fn().mockReturnValue(of(mockProduct)),
      }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent({
      detectChanges: false,
    });
    spectator.setInput('slug', mockProduct.slug);
    productService = spectator.inject(ProductService);
  });

  it('should create', () => {
    spectator.detectChanges();
    expect(spectator.component).toBeTruthy();
  });

  it('should get product by slug on init', () => {
    spectator.detectChanges();
    expect(productService.getOneBySlug).toHaveBeenCalledWith(mockProduct.slug);
  });

  it('should display product cover image', () => {
    spectator.detectChanges();
    const coverImg = spectator.query<HTMLImageElement>(byTestId('cover'));
    expect(coverImg).toBeTruthy();
    expect(coverImg?.src).toContain(mockProduct.images[0]);
  });

  it('should show related products component', async () => {
    spectator.detectChanges();
    await spectator.deferBlock().renderComplete();
    spectator.detectChanges();

    const relatedComponent = spectator.query(RelatedComponent);
    expect(relatedComponent).toBeTruthy();
  });
});
