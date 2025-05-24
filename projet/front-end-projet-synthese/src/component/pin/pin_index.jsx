import axios from "axios"
import { useEffect, useState } from "react";
import Pin from "./pin";

import styles from '../../css/pin/pin_index.module.css'


export default function PinIndex() {

    const [pins, setPins] = useState([]);

    useEffect(() => {
        const fetch_all_pins = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/pin');
                setPins(response.data.data);
            } catch (error) {
                console.log('error : ', error.message)
            };
        }

        fetch_all_pins();

    }, []);

    return (
        <div className={styles.pin_index_container}>
            <div className={styles.pin_img_container}>

                {pins.map((pin, index) => (
                    <Pin key={index} image_path={pin.image_url} path={`/pin/show/${pin.id}`} />
                ))}

            </div>
        </div>
    )

}