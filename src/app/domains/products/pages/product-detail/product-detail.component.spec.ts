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

describe('ProductDetailComponent', () => {
  let spectator: Spectator<ProductDetailComponent>;
  let productService: SpyObject<ProductService>;

  const mockProduct = generateFakeProduct();

  const createComponent = createComponentFactory({
    component: ProductDetailComponent,
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
});
