import React from "react"
import { useRouter } from "next/router"
import NextLink from "next/link"
import {
  Card,
  Link,
  Typography,
} from "@mui/material"

import Connect from "../../components/connect"
import { useRecoilValueLoadable } from "recoil"
import { queryAddressInfo } from "../../selectors/gitcoin"
import Gitcoin from "../../components/gitcoin"

const StewardDetail = () => {
  const { query } = useRouter()
  const address = query?.address as string | undefined
  const result = useRecoilValueLoadable(
    queryAddressInfo(address?.toLowerCase()),
  )

  if (result.state === "loading") {
    return <div>Loading...</div>
  }

  if (result.state === "hasError") {
    return result.contents
  }

  const { account } = result?.contents

  if (!account) {
    return (
      <div className="h-screen flex justify-center">
        <div className="container sm:mt-16">
          <Card className="py-4 px-6 max-w-[77%]">
            <Typography variant="h5" color="error.light">
              This account don{"'"}t have any voting power.
            </Typography>
            <NextLink href="/" passHref>
              <Link underline="hover">
                <Typography variant="h6">Back to home.</Typography>
              </Link>
            </NextLink>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto pb-8">
      <Connect />
      <Gitcoin address={address} />
    </div>
  )
}

export default StewardDetail
