import {
  createHttpFactory,
  HttpMethod,
  SpectatorHttp,
} from '@ngneat/spectator/jest';
import { CategoryService } from './category.service';
import { environment } from '@env/environment';
import { generateFakeCategory } from '@shared/models/category.mock';
import { Category } from '@shared/models/category.model';

describe('CategoryService', () => {
  let spectator: SpectatorHttp<CategoryService>;
  const createService = createHttpFactory(CategoryService);

  beforeEach(() => {
    spectator = createService();
  });

  it('should be created', () => {
    expect(spectator.service).toBeTruthy();
  });

  describe('getAll', () => {
    it('should make GET request to correct URL', () => {
      spectator.service.getAll().subscribe();

      const url = `${environment.apiUrl}/api/v1/categories`;
      spectator.expectOne(url, HttpMethod.GET);
    });

    it('should return array of categories on successful request', done => {
      const mockCategories: Category[] = [
        generateFakeCategory(),
        generateFakeCategory(),
        generateFakeCategory(),
      ];

      spectator.service.getAll().subscribe(categories => {
        expect(categories).toEqual(mockCategories);
        expect(categories.length).toBe(3);
        done();
      });

      const req = spectator.expectOne(
        `${environment.apiUrl}/api/v1/categories`,
        HttpMethod.GET
      );
      req.flush(mockCategories);
    });

    it('should return empty array when no categories exist', done => {
      spectator.service.getAll().subscribe(categories => {
        expect(categories).toEqual([]);
        expect(categories.length).toBe(0);
        done();
      });

      const req = spectator.expectOne(
        `${environment.apiUrl}/api/v1/categories`,
        HttpMethod.GET
      );
      req.flush([]);
    });

    it('should return single category', done => {
      const mockCategory = generateFakeCategory({
        id: 1,
        name: 'Electronics',
      });

      spectator.service.getAll().subscribe(categories => {
        expect(categories.length).toBe(1);
        expect(categories[0]).toEqual(mockCategory);
        done();
      });

      const req = spectator.expectOne(
        `${environment.apiUrl}/api/v1/categories`,
        HttpMethod.GET
      );
      req.flush([mockCategory]);
    });

    it('should handle error response', done => {
      spectator.service.getAll().subscribe({
        next: () => fail('should have failed'),
        error: error => {
          expect(error.status).toBe(500);
          done();
        },
      });

      const req = spectator.expectOne(
        `${environment.apiUrl}/api/v1/categories`,
        HttpMethod.GET
      );
      req.flush('Server error', {
        status: 500,
        statusText: 'Internal Server Error',
      });
    });

    it('should handle 404 Not Found error', done => {
      spectator.service.getAll().subscribe({
        next: () => fail('should have failed'),
        error: error => {
          expect(error.status).toBe(404);
          done();
        },
      });

      const req = spectator.expectOne(
        `${environment.apiUrl}/api/v1/categories`,
        HttpMethod.GET
      );
      req.flush('Not found', { status: 404, statusText: 'Not Found' });
    });

    it('should handle 401 Unauthorized error', done => {
      spectator.service.getAll().subscribe({
        next: () => fail('should have failed'),
        error: error => {
          expect(error.status).toBe(401);
          done();
        },
      });

      const req = spectator.expectOne(
        `${environment.apiUrl}/api/v1/categories`,
        HttpMethod.GET
      );
      req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
    });
  });

  describe('getAllPromise', () => {
    beforeEach(() => {
      globalThis.fetch = jest.fn();
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should make fetch request to correct URL', async () => {
      const mockCategories = [generateFakeCategory()];
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        json: jest.fn().mockResolvedValueOnce(mockCategories),
      });

      await spectator.service.getAllPromise();

      expect(globalThis.fetch).toHaveBeenCalledWith(
        `${environment.apiUrl}/api/v1/categories`
      );
    });

    it('should return array of categories on successful request', async () => {
      const mockCategories: Category[] = [
        generateFakeCategory(),
        generateFakeCategory(),
      ];

      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        json: jest.fn().mockResolvedValueOnce(mockCategories),
      });

      const result = await spectator.service.getAllPromise();

      expect(result).toEqual(mockCategories);
      expect(result.length).toBe(2);
    });

    it('should return empty array when no categories exist', async () => {
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        json: jest.fn().mockResolvedValueOnce([]),
      });

      const result = await spectator.service.getAllPromise();

      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });

    it('should return single category', async () => {
      const mockCategory = generateFakeCategory({
        id: 1,
        name: 'Home & Garden',
      });

      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        json: jest.fn().mockResolvedValueOnce([mockCategory]),
      });

      const result = await spectator.service.getAllPromise();

      expect(result.length).toBe(1);
      expect(result[0]).toEqual(mockCategory);
    });

    it('should handle fetch error', async () => {
      const error = new Error('Network error');
      (globalThis.fetch as jest.Mock).mockRejectedValueOnce(error);

      try {
        await spectator.service.getAllPromise();
        fail('should have thrown an error');
      } catch (e) {
        expect(e).toEqual(error);
      }
    });

    it('should handle JSON parse error', async () => {
      const error = new SyntaxError('Invalid JSON');
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        json: jest.fn().mockRejectedValueOnce(error),
      });

      try {
        await spectator.service.getAllPromise();
        fail('should have thrown an error');
      } catch (e) {
        expect(e).toEqual(error);
      }
    });
  });

  describe('edge cases', () => {
    it('should handle large number of categories', done => {
      const mockCategories = Array.from({ length: 1000 }, () =>
        generateFakeCategory()
      );

      spectator.service.getAll().subscribe(categories => {
        expect(categories.length).toBe(1000);
        done();
      });

      const req = spectator.expectOne(
        `${environment.apiUrl}/api/v1/categories`,
        HttpMethod.GET
      );
      req.flush(mockCategories);
    });

    it('should handle categories with special characters in name', done => {
      const mockCategory = generateFakeCategory({
        name: 'Électronique & Informatique',
      });

      spectator.service.getAll().subscribe(categories => {
        expect(categories[0].name).toBe('Électronique & Informatique');
        done();
      });

      const req = spectator.expectOne(
        `${environment.apiUrl}/api/v1/categories`,
        HttpMethod.GET
      );
      req.flush([mockCategory]);
    });

    it('should handle categories with long slug', done => {
      const longSlug = 'a'.repeat(200);
      const mockCategory = generateFakeCategory({
        slug: longSlug,
      });

      spectator.service.getAll().subscribe(categories => {
        expect(categories[0].slug).toBe(longSlug);
        done();
      });

      const req = spectator.expectOne(
        `${environment.apiUrl}/api/v1/categories`,
        HttpMethod.GET
      );
      req.flush([mockCategory]);
    });

    it('should handle categories with very long image URL', done => {
      const longUrl = 'https://example.com/' + 'a'.repeat(500);
      const mockCategory = generateFakeCategory({
        image: longUrl,
      });

      spectator.service.getAll().subscribe(categories => {
        expect(categories[0].image).toBe(longUrl);
        done();
      });

      const req = spectator.expectOne(
        `${environment.apiUrl}/api/v1/categories`,
        HttpMethod.GET
      );
      req.flush([mockCategory]);
    });
  });

  describe('HTTP error scenarios', () => {
    it('should handle 400 Bad Request error', done => {
      spectator.service.getAll().subscribe({
        next: () => fail('should have failed'),
        error: error => {
          expect(error.status).toBe(400);
          done();
        },
      });

      const req = spectator.expectOne(
        `${environment.apiUrl}/api/v1/categories`,
        HttpMethod.GET
      );
      req.flush('Bad Request', { status: 400, statusText: 'Bad Request' });
    });

    it('should handle 403 Forbidden error', done => {
      spectator.service.getAll().subscribe({
        next: () => fail('should have failed'),
        error: error => {
          expect(error.status).toBe(403);
          done();
        },
      });

      const req = spectator.expectOne(
        `${environment.apiUrl}/api/v1/categories`,
        HttpMethod.GET
      );
      req.flush('Forbidden', { status: 403, statusText: 'Forbidden' });
    });

    it('should handle 503 Service Unavailable error', done => {
      spectator.service.getAll().subscribe({
        next: () => fail('should have failed'),
        error: error => {
          expect(error.status).toBe(503);
          done();
        },
      });

      const req = spectator.expectOne(
        `${environment.apiUrl}/api/v1/categories`,
        HttpMethod.GET
      );
      req.flush('Service Unavailable', {
        status: 503,
        statusText: 'Service Unavailable',
      });
    });

    it('should handle network error', done => {
      spectator.service.getAll().subscribe({
        next: () => fail('should have failed'),
        error: error => {
          expect(error.status).toBe(500);
          expect(error.statusText).toBe('Unknown Error');
          done();
        },
      });

      const req = spectator.expectOne(
        `${environment.apiUrl}/api/v1/categories`,
        HttpMethod.GET
      );
      req.flush(null, { status: 500, statusText: 'Unknown Error' });
    });
  });

  afterEach(() => {
    spectator.controller.verify();
  });
});
