import React from 'react';
import ReactDom from 'react-dom';
import MineSweeper from './components/MineSweeper.jsx';
import './static/main.less'

ReactDom.render(<MineSweeper/>, document.getElementById('mineSweeper'))
