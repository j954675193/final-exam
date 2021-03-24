import { useState, useEffect } from 'react'
import Container from 'react-bootstrap/Container'
import Table from 'react-bootstrap/Table'
import { format } from 'date-fns'
import { BsTrash } from "react-icons/bs";

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

export default function Home() {
    const [records, setRecords] = useState([])

    // Firebase stuff
    const moneyRef = firestore.collection('money');
    const query = moneyRef.orderBy('createdAt', 'asc').limitToLast(100);
    const [data] = useCollectionData(query, { idField: 'id' });

    // This will be run when 'data' is changed.
    useEffect(() => {
        if (data) { // Guard condition
            let t = 0
            let r = data.map((d, i) => {
                t += d.amount
                return (
                    <JournalRow
                        data={d}
                        i={i}
                        onDeleteClick={handleDeleteClick}
                    />
                )
            })
            setRecords(r)
        }
    },
        [data])

    const handleDeleteClick = (id) => {
        console.log('handleDeleteClick in Journal', id)
        if (window.confirm("Are you sure to delete this record?"))
            moneyRef.doc(id).delete()
    }

    return (
        <Container>
            <h1>Report Form</h1>
            <Table striped bordered hover variant="dark">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>CreatedAt</th>
                        <th>Name</th>
                        <th>Phone Number</th>
                        <th>Reason</th>
                        <th>Arrival Time</th>
                        <th>Departure Time</th>

                    </tr>
                </thead>
                <tbody>
                    {records}
                </tbody>

            </Table>
        </Container>
    )
}

function JournalRow(props) {
    let d = props.data
    let i = props.i
    return (
        <tr>
            <td>
                <BsTrash onClick={() => props.onDeleteClick(d.id)} />
            </td>
            <td>{format(d.createdAt.toDate(), "yyyy-MM-dd")}</td>
            <td>{d.name}</td>
            <td>{d.phoneNumber}</td>
            <td>{d.reason}</td>
            <td>{format(d.arrivalTime.toDate(), "yyyy-MM-dd")}</td>
            <td>{format(d.departureTime.toDate(), "yyyy-MM-dd")}</td>
        </tr>
    )
}
