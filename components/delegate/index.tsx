import { Contract } from "ethers"
import { useRouter } from "next/router"
import { useCallback, useState } from "react"
import { useRecoilState } from "recoil"
import { providers } from "ethers"

import { walletState } from "../../atoms/wallet"
import { GITCOIN_ABI, GITCOIN_CONTRACT } from "../../constants/token"
import { Button, TextField, ButtonProps } from "@mui/material"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"

// import SuccessAlert from "../../components/alert/success"

const Delegate = (props: ButtonProps) => {
  const router = useRouter()
  const { address } = router.query

  const [wallet] = useRecoilState(walletState)

  const { provider } = wallet
  const [isOpen, setIsOpen] = useState(false)

  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
  }

  const handleVoteBtn = useCallback(async () => {
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

      // We use .wait() to wait for the transaction to be mined. This method
      // returns the transaction's receipt.
      const receipt = await tx.wait()

      // The receipt, contains a status flag, which is 0 to indicate an error.
      if (receipt.status === 0) {
        // We can't know the exact error that make the transaction fail once it
        // was mined, so we throw this generic one.
        throw new Error("Transaction failed")
      }

      setIsOpen(false)
    } catch (error) {
      console.log("error", error)
      setIsOpen(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provider])

  return (
    <>
      <Dialog
        open={isOpen}
        onClose={closeModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Delegate vote</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Remember you are delegating all your votes. To get your votes back
            you have to delegate to yourself again.
          </DialogContentText>
          <TextField
            required
            fullWidth
            id="address"
            label="Delegate address"
            variant="standard"
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal}>Close</Button>
          <Button onClick={handleVoteBtn} autoFocus>
            Vote
          </Button>
        </DialogActions>
      </Dialog>
      <Button variant="contained" onClick={openModal} {...props}>
        {props.children ?? "Delegate To"}
      </Button>
    </>
  )
}

export default Delegate
