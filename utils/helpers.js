import { AsyncStorage } from 'react-native'
import { Notifications } from 'expo'
import * as Permissions from 'expo-permissions'

const fetch = require("node-fetch")

export const firebaseConfig = {
    apiKey: "AIzaSyCUs_BXfgDM_7tlmyeqD1cQ3FxJ1YkX4pw",
    authDomain: "crossplat-covid19.firebaseapp.com",
    databaseURL: "https://crossplat-covid19.firebaseio.com",
    projectId: "crossplat-covid19",
    storageBucket: "crossplat-covid19.appspot.com",
    messagingSenderId: "541448129801",
    appId: "1:541448129801:web:539c01a237c9f44d5bd7d8"
}

export const api = () => {
    return fetch("https://api.covid19api.com/summary")
        .then((response) => response.json())
        .then((data) => {
            data.Countries.sort((a, b) => {
                return a["TotalConfirmed"] < b["TotalConfirmed"]
            })
            return {
                sum: data.Global,
                date: data.Countries[0]["Date"],
                Countries: data.Countries
            }
        })
}

export const countriesAPI = (country) => {
    return fetch(`https://api.opencagedata.com/geocode/v1/json?q=${country}&key=bc242637ff4a4107b0eae494a73b5f2a&pretty=1`)
        .then((response) => response.json())
        .then((data) => {
            return {
                geometry: data.results[0].geometry
            }
        })

}



const NOTIFICATION_KEY = 'UdaciFlashcards:notifications'

export function clearLocalNotification() {
    return AsyncStorage.removeItem(NOTIFICATION_KEY)
        .then(Notifications.cancelAllScheduledNotificationsAsync)
}

function createNotification() {
    return {
        title: 'There is a an Updates..',
        body: "'👋 don't forget to checkout the dashboard today!",
        ios: {
            sound: true
        },
        android: {
            sound: true,
            priority: 'high',
            sticky: false,
            vibrate: true
        },
    }
}

export function setLocalNotification() {
    AsyncStorage.getItem(NOTIFICATION_KEY)
        .then(JSON.parse)
        .then((data) => {
            if (data === null) {
                Permissions.askAsync(Permissions.NOTIFICATIONS)
                    .then(({ status }) => {
                        if (status === 'granted') {
                            Notifications.cancelAllScheduledNotificationsAsync()

                            let tomorrow = new Date()
                            tomorrow.setDate(tomorrow.getDate())
                            tomorrow.setHours(18)
                            tomorrow.setMinutes(0)

                            Notifications.scheduleLocalNotificationAsync(
                                createNotification(),
                                {
                                    time: tomorrow,
                                    repeat: 'day'
                                }
                            )

                            AsyncStorage.setItem(NOTIFICATION_KEY, JSON.stringify(true))
                        }
                    })
            }
        })
}