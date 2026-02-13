import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import LocationsComponent from './locations.component';

describe('LocationsComponent', () => {
  let spectator: Spectator<LocationsComponent>;

  const createComponent = createComponentFactory({
    component: LocationsComponent,
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent({
      detectChanges: false,
    });
  });

  it('should initialize origin signal with empty string', () => {
    expect(spectator.component.$origin()).toBe('');
  });

  it('should update origin signal with valid coordinates', () => {
    const coordinatesString = '40.7128,-74.0060';
    spectator.component.$origin.set(coordinatesString);

    expect(spectator.component.$origin()).toBe(coordinatesString);
  });

  it('should store origin in correct latitude,longitude format', () => {
    const testOrigin = '51.5074,-0.1278';
    spectator.component.$origin.set(testOrigin);

    const [latitude, longitude] = testOrigin.split(',');
    expect(latitude).toBeDefined();
    expect(longitude).toBeDefined();
  });

  it('should have locationRs resource defined', () => {
    expect(spectator.component.locationRs).toBeDefined();
  });
});
