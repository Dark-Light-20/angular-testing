import { createPipeFactory } from '@ngneat/spectator/jest';
import { TimeAgoPipe } from './time-ago.pipe';

describe('TimeAgoPipe', () => {
  const createPipe = createPipeFactory(TimeAgoPipe);

  describe('Recent Dates', () => {
    it('should format dates seconds ago', () => {
      const secondsAgo = new Date();
      secondsAgo.setSeconds(secondsAgo.getSeconds() - 10);

      const spectator = createPipe(
        `{{ '${secondsAgo.toISOString()}' | timeAgo }}`
      );
      const text = spectator.element.textContent || '';

      expect(text).toBeTruthy();
      expect(!text.includes('NaN')).toBe(true);
    });

    it('should format dates minutes ago', () => {
      const minutesAgo = new Date();
      minutesAgo.setMinutes(minutesAgo.getMinutes() - 5);

      const spectator = createPipe(
        `{{ '${minutesAgo.toISOString()}' | timeAgo }}`
      );
      const text = spectator.element.textContent || '';

      expect(text).toBeTruthy();
      expect(!text.includes('NaN')).toBe(true);
    });
  });

  describe('Past Dates', () => {
    it('should handle dates from the past correctly', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);

      const spectator = createPipe(
        `{{ '${pastDate.toISOString()}' | timeAgo }}`
      );
      const text = spectator.element.textContent || '';

      expect(text).toBeTruthy();
      expect(!text.includes('NaN')).toBe(true);
    });

    it('should show day difference for dates days ago', () => {
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

      const spectator = createPipe(
        `{{ '${threeDaysAgo.toISOString()}' | timeAgo }}`
      );
      const text = spectator.element.textContent || '';

      expect(text).toContain('day');
    });
  });

  describe('Future Dates', () => {
    it('should handle future dates', () => {
      const futureDate = new Date();
      futureDate.setHours(futureDate.getHours() + 2);

      const spectator = createPipe(
        `{{ '${futureDate.toISOString()}' | timeAgo }}`
      );
      const text = spectator.element.textContent || '';

      expect(text).toBeTruthy();
      expect(!text.includes('NaN')).toBe(true);
    });
  });

  describe('Date Format Handling', () => {
    it('should accept ISO date string format', () => {
      const now = new Date();
      const isoString = now.toISOString();

      const spectator = createPipe(`{{ '${isoString}' | timeAgo }}`);
      const text = spectator.element.textContent || '';

      expect(text).toBeTruthy();
      expect(!text.includes('NaN')).toBe(true);
    });

    it('should not produce NaN in output', () => {
      const validDate = new Date();
      validDate.setDate(validDate.getDate() - 7);

      const spectator = createPipe(
        `{{ '${validDate.toISOString()}' | timeAgo }}`
      );
      const text = spectator.element.textContent || '';

      expect(text.includes('NaN')).toBe(false);
    });
  });
});
