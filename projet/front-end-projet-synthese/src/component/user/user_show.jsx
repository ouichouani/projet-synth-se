import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom"

export default function UserShow() {
    const { id } = useParams()
    const [user, setUser] = useState();
    const [message, setMessage] = useState()


    useEffect(() => {


        const getUser = async () => {
            try {

                const response = await axios.get(`http://127.0.0.1:8000/api/user/${id}`);
                setUser(response.data.data);

            } catch (error) {
                console.log(error.message);
                setMessage(error.response.data.message)
            }
        }

        getUser();

    }, [id]);

    console.log(user)

    return (
        <div className="user_show_page">
            <img src={user?.profile_image} alt="" className="user_sow_img" />

            <div className="user_show_info">
                <p>{user?.email}</p>
                <p>{user?.name}</p>
                <p>{user?.bio}</p>
                <p>{user?.profile_image}</p>

                <div className="user_show_links">
                    <Link to={'/user/update'} >update</Link>
                    <Link to={'/user/logout'} >logout</Link>
                </div>
            </div>
            
        </div>
    )
}