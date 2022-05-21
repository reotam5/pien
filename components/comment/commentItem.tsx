import { Divider } from '@mui/material';
import { useRouter } from 'next/router';
import React from 'react';
import { CommentData } from '../../constants/types';


interface Props {
    comment: CommentData;
}

const CommentItem: React.FC<Props> = (props) => {
    const router = useRouter();
    const [ replyState, setReplyState ] = React.useState<boolean>(false);
    return (
        <div className="bg-white rounded-lg p-5">
            <div
                className='flex items-end gap-1 hover:cursor-pointer'
                onClick={() => { router.push(`/${props.comment.createdby.username}`); }}
            >
                <div className='text-xl'>
                    {props.comment.createdby.profile_emoji}
                </div>
                <div className='font-semibold text-lg'>
                    {props.comment.createdby.username}
                </div>
                <div className='text-gray-500'>
                    {props.comment.created}
                </div>
            </div>
            <div className='my-5'>
                {props.comment.content}
            </div>

            {
                props.comment.comments.length > 0
                &&
                (
                    <div className='mb-5'>
                        <Divider />
                    </div>
                )
            }

            {
                props.comment.comments.map(comment => (
                    <div>
                        <div
                            className='flex items-end gap-1 hover:cursor-pointer'
                            onClick={() => { router.push(`/${comment.createdby.username}`); }}
                        >
                            <div className='text-xl'>
                                {comment.createdby.profile_emoji}
                            </div>
                            <div className='font-semibold text-lg'>
                                {comment.createdby.username}
                            </div>
                            <div className='text-gray-500'>
                                {comment.created}
                            </div>
                        </div>
                        <div className='flex gap-5 ml-3'>
                            <Divider orientation="vertical" flexItem sx={{ borderRightWidth: 2 }} />
                            <div className='my-5'>
                                {comment.content}
                            </div>
                        </div>
                    </div>
                ))
            }

            {
                replyState
                ?
                <div className='rounded-xl ring-1 ring-gray-300 w-full px-5 pt-5 flex flex-col'>
                    <div>
                        <textarea className='w-full h-32 p-3' placeholder='Write a reply...'/>
                    </div>
                    <Divider/>
                    <div className='flex gap-3 justify-end my-3'>
                        <button 
                            className='hover:bg-gray-300 text-gray-500 font-bold py-2 px-4 rounded-lg'
                            onClick={() => { setReplyState(false); }}
                        >
                            Cancel
                        </button>
                        <button 
                            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg'
                            onClick={() => { setReplyState(false); }}
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