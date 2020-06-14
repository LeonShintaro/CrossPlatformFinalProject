import React, { useState, useEffect } from 'react'
import { StyleSheet, Text } from 'react-native'
import * as firebase from 'firebase'
import * as Google from 'expo-google-app-auth';
import * as facebook from 'expo-facebook'
import { Container, Form, Input, Item, Button, Label } from 'native-base'
import { firebaseConfig } from '../utils/helpers'


if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig)
}

const Login = ({ navigation }) => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    useEffect(() => {
        firebase.auth().onAuthStateChanged(user => {
            if (user !== null) {
                navigation.navigate('DrawerT')
            }
            else {
                console.log('no user')
            }
        })

    }, [])

    signup = (email, password) => {
        console.log("SIGNUP")
        try {
            if (password.length < 6) {
                alert("Password should be more than 6 characters")
                return
            }

            firebase.auth().createUserWithEmailAndPassword(email, password)
                .then(() => {
                    alert("Signed Up Successfully!")
                    setEmail("")
                    setPassword("")
                })
                .catch((err) => alert(err.toString()))

        } catch (err) {
            console.log(err.toString())
        }
    }

    login = (email, password) => {
        console.log("SIGNIN")
        try {
            firebase.auth().signInWithEmailAndPassword(email, password)
                .then((user) => {

                    setEmail("")
                    setPassword("")
                })
                .catch((err) => alert(err.toString()))

        } catch (err) {
            console.log(err.toString())
        }
    }

    loginFacebook = async () => {
        facebook.initializeAsync('252365966053260', 'COVID19')

        const { type, token } = await facebook.logInWithReadPermissionsAsync
            ('252365966053260', { permissions: ['public_profile'] })
            .catch((err) => alert(err.toString()))

        console.log("type:", type, "token: ", token)

        if (type == 'success') {
            const credential = firebase.auth.FacebookAuthProvider.credential(token)
            firebase.auth().signInWithCredential(credential)
                .catch((err) => alert(err.toString()))
        }
    }

      signInWithGoogleAsync = async () => {
        try {
          const result = await Google.logInAsync({
            androidClientId: '541448129801-audamoqbhnst9qp5osk162iiergu6gnk.apps.googleusercontent.com',
            iosClientId: '541448129801-o65uke0tb17774mcl2ligli531h9dkoq.apps.googleusercontent.com',
            scopes: ['profile', 'email'],
          });
      
          if (result.type === 'success') {
            return result.accessToken;
          } else {
            return { cancelled: true };
          }
        } catch (e) {
          return { error: true };
        }
      }

    return (
        <Container style={styles.container}>
            <Form>
                <Item floatingLabel>
                    <Label>Email</Label>
                    <Input autoCorrect={false} autoCapitalize='none' textContentType="emailAddress"
                        onChangeText={email => setEmail(email)}
                        value={email} />
                </Item>
                <Item floatingLabel>
                    <Label>Password</Label>
                    <Input secureTextEntry={true} autoCorrect={false} autoCapitalize='none' textContentType="password"
                        onChangeText={password => setPassword(password)}
                        value={password} />
                </Item>

                <Button full success rounded style={{ marginTop: 10 }} onPress={() => login(email, password)}>
                    <Text style={{ color: 'white' }}> Login </Text>
                </Button>

                <Button full info rounded style={{ marginTop: 10 }} onPress={() => signup(email, password)}>
                    <Text style={{ color: 'white' }}> Sign Up </Text>
                </Button>

                <Button full primary rounded style={{ marginTop: 10 }} onPress={() => loginFacebook()}>
                    <Text style={{ color: 'white' }}> Login With Facebook </Text>
                </Button>

            </Form>
        </Container>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        padding: 10
    },
})

export default Login
