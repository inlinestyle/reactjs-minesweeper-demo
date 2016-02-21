import React from 'react';
import Row from './Row.jsx';
import {GameStatus} from '../lib/constants.js';


const isNumber = n => {
  return !isNaN(parseFloat(n)) && isFinite(n);
}


export default class Table extends React.Component {
  createGrid (rowCount, colCount) {
    let grid = [];
    for (let row = 0; row < rowCount; row++) {
      grid.push([]);
      for (let col = 0; col < colCount; col++) {
        grid[row].push({
          isExposed: false,
          hasMine: false,
          hasFlag: false,
          neighboringMineCount: null, // Calculated lazily
          x: col,
          y: row
        });
      }
    }
    return grid;
  }

  setMinesOnGrid (grid, rowCount, colCount, mineCount) {
    // Assumes a fresh grid.
    let unusedIndexes = [];
    const cellCount = rowCount * colCount;
    for (let i = 0; i < cellCount; i++) {
      unusedIndexes.push(i);
    }
    for (let i = 0; i < mineCount; i++) {
      const mineIndex = Math.floor(Math.random() * unusedIndexes.length);
      const cellIndex = unusedIndexes.splice(mineIndex, 1)[0];
      grid[Math.floor(cellIndex / colCount)][cellIndex % colCount].hasMine = true;
    }
  }

  setGridFromProps (props) {
    let grid = this.createGrid(props.rowCount, props.colCount);
    this.setMinesOnGrid(grid, props.rowCount, props.colCount, props.mineCount);
    this.setState({grid});
  }

  ensureNeighboringMineCount(cell) {
    if (!isNumber(cell.neighboringMineCount)) {
      cell.neighboringMineCount = this.calculateNeighboringMineCount(cell);
    }
  }

  calculateNeighboringMineCount (cell) {
    let neighboringMineCount = 0;
    this.eachNeighbor(cell, neighbor => {
      if (neighbor.hasMine) {
        neighboringMineCount++;
      }
    });
    return neighboringMineCount;
  }

  eachNeighbor (cell, callback) {
    const x = cell.x;
    const y = cell.y;
    const maxRow = y + 2;
    for (let row = y - 1; row < maxRow; row++) {
      const maxCol = x + 2;
      for (let col = x - 1; col < maxCol; col++) {
        if (row >= 0 && row < this.props.rowCount) {
          if (col >= 0 && col < this.props.colCount) {
            if ([row, col] != [y, x]) {
              callback(this.state.grid[row][col]);
            }
          }
        }
      }
    }
  }

  exposeNeighboringCells (cell) {
    // Assumes that cell.neighboringMineCount === 0
    this.eachNeighbor(cell, neighbor => {
      if (!neighbor.isExposed) {
        this.expose(neighbor);
      }
    });
  }

  expose (cell) {
    let grid = this.state.grid;
    let cell_ = grid[cell.y][cell.x];
    if (cell_.hasFlag || cell_.isExposed) {
      return;
    }
    cell_.isExposed = true;
    if (cell_.hasMine) {
      this.props.exposedMine();
      this.setState({grid});
      return;
    }
    this.ensureNeighboringMineCount(cell_);
    this.setState({grid});
    this.props.exposed();
    if (!cell_.neighboringMineCount) {
      this.exposeNeighboringCells(cell_);
    }
  }

  flag (cell) {
    let grid = this.state.grid;
    let cell_ = grid[cell.y][cell.x];
    cell_.hasFlag = !cell_.hasFlag;
    this.setState({grid});
    this.props.toggledFlag(cell_.hasFlag);
  }

  componentWillMount () {
    this.setGridFromProps(this.props);
  }

  componentWillReceiveProps (props) {
    if (props.status === GameStatus.NEW) {
      this.setGridFromProps(props);
    }
  }

  render () {
    const rows = this.state.grid.map((row, index) => {
      return (
        <Row key={index}
             cells={row}
             status={this.props.status}
             expose={this.expose.bind(this)}
             flag={this.flag.bind(this)}/>
      )
    });
    return (
      <table>
          <tbody>
              {rows}
          </tbody>
      </table>
    );
  }
}
