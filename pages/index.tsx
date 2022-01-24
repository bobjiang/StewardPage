import { useRouter } from "next/router";
import { useRecoilState } from "recoil";

import { walletState } from "../atoms/wallet";
import SuccessAlert from "../components/alert/success";
import Gitcoin from "../components/gitcoin";
import Connect from "../components/connect";

const Home = () => {
  const router = useRouter();

  const [wallet] = useRecoilState(walletState);

  const address = router.query.address || wallet.address;

  return (
    <div className="container mx-auto">
    <Connect />
      <Gitcoin address={address} />
      {/* <SuccessAlert title="Vote" /> */}
    </div>
  );
};

export default Home;
