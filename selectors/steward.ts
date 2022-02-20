import { selectorFamily } from "recoil"
import { QueryStewardInfo, QueryRecentVotes } from "../apollo/query"

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

export const queryRecentVotes = selectorFamily({
  key: "QueryRecentVotes",
  get: (address) => async () => {
    if (!address || typeof address !== "string") {
      return
    }
    try {
      const response = await QueryRecentVotes({
        accountIds: [
          `eip155:1:${address}`,
          // Should've grap this from the chain list query
          // "eip155:69:0x34aa3f359a9d614239015126635ce7732c18fdf3",
          // "eip155:4:0x34aa3f359a9d614239015126635ce7732c18fdf3",
          // "eip155:43114:0x34aa3f359a9d614239015126635ce7732c18fdf3",
          // "eip155:80001:0x34aa3f359a9d614239015126635ce7732c18fdf3",
          // "eip155:42:0x34aa3f359a9d614239015126635ce7732c18fdf3",
          // "eip155:10:0x34aa3f359a9d614239015126635ce7732c18fdf3",
          // "eip155:137:0x34aa3f359a9d614239015126635ce7732c18fdf3",
        ],
      })
      return response
    } catch (error) {
      throw error
    }
  },
})
