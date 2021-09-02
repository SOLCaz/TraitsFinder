import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Home from '../pages/Home';
import RarityInfo from '../pages/RarityInfo';
import MyForm from '../components/MyForm';

const Main = () => {
  return (
    <Switch> {/* The Switch decides which component to show based on the current URL.*/}
      <Route exact path='/' component={Home}></Route>
      <Route exact path='/scan' component={MyForm}></Route>
      <Route exact path='/collection' component={RarityInfo}></Route>

    </Switch>
  );
}

export default Main;