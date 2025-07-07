
import axios from "axios";
import styles from "../../css/comment/comment.module.css";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../../provider/userContext";

import { ReactComponent as Trash } from '../../svg/trash.svg'


export default function Comment() {

    const { id } = useParams();
    const [comments, setComments] = useState(null);
    const [commentContent, setCommentContent] = useState();

    const navigatTo = useNavigate();
    const { storedUser } = useContext(UserContext);
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

    const handleClick = (e) => {
        e.preventDefault();
        if (!commentContent.trim()) return;

        const time = new Date() ;
        const  newstate = { added_in : time ,  content: commentContent, user: { id: id, profile_image: storedUser.profile_image, name: storedUser.name } };

        setComments((prevComment) => ([...prevComment,  newstate  ]));

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
                setComments((prevComment) => ([...prevComment.filter(c => c.added_in != time ) , response.data.data ]));
            } catch (error) {

                console.log('error : ', error.message)
            };
        }

        add_comments();

        setCommentContent('');



    };

    const hndleDelete = (comment) => {

        setComments((prevComment) => ([...prevComment.filter(c => c.id != comment.id )  ]));


        const deleteComment = async (comment) => {
            try {
                const formData = new FormData();
                formData.append('_method', 'DELETE');
                const response = await axios.post(`http://127.0.0.1:8000/api/comment/${comment.id}`, formData,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                            ...(token && { 'Authorization': `Bearer ${token}` }), // send token only if it exists
                        },
                    });
                setComments((prevComment) => prevComment.filter(c => c.id != comment.id));

            } catch (error) {

                //PUT THE COMMENT BACK IF THE DELETE REQUEST FAILD
                setComments((prevComment) => ([...prevComment , comment ])) ;
                console.log('error : ', error.message)
            };

        }

        deleteComment(comment);
    }

    return (

        <div className={styles.comments}>
            <div className={styles.comments_title}>

                <h2>comments</h2>
                <p>{comments?.length}</p>

            </div>

            <div className={styles.comment_container} >
                {comments?.map((comment , index) => (
                    <div key={index}>
                        <div className={styles.comment_user_section} onClick={() => navigatTo(`/user/show/${comment.user.id}`)}>
                            <img src={comment.user.profile_image || '/default.png'} alt="" />
                            <span>{comment.user.name || 'feetching ...'}</span>
                        </div>
                        <p>{comment.content}</p>
                        {comment.user_id == storedUser.id &&
                            <Trash className={styles.trash_icon} onClick={() => (hndleDelete(comment))} />
                        }

                    </div>

                ))}
            </div>
            <form action="" onSubmit={handleClick} >
                <label htmlFor="add_comment_input" id="add_comment_label" >
                    <input type="text" autoComplete="off" value={commentContent} className={styles.add_comment_input} id="add_comment_input" onChange={handleChange} placeholder="write your comment here ..." />
                    <p onClick={handleClick}>send</p>
                </label>
            </form>

        </div>


    )
}

