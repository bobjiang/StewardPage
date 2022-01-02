import { useCallback, useEffect } from "react";
import { providers } from "ethers";
import { useRecoilState } from "recoil";

import web3Modal from "../../lib/web3";
import { ellipseAddress, getChainData } from "../../lib/utilities";
import { initialState, walletState } from "../../atoms/wallet";

// const initialState: StateType = {
//   provider: null,
//   web3Provider: null,
//   address: undefined,
//   chainId: undefined,
//   gitcoinDaoInfo: {
//     account: {
//       votes: "0",
//       ballotsCastCount: "0",
//       tokenBalance: "0",
//     },
//     delegators: [{ tokenBalance: "0", id: "0" }],
//   },
// };

const Connect = () => {
  // const [state, dispatch] = useReducer(reducer, initialState);
  const [wallet, setWallet] = useRecoilState(walletState);

  const { provider, address, chainId } = wallet;

  const connect = useCallback(async function () {
    // This is the initial `provider` that is returned when
    // using web3Modal to connect. Can be MetaMask or WalletConnect.
    const provider = await web3Modal.connect();

    // We plug the initial `provider` into ethers.js and get back
    // a Web3Provider. This will add on methods from ethers.js and
    // event listeners such as `.on()` will be different.
    const web3Provider = new providers.Web3Provider(provider);

    const signer = web3Provider.getSigner();
    const address = await signer.getAddress();

    const network = await web3Provider.getNetwork();

    setWallet({
      provider,
      web3Provider,
      address,
      chainId: network.chainId,
    });
  }, []);

  const disconnect = useCallback(
    async function () {
      await web3Modal.clearCachedProvider();
      setWallet(initialState);
    },
    [provider]
  );

  const connectWalletButton = () => {
    return (
      <div className="flex items-stretch h-screen">
        <div className="self-center flex-1 text-center">
          <button
            className="w-48 p-4 font-bold text-white bg-indigo-600 rounded-full shadow-xl hover:bg-indigo-500"
            type="button"
            onClick={connect}
          >
            Connect
          </button>
        </div>
      </div>
    );
  };

  // Auto connect to the cached provider
  useEffect(() => {
    if (web3Modal.cachedProvider) {
      connect();
    }
  }, [connect]);

  // A `provider` should come with EIP-1193 events. We'll listen for those events
  // here so that when a user switches accounts or networks, we can update the
  // local React state with that new information.
  useEffect(() => {
    if (provider?.on) {
      const handleAccountsChanged = (accounts: string[]) => {
        // eslint-disable-next-line no-console
        // setWallet({
        //   address: accounts[0],
        // });
      };

      // https://docs.ethers.io/v5/concepts/best-practices/#best-practices--network-changes
      const handleChainChanged = (_hexChainId: string) => {
        window.location.reload();
      };

      const handleDisconnect = (error: { code: number; message: string }) => {
        // eslint-disable-next-line no-console

        disconnect();
      };

      provider.on("accountsChanged", handleAccountsChanged);
      provider.on("chainChanged", handleChainChanged);
      provider.on("disconnect", handleDisconnect);

      // Subscription Cleanup
      return () => {
        if (provider.removeListener) {
          provider.removeListener("accountsChanged", handleAccountsChanged);
          provider.removeListener("chainChanged", handleChainChanged);
          provider.removeListener("disconnect", handleDisconnect);
        }
      };
    }
  }, [provider, disconnect]);

  const chainData = getChainData(chainId);

  return (
    <div className="container mx-auto ">
      {address ? (
        <div className="flex flex-row-reverse">
          <div className="">
            <button
              className="p-2 font-bold text-white rounded-full shadow-xl bg-amber-500 w-26"
              type="button"
              onClick={disconnect}
            >
              disconnect
            </button>
          </div>

          <div className="mr-5">
            <p className="p-2">Address:{ellipseAddress(address)}</p>
          </div>

          <div className="mr-4">
            <p className="p-2">Network: {chainData?.name}</p>
          </div>
        </div>
      ) : (
        connectWalletButton()
      )}
    </div>
  );
};

export default Connect;
