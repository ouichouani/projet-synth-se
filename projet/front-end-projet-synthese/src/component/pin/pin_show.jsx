import axios from "axios";
import styles from '../../css/pin/pin_show.module.css' ;
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { UserContext } from "../../provider/userContext";

// -------------------
import PinDelete from "./pin_delete";
import Comment from "../comment/comment";

import { ReactComponent as Like } from '../../svg/heart.svg'
import { ReactComponent as Update } from '../../svg/update.svg'
import { ReactComponent as Download } from '../../svg/download-photo.svg'
// -------------------

export default function PinShow() {

    const { storedUser } = useContext(UserContext); //added


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


    return (
        <>
            <div className={styles.pin_show_container}>

                <div className={styles.pin_container}>

                    <div className= {styles.pin_reaction}>

                        <Download title="download" />

                        {storedUser?.id == pin?.user_id && (
                            <>
                            <Like fill={pin?.liked_by_me ? '#134B70' : 'white'} />
                                <Link to={`/pin/update/${pin?.id}`} state={{pin_via_location: pin}}>
                                    <Update title="update" />
                                </Link>
                                <PinDelete />
                            </>
                        )}

                    </div>

                    <div className={styles.Pin}>
                        <img src={pin?.image_url || '/default.png'} />
                    </div>

                    <div className={styles.pin_info}>

                        <div className={styles.user_section} onClick={() => navigatTo(`/user/show/${pin?.user?.id}`)}>
                            <img src={pin?.user?.profile_image || '/default.png'} />
                            <h2>{pin?.user?.name || 'feetching ...'}</h2>
                        </div>

                        <span> {pin?.title}</span>

                        <p>{pin?.description ? pin?.description : 'no description'}</p>

                    </div>
                </div>



            <Comment />
            </div>

        </>
    )
}