import React from 'react';
import Cell from './Cell.jsx';


export default class Row extends React.Component {
  render () {
    return (
      <tr>{this.props.cells.map((cell, index) => <Cell key={index} cell={cell} expose={this.props.expose} flag={this.props.flag}/>)}</tr>
    );
  }
}
