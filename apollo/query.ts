import { gql } from "@apollo/client";
import { getApollo } from "./client";

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
`;

export async function QueryAddressInfo(client = getApollo(), variables: any) {
  const { data } = await client.query({
    query: QueryAddressInfoGql,
    variables,
  });

  return data;
}
