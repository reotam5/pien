import { UserData } from '../../constants/types';
import FollowButton from '../buttons/follow';
import GitHubIcon from '@mui/icons-material/GitHub';

interface Props {
    userData: UserData;
}

const ProfileHeader: React.FC<Props> = (props) => {
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
                        <FollowButton username={props.userData.username} />
                    </div>
                    <div>
                        {props.userData.bio}
                    </div>
                    <div className='flex gap-2'>
                        <div>
                            <span className='font-bold'>{props.userData.likes}</span> Likes
                        </div>
                        <div>
                            <span className='font-bold'>{props.userData.followers}</span> Followers
                        </div>
                    </div>
                    <div>
                        <GitHubIcon color='primary' />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfileHeader