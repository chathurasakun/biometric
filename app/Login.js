import React, { Component } from 'react';
import { Alert, Image, Text, TextInput, TouchableHighlight, View, ActivityIndicator, Dimensions, Platform } from 'react-native';
import { Container } from 'native-base';
import styles from '../styles/Style';
import Images from '../utils/images';
import baseUrl from './BaseUrl';
import deviceStorage from './deviceStorage';
import { Actions } from 'react-native-router-flux';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            emailError: '',
            isFetching: false,
            passError: '',
            latitude: null,
            longitude: null,
        }
    }

    componentWillMount = () => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                this.setState({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    error: null,
                });
            },
            (error) => this.setState({ error: error.message }),
            Platform.OS === 'android' ? {} : { enableHighAccuracy: true, timeout: 20000, maximumAge: 10000 },
        );
    }

    emailIsEmpty = (text) => {
        if (text === '') {
            this.setState({
                emailError: 'Please enter Email address',
                username: text
            });
        }
        else {
            this.setState({
                emailError: '',
                username: text
            });
        }
    }

    passwordIsEmpty = (text) => {
        if (text === '') {
            this.setState({
                passError: 'Please enter a password',
                password: text
            });
        }
        else {
            this.setState({
                passError: '',
                password: text
            });
        }
    }

    loginUser = () => {
        if (this.state.username !== '' && this.state.password !== '' && this.state.emailError === '' && this.state.passError === '') {
            const data = {
                username: this.state.username,
                password: this.state.password
            }

            this.setState({ isFetching: true }, () => {
                fetch(`${baseUrl.url}17100/api/identity/token`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                })
                    .then((response) => response.json())
                    .then((responseJson) => {
                        if (responseJson !== null && responseJson.status !== 403) {
                            deviceStorage.saveItem('key', responseJson.token);
                            this.setState({
                                username: '',
                                password: '',
                                isFetching: false
                            }, () => Actions.biometric());
                        }
                        else if (responseJson.status === 403) {
                            this.setState({ isFetching: false }, () => {
                                Alert.alert(
                                    'Login Unsuccessful!',
                                    `${responseJson.message}`,
                                    [
                                        {
                                            text: 'Ok',
                                            onPress: console.log('ok pressesd'),
                                        },
                                    ],
                                    { cancelable: false }
                                )
                            });
                        }
                    })
            });
        }
        else {
            if (this.state.password === '') {
                this.setState({
                    passError: 'Please enter a password'
                });
            }
            if (this.state.username === '') {
                this.setState({
                    emailError: 'Please enter Email address'
                });
            }
        }
    }

    render = () => {
        return (
            <Container>
                {(Dimensions.get('window').width === 768 || Dimensions.get('window').width === 834) ?
                    <Image
                        source={Images.splashScreen4}
                        style={{
                            height: hp('100%'),
                            width: wp('100%'),
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    />
                    :
                    (Dimensions.get('window').width === 1024) ?
                        <Image
                            source={Images.splashScreen5}
                            style={{
                                height: hp('100%'),
                                width: wp('100%'),
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        />
                        :
                        <Image
                            source={Images.splashScreen2}
                            style={{
                                height: hp('100%'),
                                width: wp('100%'),
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        />
                }
                <View
                    style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0,
                        alignItems: 'center'
                    }}
                >
                    <View style={{ top: hp('24%') }}>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.inputs}
                                editable={true}
                                placeholder='Username'
                                placeholderTextColor='#BBBDC0'
                                ref='username'
                                keyboardType='email-address'
                                underlineColorAndroid='transparent'
                                onChangeText={(username) => this.emailIsEmpty(username)}
                                value={this.state.username}
                            />
                        </View>
                        <Text style={{ color: '#FF2F2F', fontSize: hp('1.9%') }}>{this.state.emailError}</Text>

                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.inputs}
                                editable={true}
                                placeholder='Password?'
                                placeholderTextColor='#BBBDC0'
                                ref='password'
                                returnKeyType='next'
                                secureTextEntry={true}
                                underlineColorAndroid='transparent'
                                onChangeText={(password) => this.passwordIsEmpty(password)}
                                value={this.state.password}
                            />
                        </View>
                        <Text style={{ color: '#FF2F2F', fontSize: hp('1.9%') }}>{this.state.passError}</Text>
                    </View>

                    <View style={{ top: hp('32%') }}>
                        <TouchableHighlight style={[styles.buttonContainer, styles.loginButton]} onPress={() => this.loginUser()}>
                            <Text style={styles.loginText}>Login</Text>
                        </TouchableHighlight>
                    </View>
                    <View style={{ top: hp('50%') }}>
                        <Text>Latitude: {this.state.latitude}</Text>
                        <Text>Longitude: {this.state.longitude}</Text>
                    </View>
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

export default Login;