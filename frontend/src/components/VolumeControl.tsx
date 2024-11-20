import React, { useState } from 'react';
import SoundManager from '../utils/SoundManager';
import './VolumeControl.css';

const VolumeControl: React.FC = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(50);

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(event.target.value);
    setVolume(newVolume);
    SoundManager.setVolume(newVolume / 100);
    SoundManager.play('buttonClick');
  };

  const handleMuteToggle = () => {
    const newMutedState = SoundManager.toggleMute();
    setIsMuted(newMutedState);
    if (!newMutedState) {
      SoundManager.play('buttonClick');
    }
  };

  return (
    <div className="volume-control">
      <button 
        className="mute-button"
        onClick={handleMuteToggle}
        aria-label={isMuted ? 'Unmute' : 'Mute'}
      >
        {isMuted ? '🔇' : '🔊'}
      </button>
      <input
        type="range"
        min="0"
        max="100"
        value={volume}
        onChange={handleVolumeChange}
        className="volume-slider"
        aria-label="Volume"
      />
    </div>
  );
};

export default VolumeControl; 