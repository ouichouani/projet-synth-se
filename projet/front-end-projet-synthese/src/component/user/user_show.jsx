
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom"
import { UserContext } from "../../provider/userContext";
import styles from '../../css/user/user_show.module.css'
import axios from "axios";
export default function UserShow() {

    const [user, setUser] = useState();
    const { storedUser } = useContext(UserContext);
    const { id } = useParams()

    useEffect(() => {

        if (id != storedUser?.id) {
            const get_user = async () => {

                const response = await axios.get(`http://127.0.0.1:8000/api/user/${id}`)
                setUser(response.data.data)
            } ;

            get_user() ;

        } else {
            setUser(storedUser)
        }

    }, [id]);


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
                    <div className={styles.user_log_container}>
                        <Link to={`/user/update/${user?.id}` } state={user} >update</Link>
                        <Link to={'/user/logout'} >logout</Link>
                    </div>
                )}

            </div>

        </div>
    )
}