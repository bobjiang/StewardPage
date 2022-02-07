import { selectorFamily } from "recoil";
import { getApollo } from "../apollo/client";
import { QueryAddressInfo } from "../apollo/query";

export const queryAddressInfo = selectorFamily({
  key: "QueryAddressInfo",
  get: (address) => async () => {
    try {
      const response = await QueryAddressInfo(getApollo(), {
        // voterAddress: address,
        voterAddress: "0x521aacb43d89e1b8ffd64d9ef76b0a1074dedaf8",
      });

      return response;
    } catch (error) {
      throw error;
    }
  },
});
