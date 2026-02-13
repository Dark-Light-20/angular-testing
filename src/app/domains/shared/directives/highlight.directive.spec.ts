import {
  byTestId,
  createComponentFactory,
  Spectator,
} from '@ngneat/spectator/jest';
import { Component } from '@angular/core';
import { HighlightDirective } from './highlight.directive';

@Component({
  selector: 'app-test-highlight',
  imports: [HighlightDirective],
  template:
    '<div appHighlight data-testid="highlight-element">Highlighted Text</div>',
  standalone: true,
})
class TestHighlightComponent {}

describe('HighlightDirective', () => {
  let spectator: Spectator<TestHighlightComponent>;
  const createComponent = createComponentFactory(TestHighlightComponent);

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should apply directive to elements with appHighlight selector', () => {
    const element = spectator.query(byTestId('highlight-element'));
    expect(element).toBeTruthy();
    expect(
      element?.getAttribute('apphighlight') ||
        element?.hasAttribute('appHighlight')
    ).toBeTruthy();
  });

  it('should set background color to red on initialization', () => {
    const element = spectator.query(byTestId('highlight-element'));
    expect(element).toBeTruthy();
    expect(element).toHaveStyle({ backgroundColor: 'red' });
  });

  it('should highlight element content preserving text content', () => {
    const element = spectator.query(
      byTestId('highlight-element')
    ) as HTMLElement;
    expect(element?.textContent).toContain('Highlighted Text');
    expect(element?.style.backgroundColor).toBe('red');
  });
});
