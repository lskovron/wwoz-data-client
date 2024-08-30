import { useEffect, useState } from "react";

import { GET_VENUES_IN_RANGE } from "../graphql/queries";
import { useQuery } from "@apollo/client";
import { GridColDef } from "@mui/x-data-grid";
import TablePage, { GridRow } from "./TablePage";
import { FetchVenueDetailsButton } from "../FetchVenueDetailsButton";

const venueColumns: GridColDef<any>[] = [
  {
    field: "name",
    headerName: "Name",
    width: 150,
  },
  {
    field: "address",
    headerName: "Address",
    width: 150,
  },
  {
    field: "count",
    headerName: "Event count",
    width: 110,
  },
  {
    field: "lat",
    width: 110,
  },
  {
    field: "lng",
    width: 110,
  },
  {
    field: "googleId",
    width: 110,
  },
  {
    field: "rating",
    width: 110,
  },
  {
    field: "custom",
    width: 200,
    renderCell: ({ row }) => {
      return (
        <FetchVenueDetailsButton
          slug={row.slug}
          hasDetails={Boolean(row.address)}
        />
      );
    },
  },
];

type Response = {
  eventsByVenue: GridRow[];
};

export const getVenuesVariables = {
  dateRange: {
    start: "2015-01-01",
    end: "2015-12-31",
  },
  limit: 100,
};

const VenuesTable = () => {
  const [venues, setVenues] = useState<GridRow[]>([]);
  const { loading, error, data } = useQuery<Response>(GET_VENUES_IN_RANGE, {
    variables: getVenuesVariables,
  });

  useEffect(() => {
    if (data) {
      setVenues(data.eventsByVenue);
    }
  }, [data]);

  if (loading) return <>Loading...</>;
  if (error) return <>Error! {error.message}</>;

  return (
    <TablePage title="Events per venue" rows={venues} columns={venueColumns} />
  );
};

export default VenuesTable;
