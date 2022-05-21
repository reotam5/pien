import type { GetServerSideProps, NextPage } from 'next'
import { useRouter } from 'next/router'
import CommentList from '../../components/comment/commentList';
import Footer from '../../components/footer'
import Navbar from '../../components/navbar'
import { PostData } from '../../constants/types';

interface Props {
    data: PostData;
    status: number;
    statusText: string;
    headers: {};
    config: {};
    request: {};
}

const Post: NextPage<Props> = (props) => {
    const router = useRouter();
    return (
        <div className="bg-blue-100">
            <Navbar />
            <div className='min-h-screen px-9 pb-10 max-w-4xl mx-auto'>
                <div 
                    className='flex flex-col py-9 w-fit'
                >
                    <h1 className='font-bold text-3xl'>{props.data.postOverview.title}</h1>
                    <div 
                        className='flex items-end gap-1 hover:cursor-pointer'
                        onClick={() => {router.push(`/${props.data.postOverview.createdby.username}`);}}
                    >
                        <div className='text-xl'>
                            {props.data.postOverview.createdby.profile_emoji}
                        </div>
                        <div className='font-semibold text-lg'>
                            {props.data.postOverview.createdby.username}
                        </div>
                        <div className='text-gray-500'>
                            {props.data.postOverview.created}
                        </div>
                    </div>
                </div>

                <div>
                    <CommentList comments={props.data.comments}/>
                </div>
                
            </div>
            <Footer />
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    // fetch user data here
    // using dummy data for now
    const { username, postid } = context.query

    const response: Props = {
        data: {
            id: postid!,
            postOverview: { id: postid!, title: `test post ${postid}`, emoji: "😀", likes: 10, comments: 10, views: 10, edited: "2 month ago", createdby: { username: "reotam27", profile_emoji: "🤣" },created: "4 month ago", },
            comments: [
                {
                    id: "1",
                    post_id: postid!,
                    content: "test comment 1",
                    createdby: { username: username!, profile_emoji: "🤣" },
                    comments: [
                        {
                            id: "1",
                            post_id: postid!,
                            content: "test comment 1-2",
                            createdby: { username: username!, profile_emoji: "🤣" },
                            parent_comment_id: "1",
                            created: "4 month ago"
                        },
                        {
                            id: "1",
                            post_id: postid!,
                            content: "test comment 1-3",
                            createdby: { username: username!, profile_emoji: "🤣" },
                            parent_comment_id: "1",
                            created: "4 month ago"
                        }
                    ],
                    created: "4 month ago",
                    parent_comment_id: null,
                },
                {
                    id: "2",
                    post_id: postid!,
                    content: "test comment 2",
                    createdby: { username: username!, profile_emoji: "🤣" },
                    comments: [],
                    created: "4 month ago",
                    parent_comment_id: null,
                }
            ]
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
        request: {},
    }

    return {
        props: { ...response }
    }
}

export default Post