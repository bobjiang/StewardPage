import { atom } from "recoil";

export const initialState = {
  provider: null,
  web3Provider: null,
  address: "",
  chainId: 0,
};

export const walletState = atom({
  key: "wallet", // unique ID (with respect to other atoms/selectors)
  default: initialState, // default value (aka initial value)
  dangerouslyAllowMutability: true,
});
