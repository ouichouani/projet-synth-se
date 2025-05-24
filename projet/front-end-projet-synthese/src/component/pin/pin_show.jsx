import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

import styles from '../../css/pin/pin_show.module.css'
export default function PinShow() {


    const navigatTo = useNavigate();
    const [pin, setPin] = useState(null);
    const { id } = useParams();
    const token = '';

    useEffect(() => {
        const fetch_pin = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/pin/${id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        ...(token && { 'Authorization': `Bearer ${token}` }), // send token only if it exists
                    },

                });
                setPin(response.data.data);
            } catch (error) {
                console.log('error : ', error.response.data.message)
            };
        }

        fetch_pin();

    }, [id, token]);



    console.log(pin)

    return (
        <>
            <div className = {styles.pin_show_container}>

                <div className = {styles.pin_container}>

                    <div className = {styles.Pin}>
                        <img src={pin?.image_url || '/default.png'}  />
                    </div>
                    
                    <div className = {styles.pin_info}>

                        <div className = {styles.user_section} onClick={() => navigatTo(`/user/show/${pin?.user?.id}`)}>
                            <img src={pin?.user?.profile_image || '/default.png'}  />
                            <h2>{pin?.user?.name || 'feetching ...'}</h2>
                        </div>

                        <span> {pin?.title}</span>

                        <p>{pin?.description ? pin?.description : 'no description' }</p>
                        
                    </div>
                </div>

            </div>

        </>
    )



}