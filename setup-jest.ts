import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';

// Only setup if not already done by Angular builder
try {
  setupZoneTestEnv();
} catch (error) {
  // Already initialized by ng test builder
  if (
    !(
      error instanceof Error &&
      error.message.includes(
        'Cannot set base providers because it has already been called'
      )
    )
  ) {
    throw error;
  }
}
// Mock WaveSurfer globally for all tests
jest.mock('wavesurfer.js', () => {
  return {
    default: {
      create: jest.fn(() => ({
        on: jest.fn(),
        playPause: jest.fn(),
      })),
    },
  };
});
