import { gql } from "@apollo/client"
import Papa from "papaparse"
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

// Restful API
const request = async (url: RequestInfo, init?: RequestInit): Promise<any> => {
  const json = await fetch(url, {
    ...init,
    headers: {
      "content-type": "application/json",
      Accept: "application/vnd.github.v3+json",
      ...init?.headers,
    },
  }).then((res) => res.json())
  if (!json) {
    throw new Error(`Failed to fetch request of ${url}`)
  }
  return json
}

const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN

let stewardCSVCache
export async function QueryStewardInfo(address: string) {
  if (stewardCSVCache) {
    const steward = stewardCSVCache.find(
      (x) => x.address?.toLowerCase() === address.toLowerCase(),
    )
    return steward
  }
  const data = await request(
    "https://api.github.com/repos/mmmgtc/stewards-v1.0/contents/app/assets/csv/stewards.csv",
    // Use token to prevent github rate limit
    {
      headers: token
        ? {
            Authorization: `token ${token}`,
          }
        : {},
    },
  )
  // CSV Headers
  // "name", "image", "username", "handle_gitcoin", "statement_post_id", "steward_since",
  // "address", "w_value", "Tally_participation_rate", "f_value ", "forum_post_count ", "workstream_name ",
  // "votingweight ", "voteparticipation ", "weeks_steward ", "F_value", "snapshot_votes", "V_value", "Health_Scor"

  // Decode base64
  const content = Buffer.from(data.content, "base64").toString()
  const parsed = Papa.parse(content, {
    header: true,
    transformHeader(header) {
      // Change empty "" header to row
      if (!header) {
        return "row"
      }
      // Change post id to link
      if (header === "statement_post_id") {
        return "statement_link"
      }
      return header
    },
    transform(value, header) {
      // Transform post_id to statement link
      if (header === "statement_link") {
        return `https://gov.gitcoin.co/t/introducing-stewards-governance/41/${value}`
      }
      // Transform image to content link
      if (header === "image") {
        return `https://raw.githubusercontent.com/mmmgtc/stewards-v1.0/main/app/assets/images/stewards/${value}`
      }
      return value
    },
  })
  stewardCSVCache = parsed.data
  const steward = stewardCSVCache.find(
    (x) => x.address.toLowerCase() === address.toLowerCase(),
  )
  return steward
}
