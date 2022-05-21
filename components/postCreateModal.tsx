import { Divider, TextField } from '@mui/material'
import type { NextComponentType } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import React from 'react'

interface Props {
    toggleModal: () => void;
}

const PostCreateModal: React.FC<Props> = ({toggleModal}: Props) => {
    const [title, setTitle] = React.useState('');
    const [emoji, setEmoji] = React.useState('');
    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === 'title') {
            setTitle(value);
        } else if (name === 'emoji') {
            setEmoji(value);
        }
    }

    return (
        <div className='fixed z-50 bg-opacity-80 bg-gray-400 w-screen h-screen flex justify-center items-center'>
            <div className='bg-white w-10/12 max-w-3xl rounded-xl sm:w-7/12'>
                <div className='font-bold text-2xl mx-4 my-3 text-center'>
                    Create a Post
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
                    <TextField 
                        id="emoji" 
                        label="Emoji" 
                        variant="standard" 
                        name="emoji"
                        value={emoji}
                        onChange={handleOnChange}
                    />
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
                        onClick={toggleModal}
                    >
                        Create
                    </button>
                </div>
            </div>
        </div>
    )
}

export default PostCreateModal