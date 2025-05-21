import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { UserContext } from "../../provider/userContext";

import Comment from "../comment/comment";
import PinDelete from "./pin_delete";


import { ReactComponent as Like } from '../../svg/heart.svg'
import { ReactComponent as More } from '../../svg/more1.svg'
import { ReactComponent as Share } from '../../svg/share.svg'
import { ReactComponent as Update } from '../../svg/update.svg'
import { ReactComponent as Download } from '../../svg/download-photo.svg'

export default function PinShow() {
    const { storedUser, setStoredUserfunction } = useContext(UserContext);


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
            <div className="pin_show_container">

                <div className="pin_container">

                    
                    <div className="pin_like">

                        <Like fill={pin?.liked_by_me ? '#134B70' : 'white'} />
                        {/* <Share title="share" /> */}
                        <More title="more" />
                        <Download title="download" />

                        {storedUser.id == pin?.user_id && (
                            <>
                                <Link to={`/pin/update/${pin?.user_id}`}>
                                    <Update title="update" />
                                </Link>
                                <PinDelete />
                            </>
                        )}
                    </div>
                    <img src={pin?.image_url || '/default.png'} className="Pin" />
                    
                    <div className="pin_info">
                        <div className="user_section" onClick={() => navigatTo(`/user/show/${pin?.user?.id}`)}>
                            <img src={pin?.user?.profile_image || '/default.png'} alt="" />
                            <h2>{pin?.user?.name || 'feetching ...'}</h2>
                        </div>
                        <span className="pin_title">{pin?.title}</span>
                        <p>{pin?.description}</p>
                    </div>
                </div>

                <Comment />
            </div>

        </>
    )



}