import type { Level } from './index';

export const levels: Omit<Level, 'level'>[] = [
  // 0
  {
    powerups: 1,
    spacemen: 10,
    delay: 500,
    radius: 0.01,
  },

  // 1
  {
    powerups: 3,
    spacemen: 5,
    delay: 500,
    radius: 0.01,
  },

  // 2
  {
    powerups: 5,
    spacemen: 5,
    delay: 500,
    radius: 0.01,
  },
];
