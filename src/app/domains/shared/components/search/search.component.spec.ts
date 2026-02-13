import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { SearchComponent } from './search.component';

describe('SearchComponent', () => {
  let spectator: Spectator<SearchComponent>;

  const createComponent = createComponentFactory(SearchComponent);

  beforeEach(() => {
    spectator = createComponent({
      detectChanges: false,
    });
  });

  it('should initialize search signal with empty string', () => {
    expect(spectator.component.search()).toBe('');
  });

  it('should allow manual search signal updates', () => {
    spectator.component.search.set('laptop');
    expect(spectator.component.search()).toBe('laptop');
  });

  it('should render input element', () => {
    spectator.detectChanges();
    const input = spectator.query('input');
    expect(input).toBeTruthy();
  });

  it('should update search signal when input value changes', () => {
    spectator.detectChanges();
    const input = spectator.query('input') as HTMLInputElement;

    if (input) {
      spectator.component.search.set('test search');
      spectator.detectChanges();
      expect(spectator.component.search()).toBe('test search');
    }
  });
});
