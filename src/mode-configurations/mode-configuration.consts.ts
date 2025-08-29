export const modeConfigurationDefaults = {
  minLevel: 1,
  maxLevel: 100000,
  minTimer: 10,
  maxTimer: 300,
  minReward: 100,
  maxReward: 5000,
} as const;

export const modeConfigurationsConfig = {
  levels: {
    total: 1000,
    easy: 25,
    medium: 45,
    hard: 30,
  },
  ranges: {
    easy: {
      min_reward: 100,
      max_reward: 500,
      min_timer: 30,
      max_timer: 120,
    },
    medium: {
      min_reward: 500,
      max_reward: 2000,
      min_timer: 20,
      max_timer: 60,
    },
    hard: {
      min_reward: 2000,
      max_reward: 5000,
      min_timer: 10,
      max_timer: 30,
    },
  },
  weights: {
    reward: 45,
    time: 30,
    level: 15,
    overall_fit: 10,
  },
  scoring: {
    perfect_score: 100,
    min_score: 0,
  },
};
