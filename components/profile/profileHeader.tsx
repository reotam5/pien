import { UserData } from '../../types/types';
import FollowButton from '../buttons/follow';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import UsernameRegisterForm from '../usernameRegisterForm';
import React from 'react';
import { toast } from 'react-toastify';
import { getResponse } from '../../utils/responseUtil';

interface Props {
    userData: UserData;
}

const ProfileHeader: React.FC<Props> = (props) => {
    const likes = props.userData.commentLiked;
    const followers = props.userData.followers;
    const { status, data: session } = useSession();
    const [ isEditing, setIsEditing ] = React.useState(false);
    return (
        <div className='w-full flex justify-center items-center'>
            <div className='py-5 grid grid-cols-3 max-w-xl w-full'>
                <div className='text-8xl sm:col-span-1 col-span-3 mb-5'>
                    {props.userData.profile_emoji}
                </div>
                <div className='flex flex-col w-full gap-2 col-span-3 sm:col-span-2'>
                    <div className='flex justify-between'>
                        <div className='font-bold text-2xl'>
                            {props.userData.username}
                        </div>
                        {
                            (session && session.user.username !== props.userData.username) 
                            &&
                            <FollowButton username={props.userData.username} status={props.userData.amIFollowing}/>
                        }
                        {
                            (session && session.user.username === props.userData.username)
                            &&
                            <button
                            className='bg-white hover:bg-blue-200 text-blue-700 font-bold py-2 px-4 rounded-full ring-1 ring-blue-500'
                            onClick={() => { setIsEditing(true) }}
                        >
                            Edit
                        </button>
                        }
                        {
                            isEditing
                            &&
                            <UsernameRegisterForm forceDisplay={true}/>
                        }
                    </div>
                    <div>
                        {props.userData.bio}
                    </div>
                    <div className='flex gap-2'>
                        <div>
                            <span className='font-bold'>{likes}</span> Likes
                        </div>
                        <div>
                            <span className='font-bold'>{followers}</span> Followers
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfileHeader