import axios from "axios";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";


export default function UserUpdate() {

    const token = localStorage.getItem('token');
    const [user, setUser] = useState({ email: '', password: '', name: '', img: null , bio: '' });
    const [message, setMessage] = useState('...');
    const [errors, setErrors] = useState();
    const navigatTo = useNavigate();
    const {id} = useParams() ;

    const handleSubmit = async (e) => {

        e.preventDefault();


        try {

            const formData = new FormData();
            // check first if password empty or not
            if(user.password){ 
                user.password.trim() && formData.append("password", user.password);
            }

            formData.append("_method", 'PUT');
            user.name && formData.append("name", user.name.trim());
            user.bio && formData.append("bio", user.bio);
            user.img && formData.append("profile_image", user.img);

            const response = await axios.post(`http://127.0.0.1:8000/api/user/${id}`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`, // if token valid , user must logout first
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            setMessage(response.data.message); // delete this later
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
        <div className="user_create_page">

            <form onSubmit={handleSubmit} className="create_user_form" encType="multipart/form-data" >
                <h1>update</h1>

                <h2>{message}</h2>

                <label htmlFor="update_name">
                    <span>name</span>
                    <input value={user.name} type="text" name="name" id="update_name" onChange={handleChange} />
                    {errors?.name && errors.name}

                </label>


                <label htmlFor="update_password">
                    <span>password</span>
                    <input value={user.password} type="password" name="password" id="update_password" onChange={handleChange} />
                    {errors?.password && errors.password}

                </label>


                <label htmlFor="update_bio">
                    <span>bio</span>
                    <input value={user.bio} type="text" name="bio" id="update_bio" onChange={handleChange} />
                    {errors?.bio && errors.bio}
                </label>


                <label htmlFor="update_img">
                    <span>profail image</span>
                    <input type="file" name="img" id="update_img" onChange={handleChange} />
                    {errors?.profile_image && errors.profile_image}
                </label>



                <button type="submit"> update</button>
            </form>
        </div>
    )

}