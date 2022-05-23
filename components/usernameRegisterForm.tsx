import { Divider, TextField } from '@mui/material';
import type { GetServerSideProps, NextComponentType, NextPage } from 'next'
import { getSession, useSession, signOut } from 'next-auth/react'
import React, { ChangeEvent, ChangeEventHandler, useRef } from 'react';
import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { getResponse } from '../utils/responseUtil';
const Picker = dynamic(() => import('emoji-picker-react'), { ssr: false });

type Props = {
    forceDisplay?: boolean;
}

const UsernameRegisterForm: NextPage<Props> = (props) => {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [needsToRegister, setNeedsToRegister] = React.useState(props.forceDisplay || false);
    useEffect(() => {
        if (session && session.user.username === null) {
            setNeedsToRegister(true);
        }
    }, [status]);

    const handleLogout = () => {
        signOut();
    }

    const handleOnChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (e.target.name === 'username') {
            setUsername(e.target.value);
        } else if (e.target.name === 'bio') {
            setBio(e.target.value);
        }
    }

    const handleSubmit = () => {
        fetch(`/api/user/${username}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                profile_emoji: profile_emoji,
                bio: bio
            })
        }).then(async (response) => {
            const { status, statusText, data } = await getResponse(response);
            if (data.status === 'ok') {
                router.push(`/${data.data.username}`)
                .then(() => {
                    router.reload();
                });
                setNeedsToRegister(false);
            } else {
                toast.error(data.message);
                setNeedsToRegister(false);
            }
        }).catch(err => {
            toast.error(err);
            setNeedsToRegister(false);
        });
    }
    const [profile_emoji, setProfileEmoji] = React.useState(session?.user.profile_emoji || '😶‍🌫️');
    const [username, setUsername] = React.useState(session?.user.username || '');
    const [bio, setBio] = React.useState(session?.user.bio || '');

    if (needsToRegister) {
        return (
            <div className='fixed z-50 bg-opacity-80 bg-gray-400 w-screen h-screen flex justify-center items-center top-0 left-0'>
                <div className='bg-white w-10/12 max-w-3xl rounded-xl sm:w-7/12'>
                    <div className='font-bold text-2xl mx-4 my-3 text-center'>
                        How should we call you?
                    </div>
                    <div className='text-center text-9xl'>
                        {profile_emoji}
                    </div>
                    <div className='mx-4 my-6 flex flex-col gap-1 justify-center items-center'>
                        <TextField
                            id="username"
                            label="Username"
                            variant="standard"
                            name="username"
                            onChange={handleOnChange}
                            value={username}
                        />
                        <TextField
                            id="bio"
                            label="Bio"
                            variant="standard"
                            name="bio"
                            onChange={handleOnChange}
                            value={bio}
                        />
                        <Picker onEmojiClick={(e, data) => { setProfileEmoji(data.emoji) }} />
                    </div>
                    <Divider />
                    <div className='flex gap-3 justify-end my-3 mx-5'>
                        <button
                            className='hover:bg-gray-300 text-gray-500 font-bold py-2 px-4 rounded-lg'
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                        <button
                            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg'
                            onClick={handleSubmit}
                        >
                            Finish
                        </button>
                    </div>
                </div>
            </div>
        )
    } else {
        return (<></>)
    }
}

export default UsernameRegisterForm