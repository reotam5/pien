import type { NextComponentType } from 'next'
import { useState } from 'react';

interface Props {
    username: string | string[] | undefined;
}

const FollowButton: React.FC<Props> = (props) => {

    const [following, setFollowing] = useState(false);
    const handleFollow = () => {
        setFollowing(true);
        alert(`TODO: call api here ${props.username}`);
    }
    const handleUnFollow = () => {
        setFollowing(false);
        alert(`TODO: call api here ${props.username}`);
    }
    return (
        (following) ?
            <button 
                className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full' 
                onClick={handleUnFollow}
            >
                Following
            </button>
            :
            <button
                className='bg-white hover:bg-blue-200 text-blue-700 font-bold py-2 px-4 rounded-full ring-1 ring-blue-500'
                onClick={handleFollow}
            >
                Follow
            </button>
    )
}

export default FollowButton