import { Divider } from '@mui/material';
import moment from 'moment';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import { childComment, CommentData, CommentLike } from '../../types/types';
import { getResponse } from '../../utils/responseUtil';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { IconButton } from '@mui/material';
import { useSession } from 'next-auth/react';
import CommentItemChild from './commentItemChild';

interface Props {
    comment: CommentData;
}

const CommentItem: React.FC<Props> = (props) => {
    const { status, data: session } = useSession();
    const router = useRouter();
    const [replyState, setReplyState] = React.useState<boolean>(false);
    const [reply, setReply] = React.useState<string>('');
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setReply(e.target.value);
    }
    const [childComments, setChildComments] = React.useState<childComment[]>(props.comment.childComments);

    const handleReply = async () => {
        fetch(`/api/post/${props.comment.post_id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                content: reply,
                parentId: props.comment.id
            })
        }).then(async (response) => {
            const { status, statusText, data } = await getResponse(response);
            if (status === 201) {
                setChildComments([...childComments, data.data]);
                setReply("");
                setReplyState(false);
            } else {
                toast.error(data.message);
            }
        });
    }
    const [commentLikes, setCommentLikes] = React.useState<number>(props.comment.commentLikes || 0);
    const [isLiked, setIsLiked] = React.useState<boolean>(props.comment.isLiked);
    const handleLike = async (commentId: string | string[]) => {
        fetch(`/api/commentLike/${commentId}`, {
            method: 'POST',
        }).then(async (response) => {
            const { status, statusText, data } = await getResponse(response);
            if (data.status === 'ok') {
                setIsLiked(true);
                setCommentLikes(commentLikes + 1);
            } else {
                toast.error(data.message);
            }
        }).catch((error) => {
            toast.error(error.message);
        }
        );
    }

    const handleUnlike = async (commentId: string | string[]) => {
        fetch(`/api/commentLike/${commentId}`, {
            method: 'DELETE',
        }).then(async (response) => {
            const { status, statusText, data } = await getResponse(response);
            if (data.status === 'ok') {
                setIsLiked(false);
                setCommentLikes(commentLikes - 1);
            } else {
                toast.error(data.message);
            }
        }).catch((error) => {
            toast.error(error.message);
        }
        );
    }


    return (
        <div className="bg-white rounded-lg p-4">
            <div className='flex justify-between'>
                <div
                    className='flex items-end gap-1 hover:cursor-pointer w-fit'
                    onClick={() => { router.push(`/${props.comment.createdBy.username}`); }}
                >
                    <div className='text-xl'>
                        {props.comment.createdBy.profile_emoji}
                    </div>
                    <div className='font-semibold text-lg'>
                        {props.comment.createdBy.username}
                    </div>
                    <div className='text-gray-500'>
                        {moment(props.comment.createdAt).fromNow()}
                    </div>
                </div>
                <div>
                    {commentLikes}
                    {
                        (isLiked)
                            ?
                            <IconButton
                                onClick={() => { handleUnlike(props.comment.id) }}
                            >
                                <FavoriteBorderIcon color='error' />
                            </IconButton>
                            :
                            <IconButton
                                onClick={() => { handleLike(props.comment.id) }}
                            >
                                <FavoriteBorderIcon />
                            </IconButton>
                    }
                </div>
            </div>

            <div className='my-5 break-words'>
                {props.comment.content}
            </div>



            {
                childComments.length > 0
                &&
                (
                    <div className='mb-5'>
                        <Divider />
                    </div>
                )
            }

            {
                childComments.map(comment => (<CommentItemChild comment={comment}/>))
            }

            {
                replyState
                    ?
                    <div className='rounded-xl ring-1 ring-gray-300 w-full px-5 pt-5 flex flex-col'>
                        <div>
                            <textarea
                                className='w-full h-32 p-3'
                                placeholder='Write a reply...'
                                onChange={handleChange}
                                value={reply}
                            />
                        </div>
                        <Divider />
                        <div className='flex gap-3 justify-end my-3'>
                            <button
                                className='hover:bg-gray-300 text-gray-500 font-bold py-2 px-4 rounded-lg'
                                onClick={() => { setReplyState(false); }}
                            >
                                Cancel
                            </button>
                            <button
                                className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg'
                                onClick={handleReply}
                            >
                                Reply
                            </button>
                        </div>
                    </div>
                    :
                    <div
                        className='rounded-full ring-1 ring-gray-400 flex justify-center items-center w-fit py-1 px-4 text-gray-700 hover:bg-blue-50 hover:cursor-pointer'
                        onClick={() => { setReplyState(true); }}
                    >
                        Reply
                    </div>
            }

        </div>
    )
}

export default CommentItem