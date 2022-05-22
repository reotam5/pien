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
import PostCreateModal from '../../components/postModal/postCreateModal'
import { getSession, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { getUserInfoForProfilePage } from '../../prisma/services/profile'

interface Props {
    data: UserData;
}

const Index: NextPage<Props> = (props) => {
    const { data: session } = useSession();
    const [modalShow, setModalShow] = React.useState(false);
    const handleModalShow = () => setModalShow(!modalShow);
    const router = useRouter();
    if (props.data.username === null) {
        router.push('/');
    }
    return (
        <>
            {modalShow && <PostCreateModal toggleModal={handleModalShow} />}
            {
                session &&
                <Fab
                    color="primary"
                    className="fixed bottom-10 right-5 bg-blue-300 hover:bg-blue-400 z-40"
                    onClick={handleModalShow}
                >
                    <AddIcon />
                </Fab>
            }
            <Navbar />
            <div className='min-h-screen bg-blue-100'>
                <div className='px-9 bg-white'>
                    <ProfileHeader userData={props.data} />
                </div>
                <div className='px-9 bg-blue-100 flex justify-center'>
                    {
                        props.data.postOverviews.length > 0
                        ?
                        <PostList listTitle='Posts' posts={props.data.postOverviews} />
                        :
                        (
                            <div className='flex flex-col justify-center items-center p-10 gap-3'>
                                <div className='text-7xl'>
                                    😭
                                </div>
                                <div className='text-xl font-semibold'>
                                    No post found...
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
            <Footer />
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { username } = context.query
    const session = await getSession(context)
    const user: UserData = JSON.parse(JSON.stringify(
        await getUserInfoForProfilePage({username: username}, session?.user.id)
    ));
    const response: Props = {
        data: {
            ...user,
        }
    }
    return {
        props: { ...response }
    }
}



export default Index