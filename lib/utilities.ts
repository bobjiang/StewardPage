import supportedChains from "./chains"
import { IChainData } from "./types"

export function getChainData(chainId?: number): IChainData | undefined {
  if (!chainId) {
    return undefined
  }
  const chainData = supportedChains.filter(
    (chain: any) => chain.chain_id === chainId,
  )[0]

  if (!chainData) {
    throw new Error("ChainId missing or not supported")
  }

  const API_KEY = "460f40a260564ac4a4f4b3fffb032dad"

  if (
    chainData.rpc_url.includes("infura.io") &&
    chainData.rpc_url.includes("%API_KEY%") &&
    API_KEY
  ) {
    const rpcUrl = chainData.rpc_url.replace("%API_KEY%", API_KEY)

    return {
      ...chainData,
      rpc_url: rpcUrl,
    }
  }

  return chainData
}

export function ellipseAddress(address = "", width = 10): string {
  if (!address) {
    return ""
  }
  return `${address.slice(0, width)}...${address.slice(-width)}`
}

export function abbreviateNumber(value) {
  const integerValue = Math.round(value)
  let newValue = integerValue.toString()
  if (integerValue >= 1000) {
    const suffixes = ["", "K", "M", "B", "T"]
    const suffixNum = Math.floor(("" + integerValue).length / 3)
    let shortValue: any
    for (var precision = 2; precision >= 1; precision--) {
      shortValue = parseFloat(
        (suffixNum != 0
          ? integerValue / Math.pow(1000, suffixNum)
          : integerValue
        ).toPrecision(precision),
      )
      const dotLessShortValue = (shortValue + "").replace(/[^a-zA-Z 0-9]+/g, "")
      if (dotLessShortValue.length <= 2) {
        break
      }
    }
    if (shortValue % 1 != 0) shortValue = shortValue.toFixed(1)
    newValue = shortValue + suffixes[suffixNum]
  }
  return newValue
}
