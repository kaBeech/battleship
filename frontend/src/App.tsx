import React from 'react';
import Game from './components/Game';
import SoundAttributions from './components/SoundAttributions';
import './styles/SoundAttributions.css';

const App: React.FC = () => {
  return (
    <div className="App" role="main">
      <Game />
      <SoundAttributions />
    </div>
  );
};

export default App; 


