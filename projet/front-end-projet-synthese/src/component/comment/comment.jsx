
import axios from "axios";
import styles from "../../css/comment/comment.module.css";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
// import { ReactComponent as Arrow } from "../../svg/arrow.svg";
// import { ReactComponent as AddComment } from "../../svg/add-comment.svg";
// import { useRef } from 'react';

export default function Comment() {

    const { id } = useParams();
    const [comments, setComments] = useState(null);
    const [commentContent, setCommentContent] = useState();

    const navigatTo = useNavigate();
    const token = localStorage.getItem('token');



    useEffect(() => {

        const fetch_comments = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/comment/${id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },

                });
                setComments(response.data.data);
            } catch (error) {
                console.log('error : ', error.message)
            };
        }

        fetch_comments();

    }, [id, token]);

    const handleChange = (e) => {
        setCommentContent(e.target.value);
    };

    const handleClick = () => {

        if (!commentContent.trim()) return;


        const formData = new FormData();
        formData.append('content', commentContent.trim());
        formData.append('pin_id', id);



        const add_comments = async () => {
            try {
                const response = await axios.post(`http://127.0.0.1:8000/api/comment`, formData,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                            ...(token && { 'Authorization': `Bearer ${token}` }), // send token only if it exists
                        },

                    });
                setComments((prevComment) => ([...prevComment, response.data.data]));
            } catch (error) {

                console.log('error : ', error.message)
            };
        }

        add_comments();

        setCommentContent('') ;



    };

    return (

        <div className={styles.comments}>
            <div className={styles.comments_title}>

                <h2>comments</h2>
                <p>{comments?.length}</p>

            </div>

            <div className={styles.comment_container} >
                {comments?.map((comment) => (
                    <div key={comment.id}>
                        <div className={styles.comment_user_section} onClick={() => navigatTo(`/user/show/${comment.user.id}`)}>
                            <img src={comment.user.profile_image || '/default.png'} alt="" />
                            <span>{comment.user.name || 'feetching ...'}</span>
                        </div>
                        <p>{comment.content}</p>
                    </div>
                ))}
            </div>

            <label htmlFor="add_comment_input" id="add_comment_label" >
                <input type="text" value={commentContent} className={styles.add_comment_input} id="add_comment_input" onChange={handleChange} placeholder="write your comment here ..." />
                <p onClick={handleClick}>send</p>
            </label>

        </div>


    )
}

