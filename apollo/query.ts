import { gql } from "@apollo/client"
import StewardCsv from "../public/steward.csv"
import { getApollo, getWithTallyClient } from "./client"

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

// {"query":"\n    query AddressTopDelegators($accountIds: [AccountID!]) {\n  accounts(ids: $accountIds) {\n    address\n    participations {\n      governance {\n        id\n        stats {\n          tokens {\n            supply\n          }\n        }\n      }\n      weightChanges {\n        newBalance\n        block {\n          timestamp\n        }\n      }\n      delegationsIn {\n        weight\n        delegator {\n          address\n        }\n      }\n    }\n  }\n}\n    ","variables":{"accountIds":["eip155:1:0x521aacb43d89e1b8ffd64d9ef76b0a1074dedaf8"]}}
// export const QueryDelegationsGql = gql`
//   query ProfileDelegations(
//     $accountIds: [AccountID!]
//     $sort: DelegationWeightChangeSort
//   ) {
//     accounts(ids: $accountIds) {
//       participations {
//         governance {
//           id
//           chainId
//           organization {
//             name
//             visual {
//               icon
//               color
//             }
//           }
//         }
//         stats {
//           delegations {
//             total
//           }
//         }
//         delegationsIn {
//           weight
//         }
//         weightChanges(sort: $sort) {
//           hash
//           newBalance
//           prevBalance
//           block {
//             timestamp
//           }
//           delegate {
//             address
//           }
//         }
//       }
//     }
//   }
// `

// export async function QueryDelegationsInfo(
//   variables?: any,
//   client = getWithTallyClient(),
// ) {
//   const { data } = await client.query({
//     query: QueryDelegationsGql,
//     variables: {
//       sort: { field: "BLOCK", order: "DESC" },
//       ...variables,
//     },
//   })

//   return data
// }

// QueryDelegationsInfo({
//   accountIds: [
//     // "eip155:69:0x34aa3f359a9d614239015126635ce7732c18fdf3",
//     // "eip155:4:0x34aa3f359a9d614239015126635ce7732c18fdf3",
//     // "eip155:43114:0x34aa3f359a9d614239015126635ce7732c18fdf3",
//     // "eip155:80001:0x34aa3f359a9d614239015126635ce7732c18fdf3",
//     // "eip155:42:0x34aa3f359a9d614239015126635ce7732c18fdf3",
//     // "eip155:10:0x34aa3f359a9d614239015126635ce7732c18fdf3",
//     "eip155:1:0x34aa3f359a9d614239015126635ce7732c18fdf3",
//     // "eip155:137:0x34aa3f359a9d614239015126635ce7732c18fdf3",
//   ],
// }).then(console.log)

// export const QueryProposalsGql = gql`
//   query ProfileCreatedProposals(
//     $accountIds: [AccountID!]
//     $pagination: Pagination
//     $sort: ProposalSort
//   ) {
//     accounts(ids: $accountIds) {
//       participations {
//         governance {
//           id
//           quorum
//           organization {
//             visual {
//               icon
//             }
//           }
//         }
//         proposals(pagination: $pagination, sort: $sort) {
//           id
//           description
//           statusChanges {
//             type
//           }
//           voteStats {
//             votes
//             weight
//             support
//             percent
//           }
//         }
//       }
//     }
//   }
// `

// type RecentVote = {

// }

export const QueryRecentVotesGql = gql`
  query AddressRecentVotes($accountIds: [AccountID!], $pagination: Pagination) {
    accounts(ids: $accountIds) {
      participations {
        votes(pagination: $pagination) {
          support
          proposal {
            id
            description
            statusChanges {
              type
            }
            voteStats {
              votes
              weight
              support
              percent
            }
          }
        }
      }
    }
  }
`

export async function QueryRecentVotes(
  variables?: any,
  client = getWithTallyClient(),
) {
  const { data } = await client.query({
    query: QueryRecentVotesGql,
    variables: {
      pagination: {
        limit: 12,
        offset: 0,
      },
      ...variables,
    },
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
