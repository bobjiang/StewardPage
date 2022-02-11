import React from "react"
import { useRouter } from "next/router"
import NextLink from "next/link"
import { Card, Link, Typography } from "@mui/material"

import Connect from "../../components/connect"
import { useRecoilValueLoadable } from "recoil"
import { queryAddressInfo } from "../../selectors/gitcoin"
import Gitcoin from "../../components/gitcoin"

const StewardDetail = () => {
  const { query } = useRouter()
  const address = query?.address as string

  return (
    <div className="container mx-auto pb-8">
      <Connect />
      <Gitcoin address={address} />
    </div>
  )
}

export default StewardDetail
