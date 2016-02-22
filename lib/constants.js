const GameStatus = {
  NEW: 0,
  IN_PROGRESS: 1,
  WON: 2,
  LOST: 3
};

const Level = {
  EASY: 0,
  MEDIUM: 1,
  HARD: 2
};

const isComplete = status => {
  return [GameStatus.WON, GameStatus.LOST].indexOf(status) >= 0;
}

const getLevelConfiguration = function (level) {
  switch (level) {
    case Level.EASY:
      return {mineCount: 10,  rowCount: 9,  colCount: 9};
    case Level.MEDIUM:
      return {mineCount: 40,  rowCount: 16, colCount: 16};
    case Level.HARD:
      return {mineCount: 100, rowCount: 16, colCount: 30};
  }
};


export {GameStatus, Level, isComplete, getLevelConfiguration};
