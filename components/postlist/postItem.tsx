import { PostOverview } from '../../types/types';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { useRouter } from 'next/router';
import moment from 'moment';
interface Props {
    post: PostOverview;
}

const PostItem: React.FC<Props> = (props) => {
    const router = useRouter();
    const handleOnClick = () => {
        router.push(`/${props.post.createdBy.username}/${props.post.postId}`);
    }
    return (
        <div className='w-full p-5 sm:w-1/2 lg:w-1/3'>
            <div 
                className='rounded-xl bg-white shadow-md h-56 grid grid-rows-12 overflow-hidden hover:shadow-xl hover:cursor-pointer'
                onClick={handleOnClick}
            >
                <div className='row-span-4 bg-blue-200 flex justify-center items-center text-5xl'>
                    {props.post.post_emoji}
                </div>
                <div className='row-auto p-3'>
                    <div className='font-semibold text-xl'>
                        {props.post.post_title}
                    </div>
                </div>
                <div className='row-span-1 p-3 flex items-end gap-2'>
                    <div className='text-2xl'>
                        {props.post.createdBy.profile_emoji}
                    </div>
                    <div className='flex flex-col text-sm leading-4'>
                        <div>
                            {props.post.createdBy.username}
                        </div>
                        <div>
                            {moment(props.post.createdAt).fromNow()}
                        </div>
                    </div>
                    <div className='text-xs'>
                        <ChatBubbleOutlineIcon color="disabled" fontSize='small'/> {props.post.comments || 0}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PostItem