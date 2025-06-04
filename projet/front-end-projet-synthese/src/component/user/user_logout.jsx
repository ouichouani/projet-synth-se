import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../provider/userContext";
import styles from "../../css/user/user_logout.module.css";


export default function UserLogout() {
    const { setStoredUserfunction } = useContext(UserContext);


    const [message, setMessage] = useState();
    const redirectTo = useNavigate();

    const handleClick = async () => {
        const token = localStorage.getItem('token');

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/user/logout',
                null,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                }
            );
            setMessage(response.data.message);
            localStorage.removeItem('token');
            setStoredUserfunction(null);
            redirectTo('/user/login');

        } catch (error) {
            setMessage(error.response.data.message);
        }
    }        
        const cancelLogout = () => {
            const user_logout_container = document.getElementById("user_logout_container");
            const user_logout_over_layer = document.getElementById("user_logout_over_layer");
            user_logout_container.style.left = '-500px'
            Object.assign(user_logout_over_layer.style, { backgroundColor: 'transparent', zIndex: "-9" })
        }


        return (
            <>
                <div className={styles.user_logout_container} id="user_logout_container">
                    <p>are you show you want to log out ?</p>
                    <div>
                        <button onClick={handleClick} >yes</button>
                        <button onClick={cancelLogout}>no</button>
                    </div>
                </div>

                <div className={styles.user_logout_over_layer} onClick={cancelLogout} id="user_logout_over_layer">
                </div>
            </>
        )


    }