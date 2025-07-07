
import { useContext, useEffect, useState } from 'react'
import { ReactComponent as LikeBtn } from '../../svg/heart.svg'
import axios from 'axios';
import { UserContext } from '../../provider/userContext';

export default function Like({ pin, like }) {

    const [clicked, setClicked] = useState(!!like);
    const { storedUser } = useContext(UserContext);
    const token = localStorage.getItem('token');

    useEffect(() => {
        setClicked(!!like)
    }, [like])    


    const handleClick = () => {

        const newState = !clicked;
        setClicked(newState);

        const toggleLike = async () => {
            const body = new FormData();
            body.append('pin_id', pin?.id);
            body.append('user_id', storedUser?.id);

            try {
                const response = await axios.post(`http://127.0.0.1:8000/api/like/toggle`,
                    body
                    , {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                console.log(response.data.message) ;
                // setClicked(!!response.data.data) ;

            } catch (e) {
                console.log(e.message);
            }
        }
        toggleLike() ;
    }

    return (
        <LikeBtn  fill={clicked ? '#134B70' : 'white'} onClick={handleClick} />
    )


}