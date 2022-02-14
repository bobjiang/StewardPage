import BN from "bn.js"
import { useRecoilState, useRecoilValueLoadable } from "recoil"
import { TwitterShareButton, TwitterIcon } from "react-share"
import { queryAddressInfo } from "../../selectors/gitcoin"
import { FLEEK_URL } from "../../constants/fleek"
import NextLink from "next/link"
import {
  Button,
  Container,
  Card,
  CardContent,
  Box,
  Grid,
  Typography,
  Avatar,
  Divider,
  ListItem,
  ListItemText,
  List,
  Link,
  Stack,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import Text from "./Text"
import GitCoinHeader from "./PageHeader"
import { walletState } from "../../atoms/wallet"
import { queryStewardInfo } from "../../selectors/steward"

const AvatarWrapper = styled(Avatar)(
  ({ theme }) => `
        background: transparent;
        margin-left: -${theme.spacing(0.5)};
        margin-bottom: ${theme.spacing(1)};
        margin-top: ${theme.spacing(2)};
`,
)

const AvatarAddWrapper = styled(Avatar)(
  ({ theme }) => `
        background: ${theme.palette.black};
        color: ${theme.palette.primary.main};
        width: ${theme.spacing(8)};
        height: ${theme.spacing(8)};
`,
)

const CardAddAction = styled(Card)(
  ({ theme }) => `
        border: ${theme.palette.primary.main} dashed 1px;
        height: 100%;
        color: ${theme.palette.primary.main};

        .MuiCardActionArea-root {
          height: 100%;
          justify-content: center;
          align-items: center;
          display: flex;
        }

        .MuiTouchRipple-root {
          opacity: .2;
        }

        &:hover {
          border-color: ${theme.palette.black};
        }
`,
)

const Gitcoin = ({ address }) => {
  const [{ address: connectAddress }] = useRecoilState(walletState)
  const isMySelf = connectAddress?.toLowerCase() === address?.toLowerCase()
  const result = useRecoilValueLoadable(
    queryAddressInfo(address && address.toLowerCase()),
  )
  const steward = useRecoilValueLoadable(
    queryStewardInfo(address?.toLowerCase()),
    // queryStewardInfo("0x521aacb43d89e1b8ffd64d9ef76b0a1074dedaf8"),
  )

  const shareUrl = `${FLEEK_URL}/steward/${address}`
  const title = `Thanks for supporting my @gitcoin Steward, please delegate ${address} `

  if (result.state === "loading" || steward.state === "loading") {
    return <div>Loading...</div>
  }

  if (result.state === "hasError" || steward.state === "hasError") {
    const error =
      result.state === "hasError" ? result.contents : steward.contents
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

  return (
    <Container maxWidth="lg">
      <GitCoinHeader isMySelf={isMySelf} name={name} avatar={image} />
      <Grid container spacing={3}>
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
              <Typography variant="h5" noWrap>
                Gitcoin
              </Typography>
              <Typography variant="subtitle1" noWrap>
                {new BN(tokenBalance)
                  .div(new BN(10).pow(new BN(18)))
                  .toString()}{" "}
                GTC
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        sx={{ py: 3, gap: 4 }}
      >
        <Typography variant="h5">
          {isMySelf ? "My Info" : `Info of ${name}`}
        </Typography>
        <NextLink href={statement_link} passHref>
          <Link
            underline="hover"
            target="_blank"
            sx={{ display: "inline-flex", alignItems: "flex-end", gap: "3px" }}
          >
            Statement Link
          </Link>
        </NextLink>
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
                  <Typography sx={{ pb: 3 }} variant="h5">
                    Ballots: {ballotsCastCount}
                  </Typography>
                  <Typography sx={{ pb: 3 }} variant="h5">
                    Delegate to:
                  </Typography>
                  <Typography sx={{ pb: 3 }} variant="h5">
                    Self Delegation:
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid sm item>
                      {/* TODO: Delegate directly to steward */}
                      <Button fullWidth variant="contained">
                        DELEGATE VOTES
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            </Grid>
          </Card>
        </Grid>

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
                              variant: "body1",
                              fontWeight: "bold",
                              color: "textPrimary",
                              gutterBottom: true,
                              noWrap: true,
                            }}
                            secondary={<Text color="success">ENS Name</Text>}
                            secondaryTypographyProps={{
                              variant: "body2",
                              noWrap: true,
                            }}
                          />
                          <Box>
                            <Typography align="right" variant="h5" noWrap>
                              {(
                                ((itemBalance as any) / (tokenBalance as any)) *
                                100
                              ).toFixed(2) + "%"}
                            </Typography>
                            <Text color="success"></Text>
                          </Box>
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
              <TwitterShareButton
                url={shareUrl}
                title={title}
                className="Demo__some-network__share-button"
              >
                <TwitterIcon size={32} round />
              </TwitterShareButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Container>
  )
}

export default Gitcoin
