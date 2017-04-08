
import React, { Component, PropTypes } from 'react';
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
  TextInput,
} from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';

const Realm = require('realm');

export default class MyScene extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    onForward: PropTypes.func.isRequired,
    onBack: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    let realm = new Realm({
      schema: [{
        name: 'MyTasks',
        primaryKey: 'id',
        properties: {
          id: 'int',
          name: 'string',
          status: 'int'
        }
      }]
    });

    let tasks = realm.objects('MyTasks').sorted('id', 1);
    let arrTasks = [];
    let taskName = '';

    _fetchTasks = (() => {
      arrTasks = [];
      if (tasks.length == 0){
        arrTasks.push([0, 'Start your tasks here :)', 9]);
      }
      for (let i = 0, len = tasks.length; i < len; i++){
        arrTasks.push([tasks[i].id, tasks[i].name, tasks[i].status]);
      }
    });
    
    _addTask = (() => {
      if (this.taskName != undefined ){
        console.log('DEBUG');
        console.log(this.taskName.text);

        this._textInput.setNativeProps({text: ''});

        realm.write(() => {
          realm.create('MyTasks', {
            id: new Date().getTime(),
            name: this.taskName.text,
            status: 9
          });
        });

        _fetchTasks();
        console.log(arrTasks[0]);
        this.setState({
          dataSource: ds.cloneWithRows(
            arrTasks
          ),
        });
        this.taskName = undefined;
      }
    });

    _abortTask = ((taskid, secId, rowId, rowMap) => {
      try{
        rowMap[secId+rowId].closeRow();
        realm.write(() => {
          let task = realm.create('MyTasks', {id: taskid}, true);
          realm.delete(task);
        });

        _fetchTasks();
        this.setState({
          dataSource: ds.cloneWithRows(
            arrTasks
          ),
        });
      }catch(err){
        console.log("ERROR");
        Alert.alert(
          'Cannot abort this item',
          'Please create your first task'
        );
      }
    });

    _doneTask = ((taskid, secId, rowId, rowMap) => {
      try{
        rowMap[secId+rowId].closeRow();
        realm.write(() => {
          realm.create('MyTasks', {id: taskid, status: 0}, true);
        });

        _fetchTasks();
        this.setState({
          dataSource: ds.cloneWithRows(
            arrTasks
          ),
        });
      }catch(err){
        console.log("ERROR");
        Alert.alert(
          'Cannot update this item',
          'Please create your first task'
        );
      }
    });

    /* Get data when start the app */
    _fetchTasks();

    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows(
        arrTasks
      ),
      refreshing: false,
    };

  }

  render(){
    if(this.props.sceneid == 0){
      return (
        <View style = {styles.container}>
          <View
            style = {styles.header}
          >
            <TouchableHighlight
              onPress={this.props.onForward}
            >
              <Text
                style = {styles.headerText}
              >
                One Word Plan
              </Text>
            </TouchableHighlight>
          </View>
          <SwipeListView
            dataSource = {this.state.dataSource}
            renderRow = {(rowData)=>
              <View style={styles.item}>
                <Text>
                  {rowData[1]}
                </Text>
                <View>
                  {rowData[2] ==0 ? <Text> <Image source={require('./images/check-512.png')} style={{width: 25, height: 25}} /></Text> : <Text></Text>}
                </View>
              </View>
            }
            renderHiddenRow={ (data, secId, rowId, rowMap)=> 
                <View style={styles.rowBack}>
                  <TouchableHighlight
                    style={styles.btnAbort}
                    onPress = {() => _abortTask(data[0], secId, rowId, rowMap)}
                  >
                    <Text>Abort</Text>
                  </TouchableHighlight>
                  <TouchableHighlight
                    style={styles.btnDone}
                    onPress = {() => _doneTask(data[0], secId, rowId, rowMap)}
                  >
                    <Text>Done</Text>
                  </TouchableHighlight>
                </View>
            }
            leftOpenValue={75}
            rightOpenValue={-75}
          />

          <View style={{
            paddingLeft: 10,
            paddingRight: 10,
            backgroundColor: '#EEE',
          }}>
            <TextInput
              ref={component => this._textInput = component}
              style={styles.textinput}
              autoFocus={true}
              blurOnSubmit={true}
              maxLength={50}
              placeholder="Add your task here :)"
              onChangeText={(text) => this.taskName = {text}}
              onSubmitEditing={_addTask}
            />
          </View>

          <TouchableHighlight  
            style={styles.button}
            onPress={_addTask}
          >
            <Text>
              Submit
            </Text>
          </TouchableHighlight>

        </View>
      );
    }else{
      return(
        <View style={styles.container}>
          <Text
            style={{
              flex: 1,
              marginTop: 20,
            }}
          >
            One Word Plan's purpose is to make your daily work easier. {'\n\n'}
            This app is written by using React Native. The back end database is Realm. Please feel free to use it on any purpose.
          </Text>

          <TouchableHighlight 
            style={styles.button}
            onPress={this.props.onGohome}
          >
            <Text>
              Go home
            </Text>
          </TouchableHighlight>

        </View>
      );
    }
  }

}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderColor: '#CCC',
  },
  header: {
    height: 60,
    backgroundColor: '#EEE',
    borderBottomColor: '#DDD',
    borderColor: 'transparent',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 25,
  },
  textinput: {
    height: 60,
    fontSize: 25,
    backgroundColor: '#FFF',
    borderColor: '#CCC',
    borderWidth: 1,
    borderRadius: 5,
    padding: 7,
  },
  button: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#24CE84",
    marginTop:2,
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderBottomColor: '#EEE',
    borderColor: 'transparent',
    borderWidth: 1,
    paddingLeft: 16,
    paddingTop: 14,
    paddingBottom: 16,
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#DDD',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
  },
  btnAbort: {
    flex: 1,
    flexDirection: 'row',
    height: 70,
    alignItems: 'center',
    paddingLeft: 15,
    marginLeft:-20,
    backgroundColor: '#CE2484',
  },
  btnDone: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    height: 70,
    alignItems: 'center',
    paddingRight: 15,
    backgroundColor: '#24CE84',
  },
});