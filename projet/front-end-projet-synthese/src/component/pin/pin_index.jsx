import axios from "axios"
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


export default function PinIndex() {

    const navigatTo = useNavigate();
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
        <div className="pin_index_container">
            <div className="pin_img_container">

            {pins.map((pin, index) => (
                <img key={index} src={pin.image_url} className="Pin" onClick={()=>{navigatTo(`/pin/show/${pin.id}`)}} />
            ))}
            </div>
        </div>
    )

}