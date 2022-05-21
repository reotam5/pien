import { PostOverview } from '../../constants/types';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useRouter } from 'next/router';
interface Props {
    post: PostOverview;
}

const PostItem: React.FC<Props> = (props) => {
    const router = useRouter();
    const handleOnClick = () => {
        router.push(`/${props.post.createdby.username}/${props.post.id}`);
    }
    return (
        <div className='w-full p-5 sm:w-1/2 lg:w-1/3'>
            <div 
                className='rounded-xl bg-white shadow-md h-56 grid grid-rows-12 overflow-hidden hover:shadow-xl hover:cursor-pointer'
                onClick={handleOnClick}
            >
                <div className='row-span-4 bg-blue-200 flex justify-center items-center text-5xl'>
                    {props.post.emoji}
                </div>
                <div className='row-auto p-3'>
                    <div className='font-semibold text-xl'>
                        {props.post.title}
                    </div>
                </div>
                <div className='row-span-1 p-3 flex items-end gap-2'>
                    <div className='text-2xl'>
                        {props.post.createdby.profile_emoji}
                    </div>
                    <div className='flex flex-col text-sm leading-4'>
                        <div>
                            {props.post.createdby.username}
                        </div>
                        <div>
                            {props.post.edited}
                        </div>
                    </div>
                    <div className='text-xs'>
                        <FavoriteBorderIcon color="disabled" fontSize='small'/>{props.post.likes}
                    </div>
                    <div className='text-xs'>
                        <VisibilityIcon color="disabled" fontSize='small'/>{props.post.views}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PostItem