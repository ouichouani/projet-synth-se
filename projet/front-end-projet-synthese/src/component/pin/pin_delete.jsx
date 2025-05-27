
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { ReactComponent as Trash } from '../../svg/trash.svg'
import styles from '../../css/pin/pin_delete.module.css'

export default function PinDelete() {

    const token = localStorage.getItem('token');
    const navigatTo = useNavigate();
    const { id } = useParams()

    const handleClick = async (e) => {

        

        try {
            const formData = new FormData();
            formData.append('_method', 'DELETE')
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


    const cancelDelete = () => {
        const pin_delete_container = document.getElementById("pin_delete_container");
        const pin_delete_over_layer = document.getElementById("pin_delete_over_layer");
        pin_delete_container.style.left = '-500px'
        Object.assign(pin_delete_over_layer.style , {backgroundColor : 'transparent' , zIndex : "-9"})
    }


    return (
        <>
            <div className={styles.pin_delete_container} id="pin_delete_container">
                <p>are you show you want to delete this pin ?</p>
                <div>
                    <button onClick={handleClick} >yes</button>
                    <button onClick={cancelDelete}>no</button>
                </div>
            </div>

            <div className={styles.pin_delete_over_layer} onClick={cancelDelete} id="pin_delete_over_layer">
            </div>
        </>
    )


}