import { Divider, TextField } from '@mui/material'
import React from 'react'
import dynamic from 'next/dynamic';
import { getResponse } from '../../utils/responseUtil';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
const Picker = dynamic(() => import('emoji-picker-react'), { ssr: false });

interface Props {
    toggleModal: () => void;
}

const PostCreateModal: React.FC<Props> = ({toggleModal}: Props) => {
    const router = useRouter();
    const [title, setTitle] = React.useState('');
    const [emoji, setEmoji] = React.useState('📚');
    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === 'title') {
            setTitle(value);
        } else if (name === 'emoji') {
            setEmoji(value);
        }
    }
    const handleSubmit = () => {
        fetch('/api/post', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                post_title: title,
                post_emoji: emoji,
            })
        }).then(async (response) => {
            const { status, statusText, data } = await getResponse(response);
            if (data.status === 'ok') {
                toggleModal();
                const username = data.data.createdBy.username;
                const postId = data.data.postId;
                router.push(`/${username}/${postId}`);
            } else {
                toast.error(data.message);
            }
        }).catch((err) => {
            toast.error(err);
        });
    }

    return (
        <div className='fixed z-50 bg-opacity-80 bg-gray-400 w-screen h-screen flex justify-center items-center'>
            <div className='bg-white w-10/12 max-w-3xl rounded-xl sm:w-7/12'>
                <div className='font-bold text-2xl mx-4 my-3 text-center'>
                    Create a Post
                </div>
                <div className='text-center text-9xl'>
                    {emoji}  
                </div>
                <div className='mx-4 my-6 flex flex-col gap-2 justify-center items-center'>
                    <TextField 
                        id="title" 
                        label="Title" 
                        variant="standard" 
                        name="title"
                        value={title}
                        onChange={handleOnChange}
                    />
                    <Picker onEmojiClick={(e, data) => { setEmoji(data.emoji) }} />
                </div>
                <Divider />
                <div className='flex gap-3 justify-end my-3 mx-5'>
                    <button
                        className='hover:bg-gray-300 text-gray-500 font-bold py-2 px-4 rounded-lg'
                        onClick={toggleModal}
                    >
                        Cancel
                    </button>
                    <button
                        className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg'
                        onClick={handleSubmit}

                    >
                        Create
                    </button>
                </div>
            </div>
        </div>
    )
}

export default PostCreateModal