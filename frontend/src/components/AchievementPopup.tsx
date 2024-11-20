import React from 'react';
import { Achievement } from '../utils/AchievementManager';
import './AchievementPopup.css';
import { CSSTransition } from 'react-transition-group';

interface AchievementPopupProps {
  achievement: Achievement;
  onClose: () => void;
}

const AchievementPopup: React.FC<AchievementPopupProps> = ({ achievement, onClose }) => {
  return (
    <CSSTransition
      in={true}
      appear={true}
      timeout={500}
      classNames="achievement"
    >
      <div className="achievement-popup">
        <div className="achievement-content">
          <div className="achievement-icon">{achievement.icon}</div>
          <div className="achievement-text">
            <h3>{achievement.name}</h3>
            <p>{achievement.description}</p>
          </div>
          <button className="achievement-close" onClick={onClose}>×</button>
        </div>
      </div>
    </CSSTransition>
  );
};

export default AchievementPopup; 