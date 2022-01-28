import * as React from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { mainListItems, secondaryListItems } from './listItems';
import Chart from './Chart';
import Deposits from './Deposits';
import Orders from './Orders';
import BN from "bn.js";
import { useRecoilValueLoadable } from "recoil";
import { TwitterShareButton, TwitterIcon } from "react-share";
import { queryAddressInfo } from "../../selectors/gitcoin";
import { FLEEK_URL } from "../../constants/fleek";
import Delegate from "../../components/delegate";
import Title from './Title';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Connect from "../../components/connect";

function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      <Link color="inherit" href={FLEEK_URL}>
        StewardPage
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const drawerWidth: number = 180;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

const mdTheme = createTheme();

const Dashboard = ({ address }) => {
  const result = useRecoilValueLoadable(
    queryAddressInfo(address && address.toLowerCase())
  );
  const shareUrl = `${FLEEK_URL}?address=${address}`;
  const title = `Thanks for supporting my @gitcoin Steward, please delegate ${address} `;
  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
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
          <ThemeProvider theme={mdTheme}>
            <Box sx={{ display: 'flex' }}>
              <CssBaseline />
              <Drawer variant="permanent" open={open}>
                <Toolbar
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    px: [1],
                  }}
                >
                <IconButton
                  edge="start"
                  color="inherit"
                  aria-label="open drawer"
                  onClick={toggleDrawer}
                  sx={{
                    marginRight: '16px',
                    ...(open && { display: 'none' }),
                  }}
                >
                  <MenuIcon />
                </IconButton>
                  <IconButton onClick={toggleDrawer}
                  sx={{
                    ...(!open && { display: 'none' }),
                  }}>
                    <ChevronLeftIcon />
                  </IconButton>
                </Toolbar>
                <Divider />
                <List>{mainListItems}</List>
              </Drawer>
              <Box
                component="main"
                sx={{
                  backgroundColor: (theme) =>
                    theme.palette.mode === 'light'
                      ? theme.palette.grey[100]
                      : theme.palette.grey[900],
                  flexGrow: 1,
                  height: '100vh',
                  overflow: 'auto',
                }}
              >
              <Connect />
              <Divider />
                <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                  <Grid container spacing={3}>
                  {/* My Organization */}
                  <Grid item xs={12} md={4} lg={3}>
                    <Paper
                      sx={{
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        height: 240,
                      }}
                    >
                    <React.Fragment>
                    <Title>My Organization</Title>
                    <Typography component="p" variant="h5">
                      Gitcoin
                    </Typography>
                    <Typography color="text.secondary" sx={{ flex: 1 }}>
                    Total tokens: {new BN(tokenBalance).div(new BN(10).pow(new BN(18))).toString()}
                    </Typography>
                    <Typography color="text.secondary" sx={{ flex: 1 }}>
                    Total votes: {new BN(votes).div(new BN(10).pow(new BN(18))).toString()}
                    </Typography>
                    <Typography color="text.secondary" sx={{ flex: 1 }}>
                    Ballots: {ballotsCastCount}
                    </Typography>
                    <div>
                        <Delegate />
                    </div>
                    </React.Fragment>
                                  </Paper>
                  </Grid>
                    {/* Voting History */}
                    <Grid item xs={12} md={8} lg={9}>
                      <Paper
                        sx={{
                          p: 2,
                          display: 'flex',
                          flexDirection: 'column',
                          height: 240,
                        }}
                      >
                        <Chart />
                      </Paper>
                    </Grid>
                    {/* Delegators */}
                    <Grid item xs={12}>
                      <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                      <React.Fragment>
                        <Title>Delegators</Title>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Address</TableCell>
                              <TableCell>Votes</TableCell>
                              <TableCell>Proposals</TableCell>
                              <TableCell>Delegate Amount</TableCell>
                              <TableCell align="right">%</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {delegators.map((item) => {
                              const itemBalance = item.tokenBalance;
                              const id = item.id;
                              if (itemBalance == "0") return;

                              return (
                              <TableRow key={item.id}>
                                <TableCell>{item.id}</TableCell>
                                <TableCell>{item.votes/(10**18)}</TableCell>
                                <TableCell>{item.proposalsProposedCount}</TableCell>
                                <TableCell>{item.tokenBalance/(10**18)}</TableCell>
                                <TableCell align="right">{(
                                  ((itemBalance as any) / (tokenBalance as any)) *
                                  100
                                ).toFixed(8) + "%"}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                          </TableBody>
                        </Table>
                        <Typography sx={{ pb: 3 }} variant="h7" align="center">
                          Get more delegators by Twitter: <TwitterShareButton
                            url={shareUrl}
                            title={title}
                            className="Demo__some-network__share-button"
                          >
                            <TwitterIcon size={26} round />
                          </TwitterShareButton>
                        </Typography>
                      </React.Fragment>
                      </Paper>
                    </Grid>
                  </Grid>
                  <Copyright sx={{ pt: 4 }} />
                </Container>
              </Box>
            </Box>
          </ThemeProvider>
      );

    case "loading":
      return <div>Loading...</div>;
    case "hasError":
      throw result.contents;
  }
};

export default Dashboard;
