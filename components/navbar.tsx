import { Divider } from '@mui/material';
import type { GetServerSideProps, NextComponentType } from 'next'
import { Session } from 'next-auth';
import { useSession, signOut, signIn, getSession } from 'next-auth/react';
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import UsernameRegisterForm from './usernameRegisterForm';

const Navbar: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const onClick = () => {
    if (session) {
      signOut();
    } else {
      signIn("google");
    }
  };

  const onClickUsername = () => {
    if (session) {
      router.push(`/${session.user.username}`);
    } else {
      router.push('/');
    }
  }

  const onLogoClick = () => {
    router.push('/');
  }

  return (
    <nav className="w-full bg-white">
      <div className="py-4 flex justify-center items-center">
        <div className='max-w-4xl sm:w-8/12 w-11/12 flex justify-between'>
          <div 
            className='text-3xl font-semibold hover:cursor-pointer'
            onClick={onLogoClick}
          >
            🥺Pien
          </div>
          <div>
            {
              status === "authenticated" && session
                ?
                (
                  <div className='flex gap-2 items-center'>
                    <button
                      className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex justify-between items-center gap-2'
                      onClick={onClickUsername}
                    >
                      <div>
                        {session.user.profile_emoji}
                      </div>
                      <div>
                        {session.user.username}
                      </div>
                    </button>
                    <button
                      className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg'
                      onClick={onClick}
                    >
                      Logout
                    </button>
                  </div>
                )
                :
                (
                  <button
                    className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg'
                    onClick={onClick}
                  >
                    Login / Register
                  </button>
                )
            }
          </div>
        </div>
      </div>
      <Divider />
    </nav>
  )
}

export default Navbar