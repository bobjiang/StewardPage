import React, { useMemo } from "react"
import {
  Box,
  Card,
  Chip,
  Container,
  List,
  Stack,
  Typography,
} from "@mui/material"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import Paper from "@mui/material/Paper"
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline"
import { abbreviateNumber } from "../../lib/utilities"

const RecentVotes = ({ votes }) => {
  const voteItem = useMemo(() => {
    if (!votes || !votes.length) {
      return null
    }

    const voteEls = votes.map(({ proposal, support }) => {
      const [voteFor, against, abstain] = proposal.voteStats

      const votes = abbreviateNumber(
        (+voteFor.weight - +against.weight - +abstain.weight) / 10 ** 18,
      )
      const againstedVotes =
        (+against.weight - +abstain.weight - +voteFor.weight) / 10 ** 18
      const formattedAgainstedVotes = abbreviateNumber(
        againstedVotes < 0 ? 0 : againstedVotes,
      )

      const { description, id, statusChanges } = proposal
      const title = description?.split("\n")?.[0] ?? ""
      const status = statusChanges.slice(-1)[0]?.type ?? "PENDING"
      return (
        <TableRow
          key={id}
          sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
        >
          <TableCell
            component="th"
            scope="row"
            sx={{
              maxWidth: 330,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            <Stack spacing={1}>
              <Typography variant="subtitle2" noWrap>
                {title}
              </Typography>
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                divider={
                  <Box
                    borderRadius="100%"
                    height={4}
                    width={4}
                    sx={{ backgroundColor: "gray" }}
                  />
                }
              >
                <Chip label={status} variant="outlined" size="small" />
                <Typography variant="caption" color="gray">
                  ID: {id}
                </Typography>
              </Stack>
            </Stack>
          </TableCell>
          <TableCell align="center">
            <Typography variant="subtitle2" color="green">
              {votes}
            </Typography>
          </TableCell>
          <TableCell align="center">
            <Typography variant="subtitle2" color="red">
              {formattedAgainstedVotes}
            </Typography>
          </TableCell>
          <TableCell align="right">
            <Chip
              icon={<CheckCircleOutlineIcon fontSize="small" />}
              label={support}
              color="success"
              sx={{ color: "white" }}
            />
          </TableCell>
        </TableRow>
      )
    })

    return <TableBody>{voteEls}</TableBody>
  }, [votes])

  return (
    <Box sx={{ pt: 4, pl: 3, pr: 0, width: "100%" }}>
      <Typography variant="h5">Recent Votes</Typography>
      <Card sx={{ mt: 2 }}>
        <TableContainer
          component={Paper}
          sx={{ backgroundColor: "#fff", width: "100%" }}
        >
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Proposal</TableCell>
                <TableCell align="center">Votes for</TableCell>
                <TableCell align="center">Votes against</TableCell>
                <TableCell align="right">Ballot</TableCell>
              </TableRow>
            </TableHead>

            {voteItem}
          </Table>
        </TableContainer>
      </Card>
    </Box>
  )
}

export default RecentVotes
