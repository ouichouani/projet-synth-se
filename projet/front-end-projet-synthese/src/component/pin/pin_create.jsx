import axios from "axios";
import { useState , useContext} from "react";
import { useNavigate } from "react-router-dom";

import styles from '../../css/pin/pin_create.module.css';
import { ReactComponent as UploadImage } from '../../svg/upload-file.svg'
import { UserContext } from "../../provider/userContext";




export default function PinCreate() {
    const token = localStorage.getItem('token');
    const [pin, setpin] = useState({ title: '', img: null, description: '', is_public: true });
    const [message, setMessage] = useState('...');
    const [errors, setErrors] = useState();
    const navigatTo = useNavigate();
    const {storedUser: user} = useContext(UserContext) ;

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const formData = new FormData();
            pin.title && formData.append("title", pin.title.trim());
            pin.description && formData.append("description", pin.description.trim());
            pin.img && formData.append("image_url", pin.img);
            formData.append("is_public", pin.is_public ? 1 : 0); //is this line correct , this fild's type is boolean in laravel??

            const response = await axios.post('http://127.0.0.1:8000/api/pin',
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            setMessage(response.data.message);
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
        <div className={styles.pin_create_page}>

            <form onSubmit={handleSubmit} className={styles.create_pin_form} encType="multipart/form-data" >

                <div className={styles.user_section} onClick={() => navigatTo(`/user/show/${user?.id}`)}>
                    <img src={user?.profile_image || '/default.png'} />
                    <h2>{user?.name || 'feetching ...'}</h2>
                </div>

                <label htmlFor="pin_title">
                    <span>title :</span>
                    <input value={pin.title} type="text" name="title" id="pin_title" onChange={handleChange} required />
                    <p>{errors?.title && errors.title}</p>
                </label>

                <label htmlFor="pin_description">
                    <span>description :</span>
                    <textarea value={pin.description} name="description" id="pin_description" onChange={handleChange} ></textarea>
                    <p>{errors?.description && errors.description}</p>
                </label>

                <div className={styles.upload_img_container}>
                    <label htmlFor="pin_img">
                        <UploadImage title="uplouad image" />
                    </label>
                    <input type="file" name="img" id="pin_img" onChange={handleChange} />
                    {/* <p>{errors?.image_url && errors.image_url}</p> */}
                </div>

                <label htmlFor="pin_is_public" className={styles.checkbox_label}>
                    <span>is_public :</span>
                    <input type="checkbox" name="is_public" id="pin_is_public" checked={pin.is_public} onChange={handleChange} />
                </label>
                
            
                <button type="submit" className={styles.submit_Button}>
                    <p> create </p>
                </button>

            </form>
        </div>
    )

}