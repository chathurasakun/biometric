import React, { Component } from 'react';
import { AsyncStorage, ActivityIndicator, View, Image } from 'react-native';
import { Actions } from 'react-native-router-flux';
import Images from '../utils/images';

class Init extends Component {

    componentDidMount = () => {
        AsyncStorage.getItem('key').then((token) => {
            if (token) {
                Actions.dashboard();
            }
            else {
                Actions.login();
            }
        });
    }

    render = () => {
        return (
            <View style={{ flexDirection: 'row', flex: 1 }}>
                <Image
                    source={Images.splashLogo3}
                    style={{ flex: 1, width: null, height: null }}
                    blurRadius={100}
                    resizeMode='stretch'
                />
                <ActivityIndicator
                    size='large'
                    color='#FFFFFF'
                    style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                />
            </View>
        )
    }
}

export default Init;