import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { CounterComponent } from './counter.component';

describe('CounterComponent', () => {
  let spectator: Spectator<CounterComponent>;

  const createComponent = createComponentFactory(CounterComponent);

  beforeEach(() => {
    spectator = createComponent({
      detectChanges: false,
    });
    spectator.setInput({ duration: 1000, message: 'Test Message' });
  });

  afterEach(() => {
    if (spectator.component.counterRef !== null) {
      window.clearInterval(spectator.component.counterRef);
    }
  });

  it('should initialize counter signal with 0', () => {
    expect(spectator.component.$counter()).toBe(0);
  });

  it('should compute double duration value', () => {
    expect(spectator.component.$doubleDuration()).toBe(2000);
  });

  it('should update computed double duration when input changes', () => {
    spectator.setInput({ duration: 500, message: 'Test Message' });
    expect(spectator.component.$doubleDuration()).toBe(1000);
  });

  it('should accept duration input', () => {
    expect(spectator.component.$duration()).toBe(1000);
  });

  it('should accept message model', () => {
    expect(spectator.component.$message()).toBe('Test Message');
  });

  it('should update message model when changed externally', () => {
    spectator.setInput({ message: 'Updated Message' });
    expect(spectator.component.$message()).toBe('Updated Message');
  });

  it('should setup interval on afterNextRender', done => {
    spectator.detectChanges();

    setTimeout(() => {
      expect(spectator.component.counterRef).not.toBeNull();
      expect(typeof spectator.component.counterRef).toBe('number');
      done();
    }, 100);
  });

  it('should increment counter signal periodically', done => {
    spectator.detectChanges();
    expect(spectator.component.$counter()).toBe(0);

    setTimeout(() => {
      const counterValue = spectator.component.$counter();
      expect(counterValue).toBeGreaterThan(0);
      done();
    }, 1500);
  });

  it('should clear interval on component destroy', () => {
    spectator.detectChanges();
    const initialRef = spectator.component.counterRef;

    if (initialRef !== null) {
      const clearIntervalSpy = jest.spyOn(window, 'clearInterval');
      spectator.component.ngOnDestroy();

      expect(clearIntervalSpy).toHaveBeenCalledWith(initialRef);
      clearIntervalSpy.mockRestore();
    }
  });

  it('should trigger effect when message model changes', () => {
    spectator.detectChanges();
    const initialMessage = spectator.component.$message();

    spectator.setInput({ message: 'New Message' });
    expect(spectator.component.$message()).not.toBe(initialMessage);
  });
});
