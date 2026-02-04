import { SpectatorPipe, createPipeFactory } from '@ngneat/spectator/jest';
import { ReversePipe } from './reverse.pipe';

describe('ReversePipe', () => {
  let spectator: SpectatorPipe<ReversePipe>;
  const createPipe = createPipeFactory(ReversePipe);

  it('should create an instance', () => {
    spectator = createPipe(`{{ '' | reverse }}`);
    expect(spectator.element).toBeDefined();
  });

  it('should reverse a simple string', () => {
    spectator = createPipe(`{{'Hello' | reverse}}`);
    expect(spectator.element).toHaveText('olleH');
  });

  it('should reverse a string with spaces', () => {
    spectator = createPipe(`{{'Hello World' | reverse}}`);
    expect(spectator.element).toHaveText('dlroW olleH');
  });

  it('should handle empty string', () => {
    spectator = createPipe(`{{ '' | reverse }}`);
    expect(spectator.element).toHaveText('');
  });

  it('should reverse a single character', () => {
    spectator = createPipe(`{{'A' | reverse}}`);
    expect(spectator.element).toHaveText('A');
  });

  it('should reverse a string with numbers', () => {
    spectator = createPipe(`{{'abc123' | reverse}}`);
    expect(spectator.element).toHaveText('321cba');
  });

  it('should reverse a string with special characters', () => {
    spectator = createPipe(`{{'hello@world!' | reverse}}`);
    expect(spectator.element).toHaveText('!dlrow@olleh');
  });

  it('should reverse a palindrome', () => {
    spectator = createPipe(`{{'racecar' | reverse}}`);
    expect(spectator.element).toHaveText('racecar');
  });

  it('should reverse a string with unicode characters', () => {
    spectator = createPipe(`{{'café' | reverse}}`);
    expect(spectator.element).toHaveText('éfac');
  });
});
