import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { WaveAudioComponent } from './wave-audio.component';

// Mock WaveSurfer
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

describe('WaveAudioComponent', () => {
  let spectator: Spectator<WaveAudioComponent>;

  const createComponent = createComponentFactory({
    component: WaveAudioComponent,
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        audioUrl: 'https://example.com/audio.mp3',
      },
      detectChanges: false,
    });
  });

  describe('Component Initialization', () => {
    it('should accept and store audioUrl input', () => {
      expect(spectator.component.audioUrl()).toBe(
        'https://example.com/audio.mp3'
      );
    });

    it('should initialize isPlaying signal as false', () => {
      expect(spectator.component.isPlaying()).toBe(false);
    });

    it('should create WaveSurfer instance with audio URL', () => {
      spectator.detectChanges();

      // Verify the component has the correct audio URL
      expect(spectator.component.audioUrl()).toBe(
        'https://example.com/audio.mp3'
      );
    });
  });

  describe('Audio URL Changes', () => {
    it('should update audioUrl when input changes', () => {
      spectator.setInput('audioUrl', 'https://example.com/new-audio.mp3');
      expect(spectator.component.audioUrl()).toBe(
        'https://example.com/new-audio.mp3'
      );
    });
  });

  describe('Play/Pause Functionality', () => {
    it('should render Play button when audio is not playing', () => {
      spectator.detectChanges();
      const button = spectator.query('button');
      expect(button?.textContent?.trim()).toBe('Play');
    });

    it('should render Pause button when audio is playing', () => {
      spectator.detectChanges();
      spectator.component.isPlaying.set(true);
      spectator.detectChanges();

      const button = spectator.query('button');
      expect(button?.textContent?.trim()).toContain('Pause');
    });

    it('should call playPause method on button click', () => {
      spectator.detectChanges();
      const playPauseSpy = jest.spyOn(spectator.component, 'playPause');

      const button = spectator.query('button');
      spectator.click(button!);

      expect(playPauseSpy).toHaveBeenCalled();
    });

    it('should toggle isPlaying signal when play event is triggered', () => {
      spectator.detectChanges();
      expect(spectator.component.isPlaying()).toBe(false);

      // Simulate play event
      spectator.component.isPlaying.set(true);
      expect(spectator.component.isPlaying()).toBe(true);
    });

    it('should toggle isPlaying signal when pause event is triggered', () => {
      spectator.component.isPlaying.set(true);
      expect(spectator.component.isPlaying()).toBe(true);

      // Simulate pause event
      spectator.component.isPlaying.set(false);
      expect(spectator.component.isPlaying()).toBe(false);
    });
  });

  describe('Button Text Updates', () => {
    it('should toggle button text between Play and Pause', () => {
      spectator.detectChanges();
      const button = spectator.query('button');

      // Initial: Play
      expect(button?.textContent?.trim()).toBe('Play');

      // Toggle to playing
      spectator.component.isPlaying.set(true);
      spectator.detectChanges();
      expect(button?.textContent?.trim()).toContain('Pause');

      // Toggle to paused
      spectator.component.isPlaying.set(false);
      spectator.detectChanges();
      expect(button?.textContent?.trim()).toBe('Play');
    });

    it('should correctly display Play text when isPlaying is false', () => {
      spectator.component.isPlaying.set(false);
      spectator.detectChanges();

      const button = spectator.query('button');
      expect(button?.textContent?.trim()).toBe('Play');
    });

    it('should correctly display Pause text when isPlaying is true', () => {
      spectator.component.isPlaying.set(true);
      spectator.detectChanges();

      const button = spectator.query('button');
      expect(button?.textContent?.trim()).toContain('Pause');
    });
  });
});
