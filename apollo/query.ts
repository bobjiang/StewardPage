import { gql } from "@apollo/client"
import StewardCsv from "../public/steward.csv"
import { getApollo } from "./client"

export const QueryAddressInfoGql = gql`
  query ($voterAddress: String!) {
    histories {
      totalSupply
    }
    account(id: $voterAddress) {
      id
      votes
      tokenBalance
      ballotsCastCount
      proposalsProposedCount
      percentageOfTotalVotingPower
      frequencyOfParticipationTotal
      delegationsCurrentlyReceivedCount
      frequencyOfParticipationAsActiveVoter
    }
    delegators: accounts(
      orderBy: tokenBalance
      orderDirection: desc
      where: { delegatingTo: $voterAddress }
    ) {
      id
      votes
      tokenBalance
      ballotsCastCount
      proposalsProposedCount
      percentageOfTotalVotingPower
      frequencyOfParticipationTotal
      delegationsCurrentlyReceivedCount
      frequencyOfParticipationAsActiveVoter
    }
  }
`

export async function QueryAddressInfo(client = getApollo(), variables: any) {
  const { data } = await client.query({
    query: QueryAddressInfoGql,
    variables,
  })

  return data
}

type Steward = {
  address: string
  name: string
  statement_link: string
  image: string
}

const stewardCSVCache = StewardCsv.map((x: Steward) => ({
  ...x,
  row: x[""],
  statement_link: `https://gov.gitcoin.co/t/introducing-stewards-governance/41/${x["statement_link"]}`,
  image: `https://raw.githubusercontent.com/mmmgtc/stewards-v1.0/main/app/assets/images/stewards/${x["image"]}`,
}))
const getSteward = (address: string, stewards: Steward[]) => {
  const steward = stewards.find(
    (x) => x.address?.toLowerCase() === address.toLowerCase(),
  )
  return steward
}
export async function QueryStewardInfo(address: string) {
  return getSteward(address, stewardCSVCache as Steward[])
}
