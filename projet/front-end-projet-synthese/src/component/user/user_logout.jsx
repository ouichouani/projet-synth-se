import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../provider/userContext";

export default function UserLogout() {
        const {setStoredUserfunction} = useContext(UserContext) ;


    const [message, setMessage] = useState();
    const redirectTo = useNavigate() ;
    
    const logout = async () => {
        const token = localStorage.getItem('token');
        
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/user/logout',
                null ,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                }
            );
            setMessage(response.data.message);
            localStorage.removeItem('token') ;
            setStoredUserfunction(null) ;
            redirectTo('/user/login');

        } catch (error) {
            setMessage(error.response.data.message);
        }
    }

    return (
        <div className="logout_container">
        <p>are you shor you want to log out ?</p>
        <button onClick={logout}>log out</button>
        <p className="message_logout">{message}</p>
        </div>
    )
}