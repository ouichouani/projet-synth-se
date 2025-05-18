import axios from "axios";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../provider/userContext";

export default function UserLogin() {
    const {setStoredUserfunction} = useContext(UserContext) ;

    const token = localStorage.getItem('token') ;
    const [user, setUser] = useState({ email: '', password: '' }) ;
    const [message , setMessage] = useState('...') ;
    const navigatTo = useNavigate() ;
    
    const handleSubmit = async (e) => {

        e.preventDefault() ;

        try {

            const formData = new FormData() ;
            formData.append("email", user.email);
            formData.append("password", user.password);

            const response = await axios.post('http://127.0.0.1:8000/api/user/login',
                formData,
                {
                    headers: {
                        'Authorization' : `Bearer ${token}` , // if token valid , user must logout first
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            setMessage(response.data.token) ;
            setStoredUserfunction(response.data.data) ;
            
            localStorage.setItem('token' , response.data.token ) ;
            navigatTo(`/user/show/${response.data.data.id}`)
                        
        } catch (error) {
            setMessage(error.response.data.message) ;
        }
        
    }

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value })
    }

    return (

        <form onSubmit={handleSubmit} className="log_in">
            <h2>{message}</h2>
            <label htmlFor="login_email">
                <span>email</span>
                <input value={user.email} type="email" name="email" id="login_email" onChange={handleChange} />
            </label>

            <label htmlFor="login_password">
                <span>password</span>
                <input value={user.password} type="password" name="password" id="login_password" onChange={handleChange} />
            </label>

            <button type="submit"> log in</button>
            <Link to={'/user/create'}>create account</Link>
        </form>
    )
}