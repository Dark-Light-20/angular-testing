import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { MetaTagsService } from './meta-tags.service';
import { Meta, Title } from '@angular/platform-browser';
import { environment } from '@env/environment';

describe('MetaTagsService', () => {
  let spectator: SpectatorService<MetaTagsService>;
  let metaService: Meta;
  let titleService: Title;

  const createService = createServiceFactory({
    service: MetaTagsService,
    providers: [
      { provide: Title, useValue: { setTitle: jest.fn() } },
      { provide: Meta, useValue: { updateTag: jest.fn() } },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    metaService = spectator.inject(Meta);
    titleService = spectator.inject(Title);
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(spectator.service).toBeTruthy();
  });

  describe('updateMetaTags with complete data', () => {
    it('should update all meta tags with provided complete data', () => {
      const completeMetaData = {
        title: 'Test Title',
        description: 'Test Description',
        image: 'http://example.com/image.jpg',
        url: 'http://example.com/page',
      };

      spectator.service.updateMetaTags(completeMetaData);

      expect(titleService.setTitle).toHaveBeenCalledWith('Test Title');
      expect(metaService.updateTag).toHaveBeenCalledTimes(6);
      expect(metaService.updateTag).toHaveBeenCalledWith({
        name: 'title',
        content: 'Test Title',
      });
      expect(metaService.updateTag).toHaveBeenCalledWith({
        name: 'description',
        content: 'Test Description',
      });
      expect(metaService.updateTag).toHaveBeenCalledWith({
        property: 'og:title',
        content: 'Test Title',
      });
      expect(metaService.updateTag).toHaveBeenCalledWith({
        property: 'og:description',
        content: 'Test Description',
      });
      expect(metaService.updateTag).toHaveBeenCalledWith({
        property: 'og:image',
        content: 'http://example.com/image.jpg',
      });
      expect(metaService.updateTag).toHaveBeenCalledWith({
        property: 'og:url',
        content: 'http://example.com/page',
      });
    });
  });

  describe('updateMetaTags with partial data', () => {
    it('should update meta tags with only title provided, using defaults for others', () => {
      spectator.service.updateMetaTags({ title: 'Custom Title' });

      expect(titleService.setTitle).toHaveBeenCalledWith('Custom Title');
      expect(metaService.updateTag).toHaveBeenCalledTimes(6);
      expect(metaService.updateTag).toHaveBeenCalledWith({
        name: 'title',
        content: 'Custom Title',
      });
      expect(metaService.updateTag).toHaveBeenCalledWith({
        name: 'description',
        content: 'Ng Store is a store for Ng products',
      });
    });

    it('should update meta tags with only description provided', () => {
      spectator.service.updateMetaTags({ description: 'Custom Description' });

      expect(titleService.setTitle).toHaveBeenCalledWith('Ng Store');
      expect(metaService.updateTag).toHaveBeenCalledWith({
        name: 'description',
        content: 'Custom Description',
      });
      expect(metaService.updateTag).toHaveBeenCalledWith({
        property: 'og:description',
        content: 'Custom Description',
      });
    });

    it('should update meta tags with only image provided', () => {
      spectator.service.updateMetaTags({
        image: 'http://example.com/custom.jpg',
      });

      expect(metaService.updateTag).toHaveBeenCalledWith({
        property: 'og:image',
        content: 'http://example.com/custom.jpg',
      });
    });

    it('should update meta tags with only url provided', () => {
      spectator.service.updateMetaTags({
        url: 'http://example.com/custom-page',
      });

      expect(metaService.updateTag).toHaveBeenCalledWith({
        property: 'og:url',
        content: 'http://example.com/custom-page',
      });
    });

    it('should update meta tags with title and description provided', () => {
      spectator.service.updateMetaTags({
        title: 'Partial Title',
        description: 'Partial Description',
      });

      expect(titleService.setTitle).toHaveBeenCalledWith('Partial Title');
      expect(metaService.updateTag).toHaveBeenCalledWith({
        name: 'title',
        content: 'Partial Title',
      });
      expect(metaService.updateTag).toHaveBeenCalledWith({
        name: 'description',
        content: 'Partial Description',
      });
    });
  });

  describe('updateMetaTags with default values', () => {
    it('should use default values when empty object is provided', () => {
      spectator.service.updateMetaTags({});

      expect(titleService.setTitle).toHaveBeenCalledWith('Ng Store');
      expect(metaService.updateTag).toHaveBeenCalledTimes(6);
      expect(metaService.updateTag).toHaveBeenCalledWith({
        name: 'title',
        content: 'Ng Store',
      });
      expect(metaService.updateTag).toHaveBeenCalledWith({
        name: 'description',
        content: 'Ng Store is a store for Ng products',
      });
      expect(metaService.updateTag).toHaveBeenCalledWith({
        property: 'og:image',
        content: '',
      });
      expect(metaService.updateTag).toHaveBeenCalledWith({
        property: 'og:url',
        content: environment.domain,
      });
    });
  });

  describe('edge cases', () => {
    it('should handle empty strings in provided data', () => {
      spectator.service.updateMetaTags({
        title: '',
        description: '',
      });

      expect(titleService.setTitle).toHaveBeenCalledWith('');
      expect(metaService.updateTag).toHaveBeenCalledWith({
        name: 'title',
        content: '',
      });
      expect(metaService.updateTag).toHaveBeenCalledWith({
        name: 'description',
        content: '',
      });
    });

    it('should handle special characters in meta data', () => {
      const specialCharData = {
        title: 'Test & Title <script>',
        description: 'Description with "quotes" and \'apostrophes\'',
      };

      spectator.service.updateMetaTags(specialCharData);

      expect(titleService.setTitle).toHaveBeenCalledWith(
        'Test & Title <script>'
      );
      expect(metaService.updateTag).toHaveBeenCalledWith({
        name: 'description',
        content: 'Description with "quotes" and \'apostrophes\'',
      });
    });

    it('should handle unicode characters', () => {
      spectator.service.updateMetaTags({
        title: '测试标题 タイトル 제목',
        description: 'Descripción con acentos: café, niño, cañón 🚀',
      });

      expect(titleService.setTitle).toHaveBeenCalledWith(
        '测试标题 タイトル 제목'
      );
      expect(metaService.updateTag).toHaveBeenCalledWith({
        name: 'description',
        content: 'Descripción con acentos: café, niño, cañón 🚀',
      });
    });
  });

  describe('multiple calls', () => {
    it('should update meta tags correctly on multiple consecutive calls', () => {
      spectator.service.updateMetaTags({ title: 'First Title' });
      spectator.service.updateMetaTags({ title: 'Second Title' });

      expect(titleService.setTitle).toHaveBeenCalledTimes(2);

      const calls = (titleService.setTitle as jest.Mock).mock.calls;
      expect(calls[0][0]).toBe('First Title');
      expect(calls[1][0]).toBe('Second Title');
    });

    it('should accumulate updateTag calls on multiple invocations', () => {
      spectator.service.updateMetaTags({ title: 'First' });
      spectator.service.updateMetaTags({ description: 'Second' });

      expect(metaService.updateTag).toHaveBeenCalledTimes(12); // 6 calls per invocation
    });
  });
});
