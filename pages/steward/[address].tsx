import React from "react"
import { useRouter } from "next/router"

import Connect from "../../components/connect"
import Gitcoin from "../../components/gitcoin"
import { Container } from "@mui/material"

const StewardDetail = () => {
  const { query } = useRouter()
  const address = query?.address as string

  return (
    <>
      {/* TODO: Add SEO */}
      <Container maxWidth="lg">
        <Connect />
        <Gitcoin address={address} />
      </Container>
    </>
  )
}

export default StewardDetail
