import { useRouter } from "next/router"
import { useRecoilState } from "recoil"

import { walletState } from "../atoms/wallet"
// import SuccessAlert from "../components/alert/success";
import Gitcoin from "../components/gitcoin"
import Dashboard from "../components/dashboard"

const Home = () => {
  return null;

  const router = useRouter()

  const [wallet] = useRecoilState(walletState)

  const address = router.query.address || wallet.address

  return (
    <>
      <Dashboard address={address} />
      {/* <SuccessAlert title="Vote" /> */}
    </>
  )
}

export default Home
