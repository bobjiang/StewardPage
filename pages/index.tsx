import type { NextPage } from "next";
import { useRecoilValue } from "recoil";
import React from "react";

import Connect from "../components/connect";
import Gitcoin from "../components/gitcoin";

import { walletState } from "../atoms/wallet";

const Home: NextPage = () => {
  const { address } = useRecoilValue(walletState);

  return (
    <div>
      <Connect />
      {address && <Gitcoin />}
    </div>
  );
};

// export async function getStaticProps() {
//   return {
//     props: {},
//   };
// }

export default Home;
