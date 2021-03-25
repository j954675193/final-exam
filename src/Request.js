import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from 'react'
import Container from 'react-bootstrap/Container'
import { useForm } from "react-hook-form"

// Firebase
import { useCollectionData } from 'react-firebase-hooks/firestore';
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

if (firebase.apps.length === 0) {
    firebase.initializeApp({
        apiKey: process.env.REACT_APP_API_KEY,
        authDomain: process.env.REACT_APP_AUTH_DOMAIN,
        databaseUrl: process.env.REACT_APP_DATABASE_URL,
        projectId: process.env.REACT_APP_PROJECT_ID,
        storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
        messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
        appId: process.env.REACT_APP_APP_ID
    })
}
const firestore = firebase.firestore()
const auth = firebase.auth()

export default function Request() {
    const { register, handleSubmit } = useForm()
    const [records, setRecords] = useState([])

    // Firebase stuff
    const moneyRef = firestore.collection('money');
    const query = moneyRef.orderBy('createdAt', 'asc').limitToLast(100);
    const [data] = useCollectionData(query, { idField: 'id' });

    const onSubmit = async (data) => {
        let preparedData = {
            name: data.name,
            phoneNumber: data.phoneNumber,
            arrivalTime: new Date(data.arrivalTime),
            departureTime: new Date(data.departureTime),
            reason: data.reason,
            createdAt: new Date(data.createdAt),
        }
        console.log('onSubmit', preparedData)

        await moneyRef
            .add(preparedData)
            .then(() => window.alert("New record has been added!"))
            .catch((error) => {
                console.error("Errror:", error)
                alert(error)
            })
    }
    return (
        <Container>
            <h1>Request Form</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input
                    type="hidden"
                    placeholder="ID"
                    innerRef={register({ required: true })}
                    name="id"
                    id="id"
                />
                <input
                    type="text"
                    placeholder="Name"
                    ref={register({ required: true })}
                    name="name"
                    id="name"
                />
                <p>Your Name</p>

                <input
                    type="text"
                    placeholder="Phone Number"
                    ref={register({ required: true })}
                    name="phoneNumber"
                    id="phoneNumber"
                />
                <p>Your Phone Number</p>

                <input
                    type="date"
                    placeholder="Arrival Time"
                    ref={register({ required: true })}
                    name="arrivalTime"
                    id="arrivalTime"
                />
                <p>Arrival Time</p>

                <input
                    type="date"
                    placeholder="Departure Time"
                    ref={register({ required: true })}
                    name="departureTime"
                    id="departureTime"
                /><br />
                <p>Departure Time</p>

                <input
                    type="text"
                    placeholder="Reason"
                    ref={register({ required: true })}
                    name="reason"
                    id="reason"
                />
                <p>Reason</p>

                <input
                    type="date"
                    placeholder="Date"
                    ref={register({ required: true })}
                    name="createdAt"
                    id="createdAt"
                /><br />
                <p>createdAt</p>

                <input type="submit" />

            </form>
        </Container>
    )
}