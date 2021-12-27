import type { NextPage } from "next";
import { useCallback, useEffect, useReducer, useState } from "react";
import { QueryAddressInfo } from "../apollo/query";
import { getApollo } from "../apollo/client";
import BN from "bn.js";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import WalletLink from "walletlink";
import { providers } from "ethers";
import { ellipseAddress, getChainData } from "../lib/utilities";

const INFURA_ID = "460f40a260564ac4a4f4b3fffb032dad";

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider, // required
    options: {
      infuraId: INFURA_ID, // required
    },
  },
  "custom-walletlink": {
    display: {
      logo: "https://play-lh.googleusercontent.com/PjoJoG27miSglVBXoXrxBSLveV6e3EeBPpNY55aiUUBM9Q1RCETKCOqdOkX2ZydqVf0",
      name: "Coinbase",
      description: "Connect to Coinbase Wallet (not Coinbase App)",
    },
    options: {
      appName: "Coinbase", // Your app name
      networkUrl: `https://mainnet.infura.io/v3/${INFURA_ID}`,
      chainId: 1,
    },
    package: WalletLink,
    connector: async (_: any, options: any) => {
      const { appName, networkUrl, chainId } = options;
      const walletLink = new WalletLink({
        appName,
      });
      const provider = walletLink.makeWeb3Provider(networkUrl, chainId);
      await provider.enable();
      return provider;
    },
  },
};

let web3Modal: any;
if (typeof window !== "undefined") {
  web3Modal = new Web3Modal({
    network: "mainnet", // optional
    cacheProvider: true,
    providerOptions, // required
  });
}

type StateType = {
  provider?: any;
  web3Provider?: any;
  address?: string;
  chainId?: number;
  gitcoinDaoInfo?: any;
};

type ActionType =
  | {
      type: "SET_WEB3_PROVIDER";
      provider?: StateType["provider"];
      web3Provider?: StateType["web3Provider"];
      address?: StateType["address"];
      chainId?: StateType["chainId"];
    }
  | {
      type: "SET_ADDRESS";
      address?: StateType["address"];
    }
  | {
      type: "SET_CHAIN_ID";
      chainId?: StateType["chainId"];
    }
  | {
      type: "RESET_WEB3_PROVIDER";
    }
  | {
      type: "SET_GITCOIN_DAO_INFO";
      gitcoinDaoInfo: StateType["gitcoinDaoInfo"];
    };

const initialState: StateType = {
  provider: null,
  web3Provider: null,
  address: undefined,
  chainId: undefined,
  gitcoinDaoInfo: {
    account: {
      votes: "0",
      ballotsCastCount: "0",
      tokenBalance: "0",
    },
    delegators: [{ tokenBalance: "0", id: "0" }],
  },
};

