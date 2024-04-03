import React from 'react';
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

export const FetchButton = () => {
    const [getEvents, { loading, error, data }] = useLazyQuery(GET_EVENTS,{ variables: {  "input": {
        "venueSlug": "30-90"
      }}});
    return (
        <>
        <Button variant='contained' onClick={getEvents}>Hello</Button>
        {loading ? 'loading...' : 'loaded!'}
        <pre>{data ? JSON.stringify(data) : 'no data'}</pre>
        </>
    )
}