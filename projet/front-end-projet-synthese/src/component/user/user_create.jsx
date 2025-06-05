import axios from "axios";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../provider/userContext";
import styles from "../../css/user/user_create.module.css";


export default function UserCreate() {
    const { setStoredUserfunction } = useContext(UserContext);
    const token = localStorage.getItem('token');
    const [user, setUser] = useState({ email: '', password: '', password_confirm: '', name: '', img: null, bio: '' });
    const [message, setMessage] = useState('...');
    const [errors, setErrors] = useState();
    const navigatTo = useNavigate();

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (user.password !== user.password_confirm) {
            return setErrors({ password_confirm: 'passwords are not matched ' });
        }

        try {

            const formData = new FormData();
            user.name && formData.append("name", user.name.trim());
            user.email && formData.append("email", user.email.trim());
            if (user.password) { // check first if password empty or not
                user.password.trim() && formData.append("password", user.password);
            }
            user.bio && formData.append("bio", user.bio.trim());
            user.img && formData.append("profile_image", user.img);

            const response = await axios.post('http://127.0.0.1:8000/api/user',
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
            if (error.response && error.response.data && error.response.data.errors) {
                setErrors(error.response.data.errors);
            } else {
                setMessage(error.response.data.message || "An error occurred.");
            }
        }
    }

    const handleChange = (e) => {
        if (e.target.name === "img") {
            setUser({ ...user, img: e.target.files[0] });
        } else {
            setUser({ ...user, [e.target.name]: e.target.value });
        }
    };

    return (
        <div className={styles.user_create_page}>

            <form onSubmit={handleSubmit} className={styles.user_create_form} encType="multipart/form-data" >
                {/* <h2>register</h2> */}

                <div className={styles.first_Section}>

                    <label htmlFor="register_name">
                        <span>name</span>
                        <input value={user.name} type="text" name="name" id="register_name" onChange={handleChange} required />
                        <p>{errors?.name && errors.name}</p>

                    </label>

                    <label htmlFor="register_email">
                        <span>email</span>
                        <input value={user.email} type="email" name="email" id="register_email" onChange={handleChange} required />
                        <p>{errors?.email && errors.email}</p>
                    </label>

                    <label htmlFor="register_password">
                        <span>password</span>
                        <input value={user.password} type="password" name="password" id="register_password" onChange={handleChange} required />
                        <p>{errors?.password && errors.password}</p>

                    </label>

                    <label htmlFor="register_password_confirm">
                        <span>confirm password</span>
                        <input value={user.password_confirm} type="password" name="password_confirm" id="register_password_confirm" onChange={handleChange} required />
                        <p>{errors?.password_confirm && errors.password_confirm}</p>
                    </label>
                </div>


                <div className={styles.second_Section}>

                    <label htmlFor="register_bio">
                        <span>bio</span>
                        <textarea name="bio" id="register_bio" value={user.bio} onChange={handleChange}></textarea>
                        <p>{errors?.bio && errors.bio}</p>
                    </label>

                    <label htmlFor="register_img">
                        <span>profail image</span>
                        <input type="file" name="img" id="register_img" onChange={handleChange} />
                        <p>{errors?.profile_image && errors.profile_image}</p>
                    </label>

                </div>



                <button type="submit" className={styles.submit_Button}> <p>create</p></button>
                <Link to={'/user/login'}>log in</Link>
            </form>
        </div>
    )
}