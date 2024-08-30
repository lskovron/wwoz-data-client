import { useLazyQuery, useQuery } from "@apollo/client";
import React, { useMemo, useEffect, useState, useCallback } from "react";
import { GET_FULL_HISTORY, GET_HISTORY } from "../graphql/queries";
import { Button, Container, TextField } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { v4 as uuidv4 } from "uuid";

const Dates = () => {
  const [startValue, setStartValue] = useState("2015-01-01");
  const [endValue, setEndValue] = useState("2015-01-31");
  const [currentRange, setCurrentRange] = useState({});
  const [getHistory, { loading, error, data }] = useLazyQuery(GET_HISTORY, {
    variables: {
      dateRange: {
        start: startValue,
        end: endValue,
      },
    },
  });

  const handleStartChange = (e: any) => {
    setStartValue(e.target.value);
  };
  const handleEndChange = (e: any) => {
    setEndValue(e.target.value);
  };

  const handleFetchDates = () => {
    setCurrentRange({
      start: startValue,
      end: endValue,
    });
    getHistory();
  };

  if (error) return <>Error</>;
  return (
    <Container>
      <TextField type="date" value={startValue} onChange={handleStartChange} />
      <TextField type="date" value={endValue} onChange={handleEndChange} />
      <Button onClick={handleFetchDates}>Get dates</Button>
      {data && <DateTable data={data.history} range={currentRange} />}
    </Container>
  );
};

const getRenderCell =
  (day: string) =>
  ({ row }: any) => {
    const isUnscraped = row.unscraped.includes(day);
    const isError = row.errors.includes(day);

    return (
      <span
        style={{
          fontWeight: isUnscraped ? 700 : 400,
          color: isError ? "red" : isUnscraped ? "black" : "#e2e2e2",
        }}
      >
        {row[day]}
      </span>
    );
  };

const dateColumns: GridColDef<any>[] = [
  {
    field: "monday",
    renderCell: getRenderCell("monday"),
  },
  {
    field: "tuesday",
    renderCell: getRenderCell("tuesday"),
  },
  {
    field: "wednesday",
    renderCell: getRenderCell("wednesday"),
  },
  {
    field: "thursday",
    renderCell: getRenderCell("thursday"),
  },
  {
    field: "friday",
    renderCell: getRenderCell("friday"),
  },
  {
    field: "saturday",
    renderCell: getRenderCell("saturday"),
  },
  {
    field: "sunday",
    renderCell: getRenderCell("sunday"),
  },
  // {
  //   field: "custom",
  //   width: 200,
  //   renderCell: ({ row }: any) => {
  //     const isUnscraped = row.unscraped.includes("monday");
  //     const isError = row.errors.includes("monday");

  //     return (
  //       <span
  //         style={{
  //           fontWeight: isUnscraped ? 700 : 400,
  //           color: isError ? "red" : "black",
  //         }}
  //       >
  //         {row.monday}
  //       </span>
  //     );
  //   },
  // },
];

const DateTable = ({ data, range }: any) => {
  const getWeeks = useCallback(
    (startDate: string, endDate: string) => {
      // Ensure dates are in Date object format
      const start = new Date(startDate);
      const end = new Date(endDate);

      // Array to hold weeks
      const weeks = [];

      // Function to format date as yyyy-mm-dd
      function formatDate(date: Date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      }

      // Function to get the day of the week as a string
      function getDayOfWeek(date: Date) {
        const daysOfWeek = [
          "sunday",
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
        ];
        return daysOfWeek[date.getDay()];
      }

      // Iterate from start date to end date
      let currentDate = new Date(start);
      let currentWeek: any = {
        _id: uuidv4(),
        unscraped: [],
        errors: [],
      };

      while (currentDate <= end) {
        const dayOfWeek = getDayOfWeek(currentDate);
        const day = formatDate(currentDate);
        currentWeek[dayOfWeek] = day;

        const inHistory = data.find((item: any) => item.dateString === day);
        if (!inHistory) {
          currentWeek.unscraped.push(dayOfWeek);
        } else if (inHistory.hasError) {
          currentWeek.errors.push(dayOfWeek);
        }

        // If the current day is Sunday (last day of the week) or the current day is the end date
        if (
          currentDate.getDay() === 0 ||
          currentDate.getTime() === end.getTime()
        ) {
          weeks.push(currentWeek);
          currentWeek = { _id: uuidv4(), unscraped: [], errors: [] };
        }

        // Move to the next day
        currentDate.setDate(currentDate.getDate() + 1);
      }

      // If there are leftover days that didn't form a full week, add them as well
      if (Object.keys(currentWeek).length > 0) {
        weeks.push(currentWeek);
      }

      return weeks;
    },
    [data]
  );

  const rows = useMemo(
    () => getWeeks(range.start, range.end),
    [getWeeks, range.end, range.start]
  );

  return (
    <DataGrid
      getRowId={(row) => row._id}
      density="compact"
      columns={dateColumns}
      rows={rows}
    />
  );
};

export default Dates;
