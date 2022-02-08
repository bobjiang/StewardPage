import { selectorFamily } from "recoil"
import { QueryStewardInfo } from "../apollo/query"

export const queryStewardInfo = selectorFamily({
  key: "QueryStewardInfo",
  get: (address) => async () => {
    // Name is required
    if (!address) {
      return
    }
    try {
      const response = await QueryStewardInfo(address as string)
      return response
    } catch (error) {
      throw error
    }
  },
})
