class SoundManager {
  private static sounds: { [key: string]: HTMLAudioElement } = {
    placement: new Audio('/sounds/placement.mp3'),
    hit: new Audio('/sounds/hit.mp3'),
    miss: new Audio('/sounds/miss.mp3'),
    rotate: new Audio('/sounds/rotate.mp3'),
    victory: new Audio('/sounds/victory.mp3'),
    defeat: new Audio('/sounds/defeat.mp3'),
    gameStart: new Audio('/sounds/game-start.mp3'),
    hover: new Audio('/sounds/hover.mp3'),
    invalidPlacement: new Audio('/sounds/invalid.mp3'),
    buttonClick: new Audio('/sounds/click.mp3'),
    victoryFanfare: new Audio('/sounds/victory-fanfare.mp3'),
    defeatDrum: new Audio('/sounds/defeat-drum.mp3'),
    firework: new Audio('/sounds/firework.mp3'),
    medal: new Audio('/sounds/medal.mp3'),
    applause: new Audio('/sounds/applause.mp3')
  };

  private static isMuted: boolean = false;
  private static volume: number = 0.5;

  static init(): void {
    Object.values(this.sounds).forEach(sound => {
      sound.load();
      sound.volume = this.volume;
    });

    this.sounds.victoryFanfare.volume = this.volume * 0.7;
    this.sounds.applause.volume = this.volume * 0.5;
    this.sounds.firework.volume = this.volume * 0.3;
  }

  static async play(soundName: keyof typeof SoundManager.sounds): Promise<void> {
    if (this.isMuted) return;

    const sound = this.sounds[soundName];
    if (sound) {
      try {
        // Create a new Audio instance for each play to allow overlapping sounds
        const newSound = new Audio(sound.src);
        newSound.volume = sound.volume;
        await newSound.play();
      } catch (error) {
        console.log('Sound play failed:', error);
      }
    }
  }

  static async playGameOverSequence(isVictory: boolean): Promise<void> {
    if (this.isMuted) return;

    try {
      if (isVictory) {
        await this.play('victory');
        await new Promise(resolve => setTimeout(resolve, 500));
        await this.play('victoryFanfare');
        await new Promise(resolve => setTimeout(resolve, 800));
        await this.play('applause');
        
        // Play firework sounds with delays
        for (let i = 0; i < 3; i++) {
          setTimeout(async () => {
            if (!this.isMuted) {
              await this.play('firework');
            }
          }, 1000 + Math.random() * 1500);
        }
      } else {
        await this.play('defeat');
        await new Promise(resolve => setTimeout(resolve, 300));
        await this.play('defeatDrum');
      }
    } catch (error) {
      console.log('Game over sequence failed:', error);
    }
  }

  static setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
    Object.values(this.sounds).forEach(sound => {
      sound.volume = this.volume;
    });
  }

  static toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  static setMuted(muted: boolean): void {
    this.isMuted = muted;
  }

  static stopAll(): void {
    Object.values(this.sounds).forEach(sound => {
      sound.pause();
      sound.currentTime = 0;
    });
  }
}

export default SoundManager; 