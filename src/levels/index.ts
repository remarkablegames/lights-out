import { levels } from './levels';

export interface Level {
  level: number;
  powerups: number;
  spacemen: number;
  delay: number;
  radius: number;
}

export function getLevel(currentLevel: number) {
  const level = levels[currentLevel];
  if (level) {
    return {
      ...level,
      level: currentLevel,
    };
  }
}
