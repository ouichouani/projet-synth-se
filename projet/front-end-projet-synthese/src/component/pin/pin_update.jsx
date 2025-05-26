import axios from "axios";
import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import styles from '../../css/pin/pin_update.module.css';
import { ReactComponent as UploadImage } from '../../svg/upload-file.svg'

export default function PinUpdate() {

    const location = useLocation();
    const { pin_via_location } = location.state || {};  // Safely extract pin

    const token = localStorage.getItem('token');
    const [pin, setpin] = useState(pin_via_location);
    const [message, setMessage] = useState('...');
    const [errors, setErrors] = useState();
    const navigatTo = useNavigate();
    const { id } = useParams();

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const formData = new FormData();
            formData.append("_method", 'PUT');
            pin.title && formData.append("title", pin.title.trim());
            pin.description && formData.append("description", pin.description.trim());
            pin.img && formData.append("image_url", pin.img);
            formData.append("is_public", pin.is_public ? 1 : 0); //is this line correct , this fild's type is boolean in laravel??

            const response = await axios.post(`http://127.0.0.1:8000/api/pin/${id}`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            setMessage(response.data.message);
            console.log(response.data.data.id)
            navigatTo(`/pin/show/${response.data.data.id}`)

        } catch (error) {
            if (error.response && error.response.data && error.response.data.errors) {
                setErrors(error.response.data.errors);
            } else {
                setMessage(error.response.data.message || "An error occurred.");
            }
        }
    }

    const handleChange = (e) => {
        if (e.target.name === "is_public") {
            setpin({ ...pin, is_public: e.target.checked });
        }
        else if (e.target.name === "img") {
            setpin({ ...pin, img: e.target.files[0] });
        } else {
            setpin({ ...pin, [e.target.name]: e.target.value });
        }
    };

    return (
        <div className={styles.pin_update_page}>


            <form onSubmit={handleSubmit} className={styles.update_pin_form} encType="multipart/form-data" >

                <div className={styles.user_section} onClick={() => navigatTo(`/user/show/${pin?.user?.id}`)}>
                    <img src={pin?.user?.profile_image || '/default.png'} />
                    <h2>{pin?.user?.name || 'feetching ...'}</h2>
                </div>


                <div className={styles.label_container}>

                    <label htmlFor="pin_title">
                        <span>title :</span>
                        <input value={pin.title} type="text" name="title" id="pin_title" onChange={handleChange} />
                        <p>{errors?.title && errors.title}</p>
                    </label>

                    <label htmlFor="pin_description">
                        <span>description :</span>
                        <textarea value={pin.description} name="description" id="pin_description" onChange={handleChange} ></textarea>
                        <p>{errors?.description && errors.description}</p>
                    </label>

                    <label htmlFor="pin_is_public" className={styles.checkbox_label}>
                        <span>is_public :</span>
                        <input type="checkbox" name="is_public" id="pin_is_public" checked={pin.is_public} onChange={handleChange} />
                    </label>
                </div>

                <div className={styles.upload_img_container}>
                    <label htmlFor="pin_img">
                        <UploadImage title="uplouad image" />
                    </label>
                    <input type="file" name="img" id="pin_img" onChange={handleChange} />
                </div>
                {/* <p>{errors?.image_url && errors.image_url}</p> */}


                <button type="submit" className={styles.submit_Button}>
                    <p> update </p>
                </button>
            </form>
        </div>
    )


}