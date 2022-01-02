import { atom } from "recoil";

export const initialState = {
  account: {
    votes: "0",
    ballotsCastCount: "0",
    tokenBalance: "0",
  },
  delegators: [{ tokenBalance: "0", id: "0" }],
};

export const gitcoinState = atom({
  key: "gitcoin", // unique ID (with respect to other atoms/selectors)
  default: initialState, // default value (aka initial value)
  dangerouslyAllowMutability: true,
});