function reducer(state: StateType, action: ActionType): StateType {
  switch (action.type) {
    case "SET_WEB3_PROVIDER":
      return {
        ...state,
        provider: action.provider,
        web3Provider: action.web3Provider,
        address: action.address,
        chainId: action.chainId,
      };
    case "SET_ADDRESS":
      return {
        ...state,
        address: action.address,
      };
    case "SET_CHAIN_ID":
      return {
        ...state,
        chainId: action.chainId,
      };
    case "SET_GITCOIN_DAO_INFO":
      return {
        ...state,
        gitcoinDaoInfo: action.gitcoinDaoInfo,
      };
    case "RESET_WEB3_PROVIDER":
      return initialState;
    default:
      throw new Error();
  }
}
const Home: NextPage = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { provider, web3Provider, address, chainId } = state;

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

    const gitcoinDaoInfo = await QueryAddressInfo(getApollo(), {
      voterAddress: address,
      // voterAddress: "0x521aacb43d89e1b8ffd64d9ef76b0a1074dedaf8",
    });

    dispatch({
      type: "SET_WEB3_PROVIDER",
      provider,
      web3Provider,
      address,
      chainId: network.chainId,
    });

    dispatch({
      type: "SET_GITCOIN_DAO_INFO",
      gitcoinDaoInfo: gitcoinDaoInfo,
    });
  }, []);

  const disconnect = useCallback(
    async function () {
      await web3Modal.clearCachedProvider();
      if (provider?.disconnect && typeof provider.disconnect === "function") {
        await provider.disconnect();
      }
      dispatch({
        type: "RESET_WEB3_PROVIDER",
      });
    },
    [provider]
  );

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
        console.log("accountsChanged", accounts);
        dispatch({
          type: "SET_ADDRESS",
          address: accounts[0],
        });
      };

      // https://docs.ethers.io/v5/concepts/best-practices/#best-practices--network-changes
      const handleChainChanged = (_hexChainId: string) => {
        window.location.reload();
      };

      const handleDisconnect = (error: { code: number; message: string }) => {
        // eslint-disable-next-line no-console
        console.log("disconnect", error);
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

  const getGitcoinDaoInfo = () => {
    // console.log("account", account);

    const {
      gitcoinDaoInfo: { account, delegators },
    } = state;
    // const { account, delegators } = gitcoinDaoInfo;
    if (!account)
      return (
        <div className="flex items-stretch h-screen">
          <div className="self-center flex-1 text-center">
            <p className="text-5xl text-center text-red-500">
              Address Not Data!
            </p>
          </div>
        </div>
      );
    const { votes, ballotsCastCount, tokenBalance } = account;

    new BN(votes).div(new BN(10).pow(new BN(18))).toString();
    return (
      <div className="container mx-auto ">
        <div className="flex">
          <div className="flex-none w-40 mt-4 mb-0 bg-gray-50">
            <p className="text-2xl text-center text-purple-500"></p>
            <div className="w-full h-1 bg-purple-500"></div>
          </div>
          <div className="flex flex-grow h-16 m-4 mb-0 mr-0 bg-gray-50">
            <div className="flex justify-center w-full">
              <div className="w-40">
                <div className="text-center">
                  {new BN(votes).div(new BN(10).pow(new BN(18))).toString()}
                </div>
                <div className="text-center text-gray-500">Total votes</div>
              </div>
              <div className="w-40">
                <div className="text-center">{ballotsCastCount}</div>
                <div className="text-center text-gray-500">Ballots</div>
              </div>
              <div className="w-40">
                <div className="text-center">
                  {new BN(tokenBalance)
                    .div(new BN(10).pow(new BN(18)))
                    .toString()}
                </div>
                <div className="text-center text-gray-500">Total tokens</div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-row-reverse">
          <div className="flex flex-col flex-none h-64 w-72 bg-gray-50">
            <div className="p-5">
              <div>
                <p className="text-xl leading-7 text-purple-900">
                  Top Delegators
                </p>
                <p className="text-gray-500">Ranking by delegated percentage</p>
              </div>
            </div>

            {delegators.map((item: any, index: any) => {
              const itemBalance = item.tokenBalance;
              const id = item.id;
              if (itemBalance == "0") return;

              return (
                <div className="flex" key={index}>
                  <div className="flex-auto pt-1">
                    <p className="m-1 text-center">{index}</p>
                  </div>
                  <div className="flex-auto pt-1 ">
                    <p className="m-1 text-center">
                      {id.substring(0, 6) + "..." + id.substring(id.length - 4)}
                    </p>
                  </div>
                  <div className="flex-auto pt-1">
                    <p className="m-1 text-center">
                      {(
                        ((itemBalance as any) / (tokenBalance as any)) *
                        100
                      ).toFixed(2) + "%"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    // <div>{web3Provider ? getGitcoinDaoInfo() : connectWalletButton()}</div>
    <div>
      <header className="container mx-auto ">
        {address && (
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
        )}
      </header>

      <main>{web3Provider ? getGitcoinDaoInfo() : connectWalletButton()}</main>
    </div>
  );
};

// export async function getStaticProps() {}

export default Home;
