import axios from "axios";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";


export default function PinUpdate(){

        const token = localStorage.getItem('token');
        const [pin, setpin] = useState({ title : '', img: null, description: '' , is_public : true});
        const [message, setMessage] = useState('...');
        const [errors, setErrors] = useState();
        const navigatTo = useNavigate();
        const {id} = useParams() ;
    
        const handleSubmit = async (e) => {
    
            e.preventDefault();
    
            try {
    
                const formData = new FormData();
                formData.append("_method", 'PUT');
                pin.title && formData.append("title", pin.title.trim());
                pin.description && formData.append("description", pin.description.trim());
                pin.img && formData.append("image_url", pin.img);
                formData.append("is_public", pin.is_public ? 1 : 0 ); //is this line correct , this fild's type is boolean in laravel??
    
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
            if(e.target.name === "is_public"){
                setpin({ ...pin, is_public : e.target.checked });
            }
            else if (e.target.name === "img") {
                setpin({ ...pin, img: e.target.files[0] });
            } else {
                setpin({ ...pin, [e.target.name]: e.target.value });
            }
        };
    
        return (
            <div className="user_create_page">
    
                <form onSubmit={handleSubmit} className="create_user_form" encType="multipart/form-data" >
                    <h1>update</h1>
    
                    <h2>{message}</h2>
                    <label htmlFor="pin_title">
                        <span>title</span>
                        <input value={pin.title} type="text" name="title" id="pin_title" onChange={handleChange} />
                        {errors?.title && errors.title}
                    </label>
    
                    <label htmlFor="pin_description">
                        <span>description</span>
                        <textarea value={pin.description} name="description" id="pin_description" onChange={handleChange} ></textarea>
                        {errors?.description && errors.description}
                    </label>
    
                    <label htmlFor="pin_img">
                        <span>image</span>
                        <input type="file" name="img" id="pin_img" onChange={handleChange} />
                        {errors?.image_url && errors.image_url}
                    </label>
    
                    <label htmlFor="pin_is_public">
                        <span>is_public</span>
                        <input type="checkbox" name="is_public" id="pin_is_public" checked={pin.is_public} onChange={handleChange}   />
                    </label>
    
                    <button type="submit"> update</button>
                </form>
            </div>
        )
    
    
}