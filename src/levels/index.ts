export interface Level {
  powerups: number;
  spacemen: number;
  delay: number;
  radius: number;
}

export const levels: Level[] = [
  // 0
  {
    powerups: 1,
    spacemen: 10,
    delay: 500,
    radius: 0.01,
  },
];
