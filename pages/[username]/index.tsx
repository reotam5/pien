import type { NextPage, GetServerSideProps } from 'next'
import Footer from '../../components/footer'
import Navbar from '../../components/navbar'
import PostList from '../../components/postlist/postList'
import ProfileHeader from '../../components/profile/profileHeader'
import { UserData } from '../../constants/types'
import * as React from 'react';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import PostCreateModal from '../../components/postCreateModal'

interface Props {
    data: UserData;
    status: number;
    statusText: string;
    headers: {};
    config: {};
    request: {};
}

const Index: NextPage<Props> = (props) => {
    const [ modalShow, setModalShow ] = React.useState(false);
    const handleModalShow = () => setModalShow(!modalShow);

    return (
        <>  
            {modalShow && <PostCreateModal toggleModal={handleModalShow}/>}
            <Fab 
                color="primary" 
                className="fixed bottom-5 right-5 bg-blue-300 hover:bg-blue-400"
                onClick={handleModalShow}
            >
                <AddIcon />
            </Fab>
            <Navbar />
            <div className='min-h-screen bg-blue-100'>
                <div className='px-9 bg-white'>
                    <ProfileHeader userData={props.data} />
                </div>
                <div className='px-9 bg-blue-100 flex justify-center'>
                    <PostList listTitle='Posts' posts={props.data.posts} />
                </div>
            </div>
            <Footer />
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    // fetch user data here
    // using dummy data for now
    const { username } = context.query
    const response: Props = {
        data: {
            profile_emoji: '🤣',
            username: username!,
            bio: "フロントエンドエンジニア。",
            followers: 100,
            likes: 200,
            github: "https://github.com/reotam5",
            posts: [
                { id: "1", title: 'test post 1', emoji: "😀", likes: 10, comments: 10, views: 10, edited: "2 month ago", createdby: { username: "reotam27", profile_emoji: "🤣" }, created: "4 month ago" },
                { id: "2", title: 'test post 2', emoji: "😀", likes: 10, comments: 10, views: 10, edited: "2 month ago", createdby: { username: "reotam27", profile_emoji: "🤣" }, created: "4 month ago" },
                { id: "3", title: 'test post 3', emoji: "😀", likes: 10, comments: 10, views: 10, edited: "2 month ago", createdby: { username: "reotam27", profile_emoji: "🤣" }, created: "4 month ago" },
                { id: "4", title: 'test post 4', emoji: "😀", likes: 10, comments: 10, views: 10, edited: "2 month ago", createdby: { username: "reotam27", profile_emoji: "🤣" }, created: "4 month ago" },
                { id: "5", title: 'test post 5', emoji: "😀", likes: 10, comments: 10, views: 10, edited: "2 month ago", createdby: { username: "reotam27", profile_emoji: "🤣" }, created: "4 month ago" },
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



export default Index