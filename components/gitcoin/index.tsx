import BN from "bn.js";
import { useRecoilValueLoadable } from "recoil";
import { TwitterShareButton, TwitterIcon } from "react-share";
import { queryAddressInfo } from "../../selectors/gitcoin";
import { FLEEK_URL } from "../../constants/fleek";
import {
  Button,
  Container,
  Card,
  CardContent,
  Box,
  Grid,
  Typography,
  Avatar,
  Tooltip,
  Divider,
  ListItem,
  ListItemText,
  List,
  ListItemAvatar,
  CardActionArea
} from '@mui/material';
import { styled } from '@mui/material/styles';
import TrendingUp from '@mui/icons-material/TrendingUp';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import Text from './Text';
import PageHeader from './PageHeader';
import Delegate from "../../components/delegate";
const AvatarWrapper = styled(Avatar)(
  ({ theme }) => `
        background: transparent;
        margin-left: -${theme.spacing(0.5)};
        margin-bottom: ${theme.spacing(1)};
        margin-top: ${theme.spacing(2)};
`
);

const AvatarAddWrapper = styled(Avatar)(
  ({ theme }) => `
        background: ${theme.palette.black};
        color: ${theme.palette.primary.main};
        width: ${theme.spacing(8)};
        height: ${theme.spacing(8)};
`
);
const Gitcoin = ({ address }) => {
  const result = useRecoilValueLoadable(
    queryAddressInfo(address && address.toLowerCase())
  );
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
  `
  );
  const shareUrl = `${FLEEK_URL}?address=${address}`;
  const title = `Thanks for supporting my @gitcoin Steward, please delegate ${address} `;
  const cryptoBalance = {
    datasets: [
      {
        data: [20, 10, 40, 30],
        backgroundColor: ['#ff9900', '#1c81c2', '#333', '#5c6ac0']
      }
    ],
    labels: ['Bitcoin', 'Ripple', 'Cardano', 'Ethereum']
  };

  switch (result.state) {
    case "hasValue":
      const { account, delegators } = result ?.contents;
      // setWallet({ account, delegators });
      if (!account)
        return (
          <div className="flex items-stretch h-screen">
            <div className="self-center flex-1 text-center">
              <p className="text-5xl text-center text-red-500">
                You have no $GTC or voting power! <br />
              </p>
            </div>
          </div>
        );
      const { votes, ballotsCastCount, tokenBalance } = account;

      new BN(votes).div(new BN(10).pow(new BN(18))).toString();
      return (
        <Container maxWidth="lg">
        <Card sx={{ px: 1 }}>
          <PageHeader />
        </Card>
          <Grid container spacing={3}>
            <Grid xs={12} sm={6} md={3} item>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              sx={{ pb: 3 }}
            >
              <Typography variant="h5">My Organization</Typography>
            </Box>
              <Card sx={{ px: 1 }}>
                <CardContent>
                  <Typography variant="h5" noWrap>
                    Gitcoin
                </Typography>
                  <Typography variant="subtitle1" noWrap>
                    GTC
                </Typography>
                  <Box sx={{ pt: 3 }}>
                    <Typography variant="h5" gutterBottom noWrap>
                      {new BN(tokenBalance)
                        .div(new BN(10).pow(new BN(18)))
                        .toString()}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          sx={{ pb: 3 }}
          >
            <Typography variant="h5">My Info</Typography>
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
                        Total tokens: {new BN(tokenBalance).div(new BN(10).pow(new BN(18))).toString()}
                      </Typography>
                      <Typography sx={{ pb: 3 }} variant="h5">
                        Total votes: {new BN(votes).div(new BN(10).pow(new BN(18))).toString()}
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
                          <Delegate />
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
                        const itemBalance = item.tokenBalance;
                        const id = item.id;
                        if (itemBalance == "0") return;

                        return (
                          <Card>
                            <Divider />
                            <List disablePadding>
                              <ListItem sx={{ py: 2 }}>
                                <ListItemText
                                primary={id}
                                  primaryTypographyProps={{
                                    variant: 'body1',
                                    fontWeight: 'bold',
                                    color: 'textPrimary',
                                    gutterBottom: true,
                                    noWrap: true
                                  }}
                                  secondary={<Text color="success">ENS Name</Text>}
                                  secondaryTypographyProps={{ variant: 'body2', noWrap: true }}
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
                        );
                      })}
                  </Grid>
                </Grid>
                <Box>
                <Typography sx={{ pb: 3 }} variant="h5" align="center">
                  Get more delegators: <TwitterShareButton
                    url={shareUrl}
                    title={title}
                    className="Demo__some-network__share-button"
                  >
                    <TwitterIcon size={32} round />
                  </TwitterShareButton>
                </Typography>
              </Box>
              </Card>
            </Grid>

          </Grid>
        </Container>
      );
    case "loading":
      return <div>Loading...</div>;
    case "hasError":
      throw result.contents;
  }
};

export default Gitcoin;
