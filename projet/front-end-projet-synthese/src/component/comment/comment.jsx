import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ReactComponent as Arrow } from "../../svg/arrow.svg";
import { useRef } from 'react';

import '../../css/comment.css';
export default function Comment() {

    const { id } = useParams();
    const [comments, setComments] = useState(null);
    const [showComment, setShowComment] = useState(false);
    const navigatTo = useNavigate();
    const commentContainerRef = useRef(null);
    const token = '';



    useEffect(() => {

        if (showComment === false) {
            return;
        }

        const fetch_comments = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/comment/${id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        ...(token && { 'Authorization': `Bearer ${token}` }), // send token only if it exists
                    },

                });
                setComments(response.data.data);
            } catch (error) {
                console.log('error : ', error.message)
            };
        }

        fetch_comments();
        console.log(comments)

    }, [id, token, showComment]);


    const handleClick = (e) => {
        e.stopPropagation();

        const target = e.currentTarget;
        setShowComment((prevShowComment) => {
            const newShowComment = !prevShowComment;

            Object.assign(target.style, {
                transform: newShowComment ? 'rotate(180deg)' : 'rotate(0deg)'
            });

            // Animate comment container
            setTimeout(() => {
                if (commentContainerRef.current) {
                    commentContainerRef.current.style.height = newShowComment ? '100%' : '0px';
                }
            }, 0);
            return newShowComment;
        });
    };

    return (
        <div className="comments">
            <div className="comments_title">

                <h2>comments</h2>
                
                <Arrow onClick={handleClick} width={"20px"} height={'30px'} />

            </div>
            <div className="comment_container" ref={commentContainerRef}>
                {comments?.map((comment) => (
                    <div key={comment.id}>
                        <div className="comment_user_section" onClick={() => navigatTo(`/user/show/${comment.user.id}`)}>
                            <img src={comment.user.profile_image || '/default.png'} alt="" />
                            <span>{comment.user.name || 'feetching ...'}</span>
                        </div>
                        <p>{comment.content}</p>
                        <hr />
                    </div>
                ))}
            </div>
        </div>
    )
}