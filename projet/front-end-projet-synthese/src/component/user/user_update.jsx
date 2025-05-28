import axios from "axios";
import { useContext, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../../provider/userContext";
import styles from '../../css/user/user_update.module.css';
import { ReactComponent as UploadImage } from '../../svg/upload-file.svg'



export default function UserUpdate() {

    const token = localStorage.getItem('token');

    const location = useLocation();
    const userData = location.state;
    
    const { setStoredUserfunction } = useContext(UserContext);

    const [user, setUser] = useState({ ...userData });
    const [errors, setErrors] = useState();
    const navigatTo = useNavigate();

    const handleSubmit = async (e) => {

        e.preventDefault();


        try {

            const formData = new FormData();
            formData.append("_method", 'PUT');

            if (user?.password) {
                user?.password.trim() && formData.append("password", user?.password);
            }
            if (user?.name && user?.name != userData.name) {
                user?.name && formData.append("name", user?.name.trim());
            }
            if (user?.bio && user?.bio != userData.bio) {
                user?.bio && formData.append("bio", user?.bio.trim());
            }
            user?.img && formData.append("profile_image", user?.img);

            const response = await axios.post(`http://127.0.0.1:8000/api/user/${user?.id}`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            setStoredUserfunction(response.data.data);
            navigatTo(`/user/show/${response.data.data.id}`)

        } catch (error) {
            if (error.response && error.response.data && error.response.data.errors) {
                setErrors(error.response.data.errors);
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
        <div className={styles.user_update_page}>

            <form onSubmit={handleSubmit} className={styles.update_user_form} encType="multipart/form-data" >


                <label htmlFor="update_name">
                    <span>name</span>
                    <input value={user?.name} type="text" name="name" id="update_name" onChange={handleChange} />
                    <p>{errors?.name && errors.name}</p>

                </label>


                <label htmlFor="update_password">
                    <span>password</span>
                    <input value={user?.password} type="password" name="password" id="update_password" onChange={handleChange} />
                    <p>{errors?.password && errors.password}</p>
                </label>


                <label htmlFor="update_bio">
                    <span>bio</span>
                    <textarea value={user?.bio} name="bio" id="update_bio" onChange={handleChange} ></textarea>
                    <p>{errors?.bio && errors.bio}</p>
                </label>


                <div className={styles.upload_img_container}>
                    <label htmlFor="pin_img">
                        <UploadImage title="uplouad image" />
                    </label>
                    <input type="file" name="img" id="pin_img" onChange={handleChange} />
                </div>
                {/* {errors?.profile_image && errors.profile_image} */}




                <button type="submit" className={styles.submit_Button}>
                    <p> update </p>
                </button>

            </form>
        </div>
    )

}