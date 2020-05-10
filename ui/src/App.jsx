import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import Main from './Main.jsx';

const element = (
  <Router>
    <Main />
  </Router>
);

ReactDOM.render(element, document.getElementById('contents'));
