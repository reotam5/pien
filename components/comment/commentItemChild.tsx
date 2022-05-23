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

interface Props {
    comment: childComment;
}

const CommentItemChild: React.FC<Props> = (props) => {
    const { status, data: session } = useSession();
    const router = useRouter();

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
        <div className='w-full'>
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

            <div className='flex gap-5 ml-3 w-full pr-10'>
                <Divider orientation="vertical" flexItem sx={{ borderRightWidth: 2 }} />
                <div className='my-5 break-words w-full'>
                    {props.comment.content}
                </div>
            </div>
        </div>
    )
}

export default CommentItemChild