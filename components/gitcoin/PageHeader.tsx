import NextLink from "next/link"
import { Typography, Avatar, Grid, Link } from "@mui/material"
import { useTheme } from "@mui/material/styles"

function GitCoinHeader({ isMySelf, name, avatar, link }) {
  const theme = useTheme()

  return (
    <Grid container alignItems="center">
      <Grid item>
        <Avatar
          sx={{ mr: 2, width: theme.spacing(10), height: theme.spacing(10) }}
          variant="rounded"
          alt={name}
          src={avatar}
        />
      </Grid>
      <Grid item>
        <Typography variant="h4" component="h4" gutterBottom>
          {isMySelf ? `Welcome, ${name}!` : `${name}'s profile`}
        </Typography>
        {isMySelf && (
          <Typography variant="subtitle1">Welcome to your home!</Typography>
        )}

        <NextLink href={link} passHref>
          <Link underline="hover" target="_blank">
            Statement Link
          </Link>
        </NextLink>
      </Grid>
    </Grid>
  )
}

export default GitCoinHeader
