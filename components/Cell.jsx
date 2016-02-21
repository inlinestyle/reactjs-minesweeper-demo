import React from 'react';

export default class Cell extends React.Component {
  expose () {
    this.props.expose(this.props.cell);
  }

  flag (event) {
    event.preventDefault();
    this.props.flag(this.props.cell);
  }

  cellText () {
    if (this.props.cell.isExposed) {
      if (this.props.cell.hasMine) {
        return 'M';
      }
      return this.props.cell.neighboringMineCount;
    } else if (this.props.cell.hasFlag) {
      return 'F';
    }
    return '-';
  }

  render () {
    return (
      <td onClick={this.expose.bind(this)}
          onContextMenu={this.flag.bind(this)}
          >{this.cellText()}</td>
    );
  }
}
