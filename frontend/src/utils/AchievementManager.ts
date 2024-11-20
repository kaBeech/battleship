export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: (stats: GameStats) => boolean;
  earned: boolean;
}

export interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  totalHits: number;
  totalMisses: number;
  quickestWin: number;
  winStreak: number;
  difficultyWins: Record<string, number>;
}

class AchievementManager {
  private static achievements: Achievement[] = [
    {
      id: 'first_blood',
      name: 'First Victory',
      description: 'Win your first game',
      icon: '🏆',
      condition: (stats: GameStats) => stats.gamesWon >= 1,
      earned: false
    },
    {
      id: 'sharpshooter',
      name: 'Sharpshooter',
      description: 'Achieve 70% hit accuracy in a game',
      icon: '🎯',
      condition: (stats: GameStats) => (stats.totalHits / (stats.totalHits + stats.totalMisses)) >= 0.7,
      earned: false
    },
    {
      id: 'veteran',
      name: 'Veteran Captain',
      description: 'Win 10 games',
      icon: '👨‍✈️',
      condition: (stats: GameStats) => stats.gamesWon >= 10,
      earned: false
    },
    {
      id: 'expert_victory',
      name: 'Expert Tactician',
      description: 'Win a game on Expert difficulty',
      icon: '🎖️',
      condition: (stats: GameStats) => stats.difficultyWins['Expert'] >= 1,
      earned: false
    },
    {
      id: 'winning_streak',
      name: 'Unstoppable',
      description: 'Win 3 games in a row',
      icon: '🔥',
      condition: (stats: GameStats) => stats.winStreak >= 3,
      earned: false
    },
    {
      id: 'quick_victory',
      name: 'Lightning Strike',
      description: 'Win a game in under 30 moves',
      icon: '⚡',
      condition: (stats: GameStats) => stats.quickestWin <= 30,
      earned: false
    }
  ];

  private static stats: GameStats = {
    gamesPlayed: 0,
    gamesWon: 0,
    totalHits: 0,
    totalMisses: 0,
    quickestWin: Infinity,
    winStreak: 0,
    difficultyWins: {
      Easy: 0,
      Medium: 0,
      Hard: 0,
      Expert: 0
    }
  };

  static init(): void {
    // Load stats and achievements from localStorage
    const savedStats = localStorage.getItem('battleship_stats');
    const savedAchievements = localStorage.getItem('battleship_achievements');
    
    if (savedStats) {
      this.stats = JSON.parse(savedStats);
    }
    
    if (savedAchievements) {
      const earned = JSON.parse(savedAchievements);
      this.achievements.forEach(achievement => {
        achievement.earned = earned[achievement.id] || false;
      });
    }
  }

  static updateStats(gameResult: {
    won: boolean;
    difficulty: string;
    moves: number;
    hits: number;
    misses: number;
  }): Achievement[] {
    const newAchievements: Achievement[] = [];
    
    this.stats.gamesPlayed++;
    if (gameResult.won) {
      this.stats.gamesWon++;
      this.stats.winStreak++;
      this.stats.difficultyWins[gameResult.difficulty]++;
      this.stats.quickestWin = Math.min(this.stats.quickestWin, gameResult.moves);
    } else {
      this.stats.winStreak = 0;
    }
    
    this.stats.totalHits += gameResult.hits;
    this.stats.totalMisses += gameResult.misses;

    // Check for new achievements
    this.achievements.forEach(achievement => {
      if (!achievement.earned && achievement.condition(this.stats)) {
        achievement.earned = true;
        newAchievements.push(achievement);
      }
    });

    // Save updated stats and achievements
    localStorage.setItem('battleship_stats', JSON.stringify(this.stats));
    localStorage.setItem('battleship_achievements', JSON.stringify(
      Object.fromEntries(this.achievements.map(a => [a.id, a.earned]))
    ));

    return newAchievements;
  }

  static getStats(): GameStats {
    return { ...this.stats };
  }

  static getAchievements(): Achievement[] {
    return [...this.achievements];
  }

  static reset(): void {
    this.stats = {
      gamesPlayed: 0,
      gamesWon: 0,
      totalHits: 0,
      totalMisses: 0,
      quickestWin: Infinity,
      winStreak: 0,
      difficultyWins: {
        Easy: 0,
        Medium: 0,
        Hard: 0,
        Expert: 0
      }
    };
    this.achievements.forEach(achievement => {
      achievement.earned = false;
    });
    localStorage.removeItem('battleship_stats');
    localStorage.removeItem('battleship_achievements');
  }
}

export default AchievementManager; 