import { useState, useMemo, useCallback, useEffect } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import {
  Button,
  CircularProgress,
  Dialog,
  Grid,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { VenueMap } from "./VenueMap";
import {
  GET_VENUES_IN_RANGE,
  GET_VENUE_DATA,
  GET_VENUE_DATA_BY_NAME,
  SAVE_VENUE_DATA,
} from "./graphql/queries";
import { getVenuesVariables } from "./pages/VenuesTable";

export const FetchVenueDetailsButton = ({ slug, hasDetails }) => {
  const [results, setResults] = useState([]);
  const [resultIndex, setResultIndex] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [name, setName] = useState("");

  const [getData, { loading: isFetchingData }] = useLazyQuery(GET_VENUE_DATA, {
    variables: {
      slug,
    },
  });
  const [getDataByName, { loading: isFetchingDataByName }] = useLazyQuery(
    GET_VENUE_DATA_BY_NAME,
    {
      variables: {
        name,
        slug,
      },
    }
  );

  const count = useMemo(() => results.length, [results]);
  const currentResult = useMemo(
    () => results[resultIndex],
    [resultIndex, results]
  );

  const venueDetails = useMemo(() => {
    const { address, lat, lng, slug, name, googleId, rating, businessStatus } =
      currentResult || {};
    return { address, lat, lng, slug, name, googleId, rating, businessStatus };
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
        setName(data.venueGeoData[0].name);
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

  const handleRetry = async () => {
    await getDataByName().then(({ data }) => {
      if (data?.venueGeoData?.length) {
        setResults(data.venueGeoData);
      }
    });
  };

  useEffect(() => setResultIndex(0), [results]);

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
        <Grid container padding={2} direction="column">
          <Typography>
            Showing result {resultIndex + 1} of {results.length}:{" "}
            <strong>{slug}</strong>(
            <Link
              href={`https://wwoz.org/organizations/${slug}`}
              target="_blank"
            >
              {" "}
              WWOZ
            </Link>
            )
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
          <hr />
          <Grid container spacing={1}>
            <Grid item>
              <TextField
                fullWidth
                size="small"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                onClick={handleRetry}
                disabled={isFetchingDataByName}
              >
                {isFetchingDataByName && (
                  <CircularProgress
                    size={12}
                    color="inherit"
                    style={{ marginRight: 5 }}
                  />
                )}
                Retry
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Dialog>
    </>
  );
};
