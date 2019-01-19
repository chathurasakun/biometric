/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Scene, Router } from 'react-native-router-flux';
import Login from './app/Login';
import Dashboard from './app/Dashboard';
import Init from './app/Init';

class App extends Component {

  render = () => {
    return (
      <Router>
        <Scene key='root' hideNavBar>
          <Scene
            key='init'
            component={Init}
            type='replace'
            initial
          />
          <Scene
            key='login'
            component={Login}
            type='replace'
          />
          <Scene
            key='dashboard'
            component={Dashboard}
            type='replace'
          />
        </Scene>
      </Router>
    )
  }
}

export default App;
