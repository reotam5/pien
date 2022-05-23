import { Fab } from '@mui/material'
import type { GetServerSideProps, NextPage } from 'next'
import { getSession, useSession } from 'next-auth/react'
import React from 'react'
import Footer from '../components/footer'
import Navbar from '../components/navbar'
import PostCreateModal from '../components/postModal/postCreateModal'
import AddIcon from '@mui/icons-material/Add';
import { PostOverview } from '../types/types'
import { getLatestPosts, getPostsFromFollowing } from '../prisma/services/post'
import PostList from '../components/postlist/postList'

type Props = {
  latestPosts: PostOverview[];
  followingPosts: PostOverview[];
}
const Home: NextPage<Props> = (props) => {
  const { data: session } = useSession();
  const [modalShow, setModalShow] = React.useState(false);
  const handleModalShow = () => setModalShow(!modalShow);
  return (
    <div>
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
      <div className='min-h-screen bg-slate-200'>
        <div className='px-9 bg-blue-100 flex flex-col justify-center'>
          {
            props.latestPosts.length > 0
              ?
              <PostList listTitle='New' posts={props.latestPosts} />
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
          {
            session
            &&
            (
              props.followingPosts.length > 0
                ?
                <PostList listTitle='Following' posts={props.followingPosts} />
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
            )
          }
        </div>
      </div>
      <Footer />
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context)
  const latestPosts = JSON.parse(JSON.stringify(
    await getLatestPosts()
  ));
  const followingPosts = JSON.parse(JSON.stringify(
    await getPostsFromFollowing(session?.user.id)
  ));
  return {
    props: {
      latestPosts: latestPosts,
      followingPosts: followingPosts
    }
  }
}

export default Home