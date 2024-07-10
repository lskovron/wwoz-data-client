import { useState, useMemo, useCallback } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import {
  Button,
  CircularProgress,
  Dialog,
  Grid,
  Typography,
} from "@mui/material";
import { VenueMap } from "./VenueMap";
import {
  GET_VENUES_IN_RANGE,
  GET_VENUE_DATA,
  SAVE_VENUE_DATA,
} from "./graphql/queries";
import { getVenuesVariables } from "./pages/VenuesTable";

export const FetchVenueDetailsButton = ({ slug, hasDetails }) => {
  const [results, setResults] = useState([]);
  const [resultIndex, setResultIndex] = useState(0);
  const [openModal, setOpenModal] = useState(false);

  const [getData, { loading: isFetchingData }] = useLazyQuery(GET_VENUE_DATA, {
    variables: {
      slug: slug,
    },
  });

  const count = useMemo(() => results.length, [results]);
  const currentResult = useMemo(
    () => results[resultIndex],
    [resultIndex, results]
  );

  const venueDetails = useMemo(() => {
    const { address, lat, lng, slug, name, googleId, rating } =
      currentResult || {};
    return { address, lat, lng, slug, name, googleId, rating };
  }, [currentResult]);

  const [saveNewVenue, { loading: isSavingVenue }] = useMutation(
    SAVE_VENUE_DATA,
    {
      variables: { venue: venueDetails },
      refetchQueries: [
        {
          query: GET_VENUES_IN_RANGE,
          variables: getVenuesVariables,
        },
      ],
      awaitRefetchQueries: true,
    }
  );

  const handleFetch = async () => {
    await getData().then(({ data }) => {
      if (data?.venueGeoData?.length) {
        setResults(data.venueGeoData);
        setOpenModal(true);
      }
    });
  };

  const handleSave = () => {
    saveNewVenue(); // don't use async
    setOpenModal(false);
  };

  const decrementIndex = useCallback(() => {
    setResultIndex((prev) => {
      if (prev === 0) return count - 1;
      return prev - 1;
    });
  }, [count]);

  const incrementIndex = useCallback(() => {
    setResultIndex((prev) => {
      if (prev + 1 >= count) return 0;
      return prev + 1;
    });
  }, [count]);

  const buttonProps = useMemo(() => {
    if (isFetchingData)
      return {
        disabled: true,
        variant: "contained",
        label: "Finding venue...",
        showSpinner: true,
      };
    if (isSavingVenue)
      return {
        disabled: true,
        variant: "contained",
        label: "Saving details",
        showSpinner: true,
      };
    if (hasDetails)
      return {
        disabled: false,
        variant: "outlined",
        label: "Refetch details",
        showSpinner: false,
      };
    return {
      disabled: false,
      variant: "contained",
      label: "Get details",
      showSpinner: false,
    };
  }, [hasDetails, isSavingVenue, isFetchingData]);

  return (
    <>
      <Button
        variant={buttonProps.variant}
        onClick={handleFetch}
        disabled={buttonProps.disabled}
      >
        {buttonProps.showSpinner && (
          <CircularProgress
            size={12}
            color="inherit"
            style={{ marginRight: 5 }}
          />
        )}
        {buttonProps.label}
      </Button>
      <Dialog open={openModal}>
        <Grid container padding={2}>
          <Typography>
            Showing result {resultIndex + 1} of {results.length}
          </Typography>
          {count > 1 && (
            <Grid container>
              <Button variant="text" onClick={decrementIndex}>
                Previous
              </Button>
              <Button variant="text" onClick={incrementIndex}>
                Next
              </Button>
            </Grid>
          )}
          <VenueMap coords={[currentResult?.lat, currentResult?.lng]} />
          <pre>{JSON.stringify(currentResult, null, 2)}</pre>
          <Grid container spacing={1}>
            <Grid item>
              <Button variant="contained" onClick={handleSave}>
                Save to venue
              </Button>
            </Grid>
            <Grid item>
              <Button variant="outlined" onClick={() => setOpenModal(false)}>
                Cancel
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Dialog>
    </>
  );
};
