import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router, Route, Redirect } from 'react-router-dom'
import './index.css';
import Home from './pages/Home';
import RarityInfo from './pages/RarityInfo';


ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Route exact path="/">
        <RarityInfo />
      </Route>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
