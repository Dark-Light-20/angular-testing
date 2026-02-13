import { createRoutingFactory, Spectator } from '@ngneat/spectator/jest';
import { NotFoundComponent } from './not-found.component';

describe('NotFoundComponent', () => {
  let spectator: Spectator<NotFoundComponent>;

  const createComponent = createRoutingFactory(NotFoundComponent);

  beforeEach(() => {
    spectator = createComponent({
      detectChanges: false,
    });
  });

  it('should display 404 error code in heading', () => {
    spectator.detectChanges();
    const heading = spectator.query('h1');
    expect(heading).toHaveText('404');
  });

  it('should render "Something\'s missing." message', () => {
    spectator.detectChanges();
    const paragraph = spectator.query('p:first-of-type');
    expect(paragraph).toHaveText("Something's missing.");
  });

  it('should link to root path', () => {
    spectator.detectChanges();
    const link = spectator.query('a');
    expect(link).toHaveAttribute('routerLink', '/');
  });

  it('should display "Back to Homepage" link text', () => {
    spectator.detectChanges();
    const link = spectator.query('a');
    expect(link).toHaveText('Back to Homepage');
  });
});
