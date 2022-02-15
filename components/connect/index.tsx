import { useCallback, useEffect } from "react"
import { providers } from "ethers"
import { useRecoilState } from "recoil"

import web3Modal from "../../lib/web3"
import { ellipseAddress, getChainData } from "../../lib/utilities"
import { initialState, walletState } from "../../atoms/wallet"
import { Box, Button, Typography } from "@mui/material"

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
  const [wallet, setWallet] = useRecoilState(walletState)

  const { provider, address, chainId } = wallet

  const connect = useCallback(async function () {
    // This is the initial `provider` that is returned when
    // using web3Modal to connect. Can be MetaMask or WalletConnect.
    const provider = await web3Modal.connect()

    // We plug the initial `provider` into ethers.js and get back
    // a Web3Provider. This will add on methods from ethers.js and
    // event listeners such as `.on()` will be different.
    const web3Provider = new providers.Web3Provider(provider)

    const signer = web3Provider.getSigner()
    const address = await signer.getAddress()

    const network = await web3Provider.getNetwork()

    setWallet({
      provider,
      web3Provider,
      address,
      chainId: network.chainId,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const disconnect = useCallback(
    async function () {
      await web3Modal.clearCachedProvider()
      setWallet(initialState)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [provider],
  )

  const connectWalletButton = () => {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "row-reverse",
          padding: 2,
          paddingRight: 4,
          gap: 2,
          alignItems: "center",
        }}
      >
        <Button size="large" type="button" onClick={connect}>
          Connect
        </Button>
        <Typography variant="h6">Welcome to StewardPage!</Typography>
      </Box>
    )
  }

  // Auto connect to the cached provider
  useEffect(() => {
    if (web3Modal.cachedProvider) {
      connect()
    }
  }, [connect])

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
      }

      // https://docs.ethers.io/v5/concepts/best-practices/#best-practices--network-changes
      const handleChainChanged = (_hexChainId: string) => {
        window.location.reload()
      }

      const handleDisconnect = (error: { code: number; message: string }) => {
        // eslint-disable-next-line no-console

        disconnect()
      }

      provider.on("accountsChanged", handleAccountsChanged)
      provider.on("chainChanged", handleChainChanged)
      provider.on("disconnect", handleDisconnect)

      // Subscription Cleanup
      return () => {
        if (provider.removeListener) {
          provider.removeListener("accountsChanged", handleAccountsChanged)
          provider.removeListener("chainChanged", handleChainChanged)
          provider.removeListener("disconnect", handleDisconnect)
        }
      }
    }
  }, [provider, disconnect])

  const chainData = getChainData(chainId)

  return (
    <>
      {address ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row-reverse",
            padding: 2,
            gap: 2,
            alignItems: "center",
          }}
        >
          <Button onClick={disconnect}>disconnect</Button>

          <Typography variant="h6">
            Address:{" "}
            <Typography variant="body1">{ellipseAddress(address)}</Typography>
          </Typography>
          <Typography variant="h6">
            Network: <Typography variant="body1">{chainData?.name}</Typography>
          </Typography>
        </Box>
      ) : (
        connectWalletButton()
      )}
    </>
  )
}

export default Connect
