
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { ReactComponent as Trash } from '../../svg/trash.svg'


export default function PinDelete() {

    const token = localStorage.getItem('token');
    const navigatTo = useNavigate();
    const {id} = useParams()

    const handleClick = async (e) => {

        try {
            const formData = new FormData() ;
            formData.append('_method' , 'DELETE')
            const response = await axios.post(`http://127.0.0.1:8000/api/pin/${id}`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            console.log(response.data.message);
            navigatTo(`/pin`)

        } catch (error) {
            if (error.response && error.response.data && error.response.data.errors) {
                console.error(error.response.data.errors);
            } else {
                console.log(error.response.data.message || "An error occurred.");
            }
        }
    }


    return (
        <Trash onClick={handleClick} />
    )


}