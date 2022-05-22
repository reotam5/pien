import { Fab } from '@mui/material'
import type { GetServerSideProps, NextPage } from 'next'
import { getSession, useSession } from 'next-auth/react'
import React from 'react'
import Footer from '../components/footer'
import Navbar from '../components/navbar'
import PostCreateModal from '../components/postModal/postCreateModal'
import AddIcon from '@mui/icons-material/Add';

const Home: NextPage = () => {
  const { data: session } = useSession();
  const [modalShow, setModalShow] = React.useState(false);
  const handleModalShow = () => setModalShow(!modalShow);
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
      <div className='min-h-screen bg-slate-200'>

      </div>
      <Footer />
    </>
  )
}

export default Home
