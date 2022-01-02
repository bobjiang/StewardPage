import { selector } from "recoil";
import { getApollo } from "../apollo/client";
import { QueryAddressInfo } from "../apollo/query";
import { walletState } from "../atoms/wallet";

const url = `https://reqres.in/api/users?page=1`;

export const queryAddressInfo = selector({
  key: "QueryAddressInfo",
  get: async ({ get }) => {
    try {
      const response = await QueryAddressInfo(getApollo(), {
        // voterAddress: address.toLocaleLowerCase(),
        voterAddress: "0x521aacb43d89e1b8ffd64d9ef76b0a1074dedaf8",
      });

      return response;
    } catch (error) {
      throw error;
    }
  },
});
