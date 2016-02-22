import React from 'react';
import Cell from './Cell.jsx';


export default class Row extends React.Component {
  render () {
    const cells = this.props.cells.map((cell, index) => {
      return (
        <Cell key={index}
              cell={cell}
              status={this.props.status}
              expose={this.props.expose}
              flag={this.props.flag}/>
      );
    });
    return (
      <tr>{cells}</tr>
    );
  }
}
