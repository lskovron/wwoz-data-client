import { useEffect, useState } from "react";

import { GET_EVENTS_IN_RANGE } from "../graphql/queries";
import { useQuery } from "@apollo/client";
import { GridColDef } from "@mui/x-data-grid";
import TablePage, { GridRow } from "./TablePage";

const eventColumns: GridColDef<any>[] = [
  {
    field: "title",
    headerName: "Title",
    width: 150,
  },
  {
    field: "date",
    headerName: "Date",
    width: 150,
  },
  {
    field: "time",
    headerName: "Time",
    width: 110,
  },
  {
    field: "venueName",
    headerName: "Venue Name",
    width: 160,
    valueGetter: (value, row) => row.venue.name,
  },
];

type Response = {
  eventsInRange: GridRow[];
};

const EventsTable = () => {
  const [events, setEvents] = useState<GridRow[]>([]);
  const { loading, error, data } = useQuery<Response>(GET_EVENTS_IN_RANGE, {
    variables: {
      dateRange: {
        start: "2022-01-01",
        end: "2022-01-08",
      },
      limit: 150,
    },
  });

  useEffect(() => {
    if (data) {
      setEvents(data.eventsInRange);
    }
  }, [data]);

  if (loading) return <>Loading...</>;
  if (error) return <>Error! {error.message}</>;

  return (
    <TablePage
      title="Get events in date range"
      rows={events}
      columns={eventColumns}
    />
  );
};

export default EventsTable;
