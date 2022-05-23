import { PostOverview } from '../../types/types';
import PostItem from './postItem';

interface Props {
    listTitle: string;
    posts: PostOverview[];
}

const PostList: React.FC<Props> = (props) => {
    return (
        <div className='my-4 w-full max-w-7xl'>
            <h2 className='text-3xl font-semibold ml-5'>{props.listTitle}</h2>
            <div className='flex flex-wrap max-w-screen-xl w-full'>
                {
                    props.posts
                    &&
                    props.posts.map((post) => <PostItem post={post}/>)
                }
            </div>
        </div>
    )
}

export default PostList