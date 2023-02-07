import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { MainContainer } from "../components/MainContainer";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>D&apos;Land App</title>\
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>
      <MainContainer>
        <div className="container flex flex-col items-center justify-center gap-12 min-h-[calc(100vh-4rem)]">
          <Image src="/logo.png" alt="DLand Logo" width={418} height={418} />
          <div className="flex items-center gap-2">
            <Link className="btn btn-secondary w-32" href="/rooms">
              View Rooms
            </Link>
            <Link className="btn btn-primary w-32" href="/history">
              History
            </Link>
          </div>
        </div>
      </MainContainer>
    </>
  );
};

export default Home;