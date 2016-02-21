import React from 'react';
import Table from './Table.jsx';
import {GameStatus, Level} from '../lib/constants.js';

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

export default class MineSweeper extends React.Component {
  reset (level=Level.EASY) {
    clearInterval(this.interval);
    const config = getLevelConfiguration(level);
    const maxExposedCount = (config.rowCount * config.colCount) - config.mineCount;
    this.setState({
      status: GameStatus.NEW,
      level: level,
      rowCount: config.rowCount,
      colCount: config.colCount,
      mineCount: config.mineCount,
      maxExposedCount: maxExposedCount,
      exposedCount: 0,
      flaggedCount: 0,
      time: 0
    });
  }

  setEasy () {
    this.reset(Level.EASY);
  }

  setMedium () {
    this.reset(Level.MEDIUM);
  }

  setHard () {
    this.reset(Level.HARD);
  }

  exposedMine () {
    this.setState({status: GameStatus.LOST})
  }

  exposed () {
    this.setState(previousState => {
      const exposedCount = previousState.exposedCount + 1
      let newState = {exposedCount};
      if (exposedCount === this.state.maxExposedCount) {
        newState['status'] = GameStatus.WON;
      }
      if (exposedCount === 1) {
        newState['status'] = GameStatus.IN_PROGRESS;
      }
      return newState;
    });
  }

  toggledFlag (hasFlag) {
    this.setState(previousState => {
      return {flaggedCount: previousState.flaggedCount + (hasFlag ? 1 : -1)};
    });
  }

  componentWillMount () {
    this.reset();
  }

  makeLevelInput (level, buttonText) {
    return (
      <label><input type='radio' name='level'
                    onChange={() => this.reset(level)}
                    checked={this.state.level === level ? 'checked' : null}/>{buttonText}</label>
    );
  }

  render () {
    return (
      <div>
          <div>
              {this.makeLevelInput(Level.EASY, 'Easy')}
              {this.makeLevelInput(Level.MEDIUM, 'Normal')}
              {this.makeLevelInput(Level.HARD, 'Hard')}
          </div>
          <div>
              <div onClick={() => this.reset(this.state.level)}>Reset</div>
              <div>Time: {this.state.time}</div>
              <div>Flagged: {this.state.flaggedCount}</div>
              <div>Cleared: {this.state.exposedCount}</div>
              <Table status={this.state.status}
                     rowCount={this.state.rowCount}
                     colCount={this.state.colCount}
                     mineCount={this.state.mineCount}
                     exposedCount={this.state.exposedCount}
                     flaggedCount={this.state.flaggedCount}
                     exposedMine={this.exposedMine.bind(this)}
                     exposed={this.exposed.bind(this)}
                     toggledFlag={this.toggledFlag.bind(this)}/>
          </div>
      </div>
    );
  }
}
