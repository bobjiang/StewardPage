import { Contract } from "ethers"
import { useRouter } from "next/router"
import { useCallback, useState } from "react"
import { useRecoilState } from "recoil"
import { providers, ContractTransaction } from "ethers"
import LinkIcon from "@mui/icons-material/Link"
import LoadingButton from "@mui/lab/LoadingButton"
import { Button, TextField, ButtonProps, Typography } from "@mui/material"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import { toast } from "react-toastify"

import { walletState } from "../../atoms/wallet"
import { GITCOIN_ABI, GITCOIN_CONTRACT } from "../../constants/token"
import { getChainData } from "../../lib/utilities"
import Connect from "../connect"

type DelegateProps = ButtonProps & { address?: string }

const Delegate = ({ address, ...buttonProps }: DelegateProps) => {
  const [wallet] = useRecoilState(walletState)

  const { provider, chainId, address: connectedAddress } = wallet
  const isOnSupportedChain = chainId === 1
  const [isOpen, setIsOpen] = useState(false)
  const [isDelegating, setIsDelegating] = useState(false)

  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    if (!isOnSupportedChain) {
      handleSwitchNetwork()
      return
    }

    setIsOpen(true)
  }

  const handleSwitchNetwork = useCallback(async () => {
    if (!provider) {
      return
    }
    const chainIdToChangeTo = 1
    try {
      await provider?.send("wallet_switchEthereumChain", [
        { chainId: `0x${chainIdToChangeTo.toString(16)}` },
        address,
      ])
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          await provider?.send("wallet_addEthereumChain", [
            getChainData(chainIdToChangeTo),
            address,
          ])
        } catch (addError) {
          // handle "add" error
          console.error(`Add chain error ${addError}`)
        }
      }
      console.error(`Switch chain error ${switchError}`)
      // handle other "switch" errors
    }
  }, [address, provider])

  const handleVoteBtn = useCallback(async () => {
    setIsDelegating(true)
    try {
      const web3Provider = new providers.Web3Provider(provider)

      const gitcoinContract = new Contract(
        GITCOIN_CONTRACT,
        GITCOIN_ABI,
        web3Provider.getSigner(),
      )

      // We send the transaction, and save its hash in the Dapp's state. This
      // way we can indicate that we are waiting for it to be mined.
      const tx = await gitcoinContract.delegate(address)
      setIsOpen(false)
      showTransactionToast(tx)
    } catch (error) {
      console.log("error", error)
    } finally {
      setIsOpen(false)
      setIsDelegating(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provider])

  if (!connectedAddress) {
    return <Connect btnText="Connect your wallet to delegate" noWelcome />
  }

  return (
    <>
      <Dialog
        open={isOpen}
        onClose={isDelegating ? null : closeModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        disableEscapeKeyDown
      >
        <DialogTitle id="alert-dialog-title">Delegate vote</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {address
              ? `You're about to delegate your voting powers to ${address}!`
              : "Remember you are delegating all your votes. To get your votes back you have to delegate to yourself again."}
          </DialogContentText>
          {!address && (
            <TextField
              required
              fullWidth
              id="address"
              label="Delegate address"
              variant="standard"
              margin="normal"
            />
          )}
        </DialogContent>

        <DialogActions>
          {!isDelegating && <Button onClick={closeModal}>Nope</Button>}
          <LoadingButton onClick={handleVoteBtn} loading={isDelegating}>
            Confirm
          </LoadingButton>
        </DialogActions>
      </Dialog>

      {!isOnSupportedChain && (
        <Typography variant="body2" color="error.main">
          You are not on the supported chain. Please switch to the supported
          chain.
        </Typography>
      )}

      <Button variant="contained" onClick={openModal} {...buttonProps}>
        {!isOnSupportedChain ? "Switch" : buttonProps.children ?? "Delegate To"}
      </Button>
    </>
  )
}

export default Delegate

const showTransactionToast = (tx: ContractTransaction) => {
  // We use .wait() to wait for the transaction to be mined. This method
  // returns the transaction's receipt.

  return toast.promise(
    async () => {
      const receipt = await tx.wait()
      // The receipt, contains a status flag, which is 0 to indicate an error.
      if (receipt.status === 0) {
        // We can't know the exact error that make the transaction fail once it
        // was mined, so we throw this generic one.
        throw new Error("Transaction failed")
      }
      return
    },
    {
      pending: {
        render: () => "Waiting for delegation transaction to be mined...",
      },
      success: {
        render: () => {
          return (
            <span>
              Your delegation transaction was mined! You can check the status of
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={`https://etherscan.io/tx/${tx.hash}`}
              >
                Etherscan
                <LinkIcon />
              </a>
            </span>
          )
        },
      },
      error: {
        render: () => "Delegation transaction failed!",
      },
    },
  )
}
