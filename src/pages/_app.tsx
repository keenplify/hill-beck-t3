import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { api } from "../utils/api";

import "../styles/globals.css";
import { MainNavbar } from "../components/Navbar";
import { MainContainer } from "../components/MainContainer";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import { ToastContainer } from "react-toastify";

import 'react-toastify/dist/ReactToastify.css';


const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {


  return (
    <SessionProvider session={session}>
      <MainNavbar />
      <MainContainer>
        <Component {...pageProps} />
      </MainContainer>
      <ReactQueryDevtools initialIsOpen={false} />
      <ToastContainer position="bottom-right" />
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
