
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom"
import { UserContext } from "../../provider/userContext";

import styles from '../../css/user/user_show.module.css'

import axios from "axios";
import UserLogout from "./user_logout";
import { ReactComponent as AddPins } from '../../svg/add-photo.svg';
import Pin from "../pin/pin";

export default function UserShow() {

    const [user, setUser] = useState();
    const [pins, setPins] = useState();
    const { storedUser } = useContext(UserContext);
    const { id } = useParams()

    useEffect(() => {

        if (id != storedUser?.id) {

            const get_user = async () => {

                const response = await axios.get(`http://127.0.0.1:8000/api/user/${id}`)
                setUser(response.data.data)
            };

            get_user();

        } else {
            setUser(storedUser)
        }

        const get_all_pin_related_to_this_user = async (id) => {
            const response = await axios.get(`http://127.0.0.1:8000/api/pin/user/${id}`) // this func in back-end returns all pin relited to the current user 
            setPins(response.data.data)
        }

        get_all_pin_related_to_this_user(id)

    }, [id]);

    const handleLogout = () => {
        const user_logout_container = document.getElementById("user_logout_container");
        const user_logout_over_layer = document.getElementById("user_logout_over_layer");
        Object.assign(user_logout_container.style, { left: "50%", transform: "translate(-50%)" })
        Object.assign(user_logout_over_layer.style, { backgroundColor: 'rgba(0, 0, 0, 0.4)', zIndex: "9000" })

    }

    const style_class = () => {

        //THIS FUNCTION APPLAY THE CSS CLASS ON CONSIDERING PINS NUMBER AND APLAY THE CORRECT STYLE 
        //THIS FUNCTION IS USED TO RETURN THE TARGETED CLASS 

        switch (pins?.length) {

            case 1:
                return styles.pin_img_container1;
            case 2:
                return styles.pin_img_container2;
            case 3:
                return styles.pin_img_container3;
            case 4:
                return styles.pin_img_container4;
            default:
                return styles.pin_img_container6
        }
    }



    return (
        <div className={styles.user_show_page}>


            <div className={styles.user_show_container} >
                <img src={user?.profile_image} alt="" />
                <div className={styles.user_info}>

                    <h1>{user?.name}</h1>
                    <h2>{user?.email}</h2>
                    <p>{user?.bio}</p>

                </div>

                {id == storedUser?.id && (
                    <>
                        <div className={styles.user_log_container}>
                            <Link to={`/user/update/${user?.id}`} state={user} >update</Link>
                            <p onClick={handleLogout}> logout</p>
                        </div>

                        <div className={styles.pin_add_container}>
                            <Link to={`/pin/create/`} ><AddPins /></Link>
                        </div>
                    </>
                )}

            </div>

            <UserLogout />

            <div className={styles.pins_container}>
                {/* <div className={Pin_styles.pin_img_container}> */}

                <div className={style_class()}>

                    {pins?.map((pin, index) => (
                        <Pin key={index} image_path={pin.image_url} path={`/pin/show/${pin.id}`} />
                    ))}

                </div>
            </div>

        </div>
    )
}