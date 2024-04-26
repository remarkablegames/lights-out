export interface Level {
  level: number;
  powerups: number;
  spacemen: number;
  delay: number;
  radius: number;
}

const levels: Omit<Level, 'level'>[] = [
  // 0
  {
    powerups: 1,
    spacemen: 10,
    delay: 500,
    radius: 0.01,
  },
];

export function getLevel(currentLevel: number) {
  const level = levels[currentLevel];
  if (level) {
    return {
      ...level,
      level: currentLevel,
    };
  }
}
