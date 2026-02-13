import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import AboutComponent from './about.component';

describe('AboutComponent', () => {
  let spectator: Spectator<AboutComponent>;

  const createComponent = createComponentFactory({
    component: AboutComponent,
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent({
      detectChanges: false,
    });
  });

  describe('Signal Initialization', () => {
    it('should initialize duration signal with 1000', () => {
      expect(spectator.component.duration()).toBe(1000);
    });

    it('should initialize message signal with "Hola"', () => {
      expect(spectator.component.message()).toBe('Hola');
    });
  });

  describe('Observable with toSignal Integration', () => {
    it('should sync obsWithInit$ to $withInit signal', () => {
      expect(spectator.component.$withInit()).toBe('init value');
    });

    it('should update $withInit signal when obsWithInit$ emits new value', done => {
      spectator.component.emitWithInit();

      // Use setTimeout to allow the signal to update
      setTimeout(() => {
        expect(spectator.component.$withInit()).toBe('new value');
        done();
      }, 0);
    });

    it('should have initial placeholder value for delayed observable', () => {
      expect(spectator.component.$withoutInit()).toBe('----');
    });

    it('should emit new value on obsWithoutInit$ when emitWithoutInit is called', done => {
      spectator.component.obsWithoutInit$.subscribe(value => {
        expect(value).toBe('*****');
        done();
      });

      spectator.component.emitWithoutInit();
    });
  });

  describe('Duration Input Handling', () => {
    it('should change duration signal when valid number is provided', () => {
      const input = document.createElement('input');
      input.type = 'number';
      input.valueAsNumber = 5000;

      const event = new Event('change');
      Object.defineProperty(event, 'target', {
        value: input,
        enumerable: true,
      });

      spectator.component.changeDuration(event);
      expect(spectator.component.duration()).toBe(5000);
    });

    it('should handle duration value of 0', () => {
      const input = document.createElement('input');
      input.type = 'number';
      input.valueAsNumber = 0;

      const event = new Event('change');
      Object.defineProperty(event, 'target', {
        value: input,
        enumerable: true,
      });

      spectator.component.changeDuration(event);
      expect(spectator.component.duration()).toBe(0);
    });

    it('should handle negative duration values', () => {
      const input = document.createElement('input');
      input.type = 'number';
      input.valueAsNumber = -1000;

      const event = new Event('change');
      Object.defineProperty(event, 'target', {
        value: input,
        enumerable: true,
      });

      spectator.component.changeDuration(event);
      expect(spectator.component.duration()).toBe(-1000);
    });

    it('should update duration signal multiple times', () => {
      const createInputEvent = (value: number) => {
        const input = document.createElement('input');
        input.type = 'number';
        input.valueAsNumber = value;

        const event = new Event('change');
        Object.defineProperty(event, 'target', {
          value: input,
          enumerable: true,
        });

        return event;
      };

      spectator.component.changeDuration(createInputEvent(3000));
      expect(spectator.component.duration()).toBe(3000);

      spectator.component.changeDuration(createInputEvent(5000));
      expect(spectator.component.duration()).toBe(5000);

      spectator.component.changeDuration(createInputEvent(1000));
      expect(spectator.component.duration()).toBe(1000);
    });
  });

  describe('Message Change Handling', () => {
    it('should call changeMessage method with string parameter', () => {
      const spy = jest.spyOn(spectator.component, 'changeMessage');
      spectator.component.changeMessage('test message');

      expect(spy).toHaveBeenCalledWith('test message');
      spy.mockRestore();
    });

    it('should log message when changeMessage is called', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      spectator.component.changeMessage('Hello World');

      expect(consoleSpy).toHaveBeenCalledWith('changeMessage', 'Hello World');
      consoleSpy.mockRestore();
    });
  });

  describe('Observable Emissions', () => {
    it('should emit correct sequence through obsWithInit$', done => {
      const values: string[] = [];

      spectator.component.obsWithInit$.subscribe(value => {
        values.push(value);
      });

      expect(values).toContain('init value');

      spectator.component.emitWithInit();

      setTimeout(() => {
        expect(values).toContain('new value');
        expect(values.length).toBe(2);
        done();
      }, 0);
    });

    it('should handle multiple emissions on obsWithInit$', done => {
      const values: string[] = [];

      spectator.component.obsWithInit$.subscribe(value => {
        values.push(value);
      });

      expect(values.length).toBe(1);

      spectator.component.emitWithInit();
      spectator.component.emitWithInit();

      setTimeout(() => {
        expect(values.length).toBe(3);
        expect(values[1]).toBe('new value');
        expect(values[2]).toBe('new value');
        done();
      }, 0);
    });
  });
});
