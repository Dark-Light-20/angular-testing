import {
  createHttpFactory,
  HttpMethod,
  SpectatorHttp,
} from '@ngneat/spectator/jest';
import { ProductService } from './product.service';
import { environment } from '@env/environment';
import { generateFakeProduct } from '@shared/models/product.mock';
import { Product } from '@shared/models/product.model';

describe('ProductService', () => {
  let spectator: SpectatorHttp<ProductService>;
  const createService = createHttpFactory(ProductService);

  beforeEach(() => {
    spectator = createService();
  });

  it('should be created', () => {
    expect(spectator.service).toBeTruthy();
  });

  describe('getOne', () => {
    it('should make GET request to correct URL', () => {
      spectator.service.getOne('1').subscribe();

      const url = `${environment.apiUrl}/api/v1/products/1`;
      spectator.expectOne(url, HttpMethod.GET);
    });

    it('should return product data on successful request', done => {
      const mockProduct = generateFakeProduct({ id: 1 });

      spectator.service.getOne('1').subscribe(product => {
        expect(product).toEqual(mockProduct);
        done();
      });

      const req = spectator.expectOne(
        `${environment.apiUrl}/api/v1/products/1`,
        HttpMethod.GET
      );
      req.flush(mockProduct);
    });

    it('should handle numeric ID as string', () => {
      spectator.service.getOne('123').subscribe();

      const url = `${environment.apiUrl}/api/v1/products/123`;
      spectator.expectOne(url, HttpMethod.GET);
    });

    it('should handle error response', done => {
      spectator.service.getOne('999').subscribe({
        next: () => fail('should have failed'),
        error: error => {
          expect(error.status).toBe(404);
          done();
        },
      });

      const req = spectator.expectOne(
        `${environment.apiUrl}/api/v1/products/999`,
        HttpMethod.GET
      );
      req.flush('Product not found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('getOneBySlug', () => {
    it('should make GET request to correct URL with slug', () => {
      spectator.service.getOneBySlug('test-product').subscribe();

      const url = `${environment.apiUrl}/api/v1/products/slug/test-product`;
      spectator.expectOne(url, HttpMethod.GET);
    });

    it('should return product data on successful request', done => {
      const mockProduct = generateFakeProduct({ slug: 'test-product' });

      spectator.service.getOneBySlug('test-product').subscribe(product => {
        expect(product).toEqual(mockProduct);
        done();
      });

      const req = spectator.expectOne(
        `${environment.apiUrl}/api/v1/products/slug/test-product`,
        HttpMethod.GET
      );
      req.flush(mockProduct);
    });

    it('should handle slug with dashes', () => {
      spectator.service.getOneBySlug('my-awesome-product').subscribe();

      const url = `${environment.apiUrl}/api/v1/products/slug/my-awesome-product`;
      spectator.expectOne(url, HttpMethod.GET);
    });

    it('should handle error response for non-existent slug', done => {
      spectator.service.getOneBySlug('non-existent').subscribe({
        next: () => fail('should have failed'),
        error: error => {
          expect(error.status).toBe(404);
          done();
        },
      });

      const req = spectator.expectOne(
        `${environment.apiUrl}/api/v1/products/slug/non-existent`,
        HttpMethod.GET
      );
      req.flush('Product not found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('getRelatedProducts', () => {
    it('should make GET request to correct URL with slug', () => {
      spectator.service.getRelatedProducts('test-product').subscribe();

      const url = `${environment.apiUrl}/api/v1/products/slug/test-product/related`;
      spectator.expectOne(url, HttpMethod.GET);
    });

    it('should return array of products on successful request', done => {
      const mockProducts: Product[] = [
        generateFakeProduct(),
        generateFakeProduct(),
        generateFakeProduct(),
      ];

      spectator.service
        .getRelatedProducts('test-product')
        .subscribe(products => {
          expect(products).toEqual(mockProducts);
          expect(products.length).toBe(3);
          done();
        });

      const req = spectator.expectOne(
        `${environment.apiUrl}/api/v1/products/slug/test-product/related`,
        HttpMethod.GET
      );
      req.flush(mockProducts);
    });

    it('should return empty array when no related products exist', done => {
      spectator.service
        .getRelatedProducts('test-product')
        .subscribe(products => {
          expect(products).toEqual([]);
          expect(products.length).toBe(0);
          done();
        });

      const req = spectator.expectOne(
        `${environment.apiUrl}/api/v1/products/slug/test-product/related`,
        HttpMethod.GET
      );
      req.flush([]);
    });

    it('should handle server error', done => {
      spectator.service.getRelatedProducts('test-product').subscribe({
        next: () => fail('should have failed'),
        error: error => {
          expect(error.status).toBe(500);
          done();
        },
      });

      const req = spectator.expectOne(
        `${environment.apiUrl}/api/v1/products/slug/test-product/related`,
        HttpMethod.GET
      );
      req.flush('Server error', {
        status: 500,
        statusText: 'Internal Server Error',
      });
    });
  });

  describe('getProducts', () => {
    it('should make GET request without query params when no params provided', () => {
      spectator.service.getProducts().subscribe();

      const url = `${environment.apiUrl}/api/v1/products`;
      spectator.expectOne(url, HttpMethod.GET);
    });

    it('should add category_id as query parameter', () => {
      spectator.service.getProducts({ category_id: '5' }).subscribe();

      const req = spectator.expectOne(
        `${environment.apiUrl}/api/v1/products?categoryId=5`,
        HttpMethod.GET
      );
      expect(req.request.url).toContain('categoryId=5');
    });

    it('should add category_slug as query parameter', () => {
      spectator.service
        .getProducts({ category_slug: 'electronics' })
        .subscribe();

      const req = spectator.expectOne(
        `${environment.apiUrl}/api/v1/products?categorySlug=electronics`,
        HttpMethod.GET
      );
      expect(req.request.url).toContain('categorySlug=electronics');
    });

    it('should add both category_id and category_slug as query parameters', () => {
      spectator.service
        .getProducts({
          category_id: '5',
          category_slug: 'electronics',
        })
        .subscribe();

      const req = spectator.controller.expectOne(
        req =>
          req.url.includes('/api/v1/products') &&
          req.url.includes('categoryId=5') &&
          req.url.includes('categorySlug=electronics')
      );
      expect(req.request.method).toBe('GET');
      expect(req.request.url).toContain('categoryId=5');
      expect(req.request.url).toContain('categorySlug=electronics');
      req.flush([]);
    });

    it('should return array of products on successful request', done => {
      const mockProducts: Product[] = [
        generateFakeProduct(),
        generateFakeProduct(),
      ];

      spectator.service.getProducts().subscribe(products => {
        expect(products).toEqual(mockProducts);
        expect(products.length).toBe(2);
        done();
      });

      const req = spectator.expectOne(
        `${environment.apiUrl}/api/v1/products`,
        HttpMethod.GET
      );
      req.flush(mockProducts);
    });

    it('should return empty array when no products exist', done => {
      spectator.service
        .getProducts({ category_id: '999' })
        .subscribe(products => {
          expect(products).toEqual([]);
          expect(products.length).toBe(0);
          done();
        });

      const req = spectator.expectOne(
        `${environment.apiUrl}/api/v1/products?categoryId=999`,
        HttpMethod.GET
      );
      req.flush([]);
    });

    it('should handle error response', done => {
      spectator.service.getProducts().subscribe({
        next: () => fail('should have failed'),
        error: error => {
          expect(error.status).toBe(500);
          done();
        },
      });

      const req = spectator.expectOne(
        `${environment.apiUrl}/api/v1/products`,
        HttpMethod.GET
      );
      req.flush('Server error', {
        status: 500,
        statusText: 'Internal Server Error',
      });
    });
  });

  describe('edge cases', () => {
    it('should handle slug with special characters in getOneBySlug', () => {
      const slug = 'product-with-números-123';
      spectator.service.getOneBySlug(slug).subscribe();

      const url = `${environment.apiUrl}/api/v1/products/slug/${slug}`;
      spectator.expectOne(url, HttpMethod.GET);
    });

    it('should handle very long slug', () => {
      const longSlug = 'a'.repeat(200);
      spectator.service.getOneBySlug(longSlug).subscribe();

      const url = `${environment.apiUrl}/api/v1/products/slug/${longSlug}`;
      spectator.expectOne(url, HttpMethod.GET);
    });

    it('should handle category_id with leading zeros', () => {
      spectator.service.getProducts({ category_id: '007' }).subscribe();

      const req = spectator.expectOne(
        `${environment.apiUrl}/api/v1/products?categoryId=007`,
        HttpMethod.GET
      );
      expect(req.request.url).toContain('categoryId=007');
    });

    it('should handle category_slug with dashes and underscores', () => {
      spectator.service
        .getProducts({ category_slug: 'home_and-garden' })
        .subscribe();

      const req = spectator.expectOne(
        `${environment.apiUrl}/api/v1/products?categorySlug=home_and-garden`,
        HttpMethod.GET
      );
      expect(req.request.url).toContain('categorySlug=home_and-garden');
    });
  });

  describe('HTTP error scenarios', () => {
    it('should handle 401 Unauthorized error', done => {
      spectator.service.getOne('1').subscribe({
        next: () => fail('should have failed'),
        error: error => {
          expect(error.status).toBe(401);
          done();
        },
      });

      const req = spectator.expectOne(
        `${environment.apiUrl}/api/v1/products/1`,
        HttpMethod.GET
      );
      req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
    });

    it('should handle network error', done => {
      spectator.service.getProducts().subscribe({
        next: () => fail('should have failed'),
        error: error => {
          expect(error.status).toBe(500);
          expect(error.statusText).toBe('Unknown Error');
          done();
        },
      });

      const req = spectator.expectOne(
        `${environment.apiUrl}/api/v1/products`,
        HttpMethod.GET
      );
      req.flush(null, { status: 500, statusText: 'Unknown Error' });
    });
  });

  afterEach(() => {
    spectator.controller.verify();
  });
});
