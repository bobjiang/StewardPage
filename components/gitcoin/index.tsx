import BN from "bn.js"
import { useRecoilState, useRecoilValueLoadable } from "recoil"
import { TwitterShareButton, TwitterIcon } from "react-share"
import Image from "next/image"
import NextLink from "next/link"
import {
  Container,
  Card,
  CardContent,
  Box,
  Grid,
  Typography,
  Divider,
  ListItem,
  ListItemText,
  List,
  Link,
  Stack,
  Button,
} from "@mui/material"
import { queryAddressInfo } from "../../selectors/gitcoin"
import { FLEEK_URL } from "../../constants/fleek"
import GitCoinHeader from "./PageHeader"
import { walletState } from "../../atoms/wallet"
import { queryStewardInfo, queryRecentVotes } from "../../selectors/steward"
import Delegate from "../delegate"
import RecentVotes from "./RecentVotes"
import styles from "./gitcoin.module.css"

const Gitcoin = ({ address }) => {
  const [{ address: connectAddress }] = useRecoilState(walletState)
  const isMySelf = connectAddress?.toLowerCase() === address?.toLowerCase()
  const result = useRecoilValueLoadable(queryAddressInfo(address))
  const steward = useRecoilValueLoadable(
    queryStewardInfo(address),
    // queryStewardInfo("0x521aacb43d89e1b8ffd64d9ef76b0a1074dedaf8"),
  )
  const recentVotesRes = useRecoilValueLoadable(
    queryRecentVotes(address),
    // queryStewardInfo("0x521aacb43d89e1b8ffd64d9ef76b0a1074dedaf8"),
  )

  const shareUrl = `${FLEEK_URL}/steward/${address}`
  const title = `Thanks for supporting my @gitcoin Steward, please delegate ${address} `

  if (
    result.state === "loading" ||
    steward.state === "loading" ||
    recentVotesRes.state === "loading"
  ) {
    return (
      <Container maxWidth="lg">
        <Typography>Loading...</Typography>
      </Container>
    )
  }

  if (
    result.state === "hasError" ||
    steward.state === "hasError" ||
    recentVotesRes.state === "hasError"
  ) {
    const error = result.contents ?? steward.contents ?? recentVotesRes.contents
    return (
      <div>
        Error: <Typography color="error.light">{error.message}</Typography>
        <Typography color="error.dark">
          {JSON.stringify(error.stack, null, 2)}
        </Typography>
      </div>
    )
  }

  const { account, delegators } = result?.contents ?? {}
  const { name = address, image, statement_link } = steward?.contents ?? {}
  const { accounts: votesAccount } = recentVotesRes?.contents ?? {}

  if (!account || !statement_link) {
    return (
      <div className="h-screen flex justify-center">
        <div className="container sm:mt-16">
          <Box className="max-w-[77%]">
            <Typography variant="h5" color="error.light">
              {isMySelf
                ? "You have no $GTC or voting power!"
                : "This account don't have any voting power."}
            </Typography>
            <NextLink href="/" passHref>
              <Link underline="hover">
                <Typography variant="h6">Back to home.</Typography>
              </Link>
            </NextLink>
          </Box>
        </div>
      </div>
    )
  }

  const { votes, ballotsCastCount, tokenBalance } = account

  const recentVotes = votesAccount.flatMap(({ participations }) =>
    participations
      .filter(({ votes }) => votes.length > 0)
      .flatMap(({ votes }) => votes),
  )

  return (
    <Container maxWidth="lg">
      <GitCoinHeader
        isMySelf={isMySelf}
        name={name}
        avatar={image}
        link={statement_link}
      />

      {/* Organization */}
      <Grid container spacing={3} mt={2}>
        <Grid xs={12} sm={6} md={3} item>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            sx={{ pb: 3 }}
          >
            <Typography variant="h5">
              {isMySelf ? "My Organization" : `${name}'s Organization`}
            </Typography>
          </Box>
          <Card sx={{ px: 1 }}>
            <CardContent>
              <Box display="inline-flex" alignItems="center" gap={1}>
                <Box height="24px" width="24px" position="relative">
                  <Image src="/gitcoin.png" alt="GitCoin Logo" layout="fill" />
                </Box>

                <Typography variant="h5" noWrap>
                  Gitcoin
                </Typography>
              </Box>
              {/* <Typography variant="subtitle1" noWrap>
                {new BN(tokenBalance)
                  .div(new BN(10).pow(new BN(18)))
                  .toString()}{" "}
                GTC
              </Typography> */}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Infos */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        sx={{ py: 3, gap: 4 }}
      >
        <Typography variant="h5">
          {isMySelf ? "My Info" : `Info about ${name}`}
        </Typography>
      </Box>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
        spacing={3}
      >
        <Grid item xs={12}>
          <Card>
            <Grid spacing={0} container>
              <Grid item xs={12} md={6}>
                <Box p={4}>
                  <Typography sx={{ pb: 3 }} variant="h5">
                    Total tokens:{" "}
                    {new BN(tokenBalance)
                      .div(new BN(10).pow(new BN(18)))
                      .toString()}
                  </Typography>
                  <Typography sx={{ pb: 3 }} variant="h5">
                    Total votes:{" "}
                    {new BN(votes).div(new BN(10).pow(new BN(18))).toString()}
                  </Typography>
                  {/* <Typography sx={{ pb: 3 }} variant="h5">
                    Ballots: {ballotsCastCount}
                  </Typography> */}
                  {/* <Typography sx={{ pb: 3 }} variant="h5">
                    Delegate to:
                  </Typography> */}
                  {/* <Typography sx={{ pb: 3 }} variant="h5">
                    Self Delegation:
                  </Typography> */}
                  <Grid container spacing={3}>
                    <Grid sm item>
                      <Delegate variant="contained" address={address} fullWidth>
                        DELEGATE VOTES
                      </Delegate>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            </Grid>
          </Card>
        </Grid>

        {/* Recent votes */}
        <RecentVotes votes={recentVotes} />

        {/* Delegators */}
        <Grid item xs={12}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            sx={{ pb: 3 }}
          >
            <Typography variant="h5">Delegators</Typography>
          </Box>
          <Card>
            <Grid spacing={0} container>
              <Grid item lg={12} xs={12}>
                <Box p={4}>
                  <Typography sx={{ pb: 3 }} variant="h5">
                    Top Delegators
                  </Typography>
                  <Typography sx={{ pb: 3 }} variant="h5">
                    Ranking by delegated percentage
                  </Typography>
                </Box>
                {delegators.map((item: any, index: any) => {
                  const itemBalance = item.tokenBalance
                  const id = item.id
                  if (itemBalance == "0") return

                  return (
                    <Card key={id ?? index}>
                      <Divider />
                      <List disablePadding>
                        <ListItem sx={{ py: 2 }}>
                          <ListItemText
                            primary={id}
                            primaryTypographyProps={{
                              variant: "h5",
                              fontWeight: "bold",
                              color: "textPrimary",
                              gutterBottom: true,
                              noWrap: true,
                            }}
                            // secondary={<Text color="success">ENS Name</Text>}
                            // secondaryTypographyProps={{
                            //   variant: "body2",
                            //   noWrap: true,
                            // }}
                          />
                          <Typography
                            align="right"
                            variant="subtitle1"
                            color="success.main"
                            noWrap
                          >
                            {(
                              ((itemBalance as any) / (tokenBalance as any)) *
                              100
                            ).toFixed(2) + "%"}
                          </Typography>
                        </ListItem>
                        <Divider />
                      </List>
                    </Card>
                  )
                })}
              </Grid>
            </Grid>
            <Stack
              direction="row"
              justifyContent="center"
              alignItems="center"
              spacing={1}
              padding={2}
            >
              <Typography variant="h5" align="center">
                Get more delegators:{" "}
              </Typography>
              <TwitterShareButton url={shareUrl} title={title}>
                <Button className={styles.twitterButton}>
                  <TwitterIcon size={32} />
                  <Typography>Tweet it</Typography>
                </Button>
              </TwitterShareButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Container>
  )
}

export default Gitcoin
