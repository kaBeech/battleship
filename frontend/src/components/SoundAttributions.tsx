import React from 'react';

interface Attribution {
  name: string;
  author: string;
  url: string;
  license: string;
}

const SoundAttributions: React.FC = () => {
  const attributions: Attribution[] = [
    {
      name: 'Kick 1.mp3',
      author: 'blakengouda',
      url: 'https://freesound.org/s/509982/',
      license: 'Creative Commons 0'
    },
    {
      name: 'Dbl Click.mp3',
      author: '7778',
      url: 'https://freesound.org/s/202312/',
      license: 'Creative Commons 0'
    },
    {
      name: 'Mechanical Plastic Click 02',
      author: 'SmallConfusion',
      url: 'https://freesound.org/s/751080/',
      license: 'Attribution 4.0'
    },
    {
      name: 'Click 1.mp3',
      author: 'SomeoneCool15',
      url: 'https://freesound.org/s/423771/',
      license: 'Creative Commons 0'
    },
    {
      name: 'highlight.mp3',
      author: 'senitiel',
      url: 'https://freesound.org/s/209058/',
      license: 'Creative Commons 0'
    },
    {
      name: 'MoCaSG_FXS03.mp3',
      author: 'suspiciononline',
      url: 'https://freesound.org/s/49070/',
      license: 'Creative Commons 0'
    },
    {
      name: 'Golpe 2.mp3',
      author: 'ConBlast',
      url: 'https://freesound.org/s/557835/',
      license: 'Attribution 3.0'
    },
    {
      name: 'Cap Explosion Big.mp3',
      author: 'CGEffex',
      url: 'https://freesound.org/s/92628/',
      license: 'Attribution 4.0'
    },
    {
      name: 'Splash.mp3',
      author: 'CGEffex',
      url: 'https://freesound.org/s/93079/',
      license: 'Attribution 4.0'
    },
    {
      name: 'Final Fantasy Inspired A Capella - FANFARE',
      author: 'kai_sergio',
      url: 'https://freesound.org/s/328860/',
      license: 'Attribution NonCommercial 3.0'
    },
    {
      name: 'Long Snare Drum Roll with Cymbal Crash.mp3',
      author: 'MissloonerVoiceOver255',
      url: 'https://freesound.org/s/569113/',
      license: 'Creative Commons 0'
    },
    {
      name: 'failfare.mp3',
      author: 'Wagna',
      url: 'https://freesound.org/s/242208/',
      license: 'Creative Commons 0'
    },
    {
      name: 'Success Fanfare Trumpets.mp3',
      author: 'FunWithSound',
      url: 'https://freesound.org/s/456966/',
      license: 'Creative Commons 0'
    },
    {
      name: 'Success Resolution Video Game Fanfare Sound Effect with Drum Roll.mp3',
      author: 'FunWithSound',
      url: 'https://freesound.org/s/456969/',
      license: 'Attribution 4.0'
    },
    {
      name: 'FireworksAndPeople2.mp3',
      author: 'HerbertBoland',
      url: 'https://freesound.org/s/142023/',
      license: 'Attribution 4.0'
    },
    {
      name: 'polite applause with a few sniggers.mp3',
      author: 'dwsolo',
      url: 'https://freesound.org/s/24012/',
      license: 'Sampling+'
    }
  ];

  return (
    <div className="sound-attributions">
      <h2>Sound Attributions</h2>
      <div className="attribution-list">
        {attributions.map((attribution, index) => (
          <div key={index} className="attribution-item">
            <p>
              {attribution.name} by {attribution.author} -- {' '}
              <a href={attribution.url} target="_blank" rel="noopener noreferrer">
                {attribution.url}
              </a>{' '}
              -- License: {attribution.license}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SoundAttributions; 