import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import Title from './Title';

// Generate Sales Data
function createData(time, amount) {
  return { time, amount };
}

const data = [
  {
    projectedProfit: 150000,
    AnswerRef: "one",
    Text: "Year 1",
    Score: 0,
    RespondentPercentage: 12,
    Rank: 1,
    color: "#96d3e3"
  },
  {
    projectedProfit: 250000,
    AnswerRef: "two",
    Text: "Year 2",
    Score: 0,
    RespondentPercentage: 32,
    Rank: 2,
    color: "#6bafc2"
  },
  {
    projectedProfit: 500000,
    AnswerRef: "three",
    Text: "Year 3",
    Score: 1,
    RespondentPercentage: 41,
    Rank: 3,
    color: "#017fb1"
  },
  {
    projectedProfit: 750000,
    AnswerRef: "four",
    Text: "Year 4",
    Score: 0,
    RespondentPercentage: 16,
    Rank: 4,
    color: "#01678e"
  },
  {
    projectedProfit: 1000000,
    AnswerRef: "five",
    Text: "Year 5",
    Score: 0,
    RespondentPercentage: 23,
    Rank: 2,
    color: "#015677"
  }
];
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function Chart() {
  const theme = useTheme();

  return (
    <React.Fragment>
      <Title>Voting History</Title>
      <ResponsiveContainer>
      <BarChart
        width={900}
        height={400}
        data={data}
        margin={{ top: 25, right: 0, left: 0, bottom: 25 }}
      >
        <XAxis dataKey="Text" fontFamily="sans-serif" tickSize dy="25" />
        <YAxis hide />
        <Bar
          dataKey="projectedProfit"
          barSize={170}
          fontFamily="sans-serif"
          label="Votes"
        >
          {data.map((entry, index) => (
            <Cell fill={data[index].color} />
          ))}
        </Bar>
      </BarChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
}
