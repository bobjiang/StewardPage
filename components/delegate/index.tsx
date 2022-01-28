import { Contract } from "ethers";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import { useRecoilState } from "recoil";
import { providers } from "ethers";

import { walletState } from "../../atoms/wallet";
import Connect from "../../components/connect";
import { GITCOIN_ABI, GITCOIN_CONTRACT } from "../../constants/token";
import SuccessAlert from "../../components/alert/success";

const Delegate = () => {
  const router = useRouter();
  const { address } = router.query;

  const [wallet] = useRecoilState(walletState);

  // console.log("provider11", provider);
  const { provider } = wallet;
  const [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const handleVoteBtn = useCallback(async () => {
    try {
      const web3Provider = new providers.Web3Provider(provider);

      const gitcoinContract = new Contract(
        GITCOIN_CONTRACT,
        GITCOIN_ABI,
        web3Provider.getSigner()
      );

      // We send the transaction, and save its hash in the Dapp's state. This
      // way we can indicate that we are waiting for it to be mined.
      const tx = await gitcoinContract.delegate(address);

      // We use .wait() to wait for the transaction to be mined. This method
      // returns the transaction's receipt.
      const receipt = await tx.wait();

      // The receipt, contains a status flag, which is 0 to indicate an error.
      if (receipt.status === 0) {
        // We can't know the exact error that make the transaction fail once it
        // was mined, so we throw this generic one.
        throw new Error("Transaction failed");
      }

      setIsOpen(false);
    } catch (error) {
      console.log("error", error);
      setIsOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provider]);

  return (
    <div className="container mx-auto">
      <div className={isOpen ? "modal modal-open" : "modal"}>
        <div className="modal-box">
          <p className="text-lg text-center">Delegate vote</p>
          <p>
            Remember you are delegating all your votes. To get your votes back
            you have to delegate to yourself again.
          </p>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Delegate address</span>
            </label>
            <input
              type="text"
              placeholder="vote address"
              className="input input-bordered"
              defaultValue={address}
            />
          </div>
          <div className="modal-action">
            <button className="btn btn-primary" onClick={handleVoteBtn}>
              Vote
            </button>
            <button className="btn" onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <div>
          <button className="btn btn-sm btn-accent" onClick={openModal}>
            Delegate To
          </button>
        </div>
      </div>
    </div>
  );
};

export default Delegate;
