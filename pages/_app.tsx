import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { SessionProvider } from "next-auth/react"
import UsernameRegisterForm from '../components/usernameRegisterForm'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <UsernameRegisterForm/>
      <ToastContainer />
      <Component {...pageProps} />
    </SessionProvider>
  )
}

export default MyApp
