import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { MainContainer } from "../components/MainContainer";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Hill-Beck App</title>
      </Head>
      <MainContainer>
        <div className="container flex flex-col items-center justify-center gap-12 min-h-[calc(100vh-4rem)]">
          <h1 className="text-5xl font-extrabold tracking-tight text-primary sm:text-[5rem] text-center">
            Hill-Beck <span className="text-warning">Land Division</span> App
          </h1>
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