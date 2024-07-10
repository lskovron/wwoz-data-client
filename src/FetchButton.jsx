import React, { useEffect } from 'react';
import { useLazyQuery, gql } from '@apollo/client';
import { Button } from '@mui/material';

const GET_EVENTS = gql`
query ExampleQuery($input: GetEventsInput) {
    events(input: $input) {
      id
      date
      time
      title
      slug
    }
  }
`

const GET_EVENTS_BY_DATE = gql`
query GetEventsByDate($dateRange: DateRangeInput) {
  eventsByVenue(dateRange: $dateRange) {
    count
    name
  }
}
`

export const FetchButton = ({ setData }) => {
    const [getEvents, { loading, error, data }] = useLazyQuery(GET_EVENTS_BY_DATE,{ variables: {
      "dateRange": {
        "start": "2022-01-01",
        "end": "2022-02-01"
      },
    }});

      useEffect(() => {
        if(data){
          setData(data.eventsByVenue.slice(0,10));
        }
      },[data])
    return (
        <>
          <Button variant='contained' onClick={getEvents}>Get event count</Button>
          {/* {loading ? 'loading...' : 'loaded!'} */}
          {data && data.eventsByVenue.slice(0,10).map((item) => {
            return <pre>{JSON.stringify(item)}</pre>
          })}
        </>
    )
}