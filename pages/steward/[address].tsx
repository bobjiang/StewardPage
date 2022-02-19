import React from "react"
import { useRouter } from "next/router"

import Connect from "../../components/connect"
import Gitcoin from "../../components/gitcoin"

const StewardDetail = () => {
  const { query } = useRouter()
  const address = query?.address as string

  return (
    <>
      {/* TODO: Add SEO */}
      <div className="container mx-auto pb-8">
        <Connect />
        <Gitcoin address={address} />
      </div>
    </>
  )
}

export default StewardDetail
