import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { api } from "../utils/api";

import "../styles/globals.css";
import { MainNavbar } from "../components/Navbar";
import { MainContainer } from "../components/MainContainer";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useSocketIOStore } from "../stores/socketio";
import { useEffect } from "react";
import { env } from "process";
import { ToastContainer } from "react-toastify";

import 'react-toastify/dist/ReactToastify.css';

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  useEffect(() => {
    void fetch(`${env.NEXT_HOSTNAME ?? ''}/api/socket`)
  }, [])
  useSocketIOStore()

  return (
    <SessionProvider session={session}>
      <MainNavbar />
      <MainContainer>
        <Component {...pageProps} />
      </MainContainer>
      <ReactQueryDevtools initialIsOpen={false} />
      <ToastContainer />
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
