import axios from "axios";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../provider/userContext";
import styles from "../../css/user/user_login.module.css";

export default function UserLogin() {
    const { setStoredUserfunction } = useContext(UserContext);

    const token = localStorage.getItem('token');

    const [user, setUser] = useState({ email: '', password: '' });
    const [message, setMessage] = useState();
    const [errors, setErrors] = useState();
    const navigatTo = useNavigate();

    const handleSubmit = async (e) => {

        e.preventDefault();
        setErrors()

        try {

            const formData = new FormData();
            formData.append("email", user.email);
            formData.append("password", user.password);

            const response = await axios.post('http://127.0.0.1:8000/api/user/login',
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`, // if token valid , user must logout first
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            setMessage(response.data.token);
            setStoredUserfunction(response.data.data);

            localStorage.setItem('token', response.data.token);
            navigatTo(`/user/show/${response.data.data.id}`)

        } catch (error) {
            //put this into a notification 
            setMessage(error.response.data.message);
            if (error.response && error.response.data && error.response.data.errors) {
                setErrors(error.response.data.errors);
            }
        }

    }

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value })
    }

    return (
        <div className={styles.log_in_page}>

            <form onSubmit={handleSubmit} className={styles.log_in_form}>
                <h2>log in</h2>

                <label htmlFor="login_email">
                    <span>email</span>
                    <input value={user.email} type="email" name="email" id="login_email" onChange={handleChange} required />
                    <p>{message && message}</p>
                </label>

                <label htmlFor="login_password">
                    <span>password</span>
                    <input value={user.password} type="password" name="password" id="login_password" onChange={handleChange} required />
                    <p>{errors?.password && errors.password}</p>
                </label>

                <button type="submit" className={styles.submit_Button}> <p>log in</p></button>
                <Link to={'/user/create'}>create account</Link>
            </form>
        </div>
    )
}