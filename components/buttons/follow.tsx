import type { NextComponentType } from 'next'
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getResponse } from '../../utils/responseUtil';

interface Props {
    username: string | string[] | undefined;
}

const FollowButton: React.FC<Props> = (props) => {

    const [following, setFollowing] = useState<boolean | null>(null);
    const handleFollow = () => {
        fetch(`/api/follow/${props.username}`, {
            method: 'POST',
        }).then(async (response) => {
            const { status, statusText, data } = await getResponse(response);
            if (data.status === 'ok') {
                setFollowing(true);
            } else {
                toast.error(data.message);
            }
        }).catch((error) => {
            toast.error(error.message);
        });
    }
    const handleUnFollow = () => {
        fetch(`/api/follow/${props.username}`, {
            method: 'DELETE',
        }).then(async (response) => {
            const { status, statusText, data } = await getResponse(response);
            if (data.status === 'ok') {
                setFollowing(false);
            } else {
                toast.error(data.message);
            }
        }).catch((error) => {
            toast.error(error.message);
        });
    }
    useEffect(() => {
        fetch(`/api/follow/${props.username}`).then(async (response) => {
            const { status, statusText, data } = await getResponse(response);
            if (data.status === 'ok') {
                setFollowing(data.data.following ?? false);
            } else {
                toast.error(data.message);
            }
        }).catch((error) => {
            toast.error(error.message);
        });
    }, []);

    return (
        <>
        {
            (following === true)
            ?
            <button
                className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full'
                onClick={handleUnFollow}
            >
                Following
            </button>
            :
            (
                (following === false)
                    ?
                    <button
                        className='bg-white hover:bg-blue-200 text-blue-700 font-bold py-2 px-4 rounded-full ring-1 ring-blue-500'
                        onClick={handleFollow}
                    >
                        Follow
                    </button>
                    :
                    <></>
            )
        }
        </>
    );
}

export default FollowButton