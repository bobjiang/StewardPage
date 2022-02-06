import { Typography, Avatar, Grid } from "@mui/material"
import { useTheme } from "@mui/material/styles"

function GitCoinHeader({ isMySelf }) {
  const user = {
    name: "Bob Jiang",
    avatar: "bobjiang.png",
  }
  const theme = useTheme()

  return (
    <Grid container alignItems="center">
      <Grid item>
        <Avatar
          sx={{ mr: 2, width: theme.spacing(10), height: theme.spacing(10) }}
          variant="rounded"
          alt={user.name}
          src={user.avatar}
        />
      </Grid>
      <Grid item>
        <Typography variant="h4" component="h4" gutterBottom>
          {isMySelf ? `Welcome, ${user.name}!` : `${user.name}'s profile`}
        </Typography>
        {isMySelf && (
          <Typography variant="subtitle1">Welcome to your home!</Typography>
        )}
      </Grid>
    </Grid>
  )
}

export default GitCoinHeader
