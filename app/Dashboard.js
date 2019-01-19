import React, { Component } from 'react';
import { ActivityIndicator, AsyncStorage, FlatList, View, Text, TouchableHighlight } from 'react-native';
import { Header, Container } from 'native-base';
import baseUrl from './BaseUrl';
import styles from '../styles/Style';
import { Actions } from 'react-native-router-flux';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

class Dashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isFetching: false,
            gridaData: []
        }
    }

    componentDidMount = () => {
        this.getGridData();
    }

    async logout() {
        try {
            await AsyncStorage.removeItem('key');
            Actions.login();
            return true;
        }
        catch (exception) {
            return false;
        }
    }

    getGridData = () => {
        AsyncStorage.getItem('key').then((token) => {
            this.setState({ isFetching: true }, () => {
                fetch(`${baseUrl.url}17117/api/org/machine`, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'token': token,
                    },
                })
                    .then((response) => response.json())
                    .then((responseJson) => {
                        if (responseJson !== null) {
                            console.log(responseJson);
                            this.setState({
                                gridaData: responseJson,
                                isFetching: false
                            });
                        }
                        else
                            this.setState({ isFetching: false });
                    })
            });
        });
    }

    renderListItem = (item) => {
        let warranty = item.warranty.toString();
        return (
            <View style={{ flexDirection: 'column' }}>
                <View style={{ flexDirection: 'row' }}>
                    <Text>serial number:</Text>
                    <Text>{item.serialNumber}</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <Text>model:</Text>
                    <Text>{item.model}</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <Text>manufacturaer:</Text>
                    <Text>{item.manufacturer}</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <Text>warranty:</Text>
                    <Text>{warranty}</Text>
                </View>
            </View>
        )
    }

    render = () => {
        return (
            <Container>
                <Header style={{ backgroundColor: 'blue' }}>

                </Header>

                <FlatList
                    data={this.state.gridaData}
                    keyExtractor={(item, index) => item.id}
                    renderItem={({ item }) => this.renderListItem(item)}
                />

                <View style={{ marginTop: hp('5%'), justifyContent: 'center', alignItems: 'center' }}>
                    <TouchableHighlight style={[styles.buttonContainer, styles.loginButton]} onPress={() => this.logout()}>
                        <Text style={styles.loginText}>Logout</Text>
                    </TouchableHighlight>
                </View>

                {(this.state.isFetching) ?
                    <ActivityIndicator
                        style={{
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            top: 0,
                            bottom: 0,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        animating size='large'
                        color='#00ff00'
                    />
                    :
                    null
                }
            </Container>
        )
    }
}

export default Dashboard;