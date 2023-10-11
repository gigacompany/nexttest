'use client'
import { useEffect } from 'react';
import axios from 'axios';
export default function Transactiontable() {
    useEffect(() => {
        test();
    }, []);
    const test = async () => {
        try {
            const url = '/api/fetchData';
            const response = await axios.get(url,{
                "field": "sender_domain",
                "query_string": "hdfcbank.net",
                "start_date": 1693333800000,
                "end_date": 1693482845000,
                "size": 10
            });
            console.log(response.data); // Access the response data here
        } catch (error) {
            console.error(error);
        }
    }
    return (
        <h1>Transaction List</h1>
    )
}