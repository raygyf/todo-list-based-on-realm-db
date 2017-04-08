/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  ListView,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  RefreshControl,
  Image,
  Alert,
  Navigator,
} from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import MyScene from './MyScene';

const Realm = require('realm');

export default class AwesomeProject extends Component {
 
  render() {    
    return (
      <Navigator 
        ref="myNavigator"
        initialRoute={{ title: 'My Initial Scene', index: 0}}
        renderScene={(route, navigator) =>
          <MyScene 
            title={route.title}
            sceneid={route.index}

            onForward={ ()=> {
              const nextIndex = route.index + 1;
              navigator.push({
                title: 'Scene ' + nextIndex,
                sceneid: nextIndex,
                index: nextIndex,
              });
            }}

            onBack={ ()=> {
              if (route.index > 0) {
                navigator.pop();
              }
            }}

            onGohome={ ()=> {
              if (route.index != 0) {
                navigator.popToTop(0);
              }
            }}
          />
        }
        configureScene={(route, routeStack) =>
          Navigator.SceneConfigs.FloatFromBottom
        }
      />
    );
  }
}


AppRegistry.registerComponent('AwesomeProject', () => AwesomeProject);