import { gql } from "@apollo/client";

export const GET_EVENTS_IN_RANGE = gql`
  query GetAllEventsInRange($dateRange: DateRangeInput, $limit: Int) {
    eventsInRange(dateRange: $dateRange, limit: $limit) {
      id
      venue {
        name
        slug
      }
      date
      time
      title
      slug
    }
  }
`;

export const GET_VENUES_IN_RANGE = gql`
  query EventsByVenue($dateRange: DateRangeInput) {
    eventsByVenue(dateRange: $dateRange) {
      slug
      name
      lat
      lng
      address
      count
      googleId
      rating
      _id
    }
  }
`;

export const GET_VENUE_DATA = gql`
  query Query($slug: String!) {
    venueGeoData(slug: $slug) {
      googleName
      address
      lat
      lng
      types
      rating
      googleId
      businessStatus
      name
      slug
    }
  }
`;

export const GET_VENUE_DATA_BY_NAME = gql`
  query Query($name: String!, $slug: String!) {
    venueGeoData(name: $name, slug: $slug) {
      googleName
      address
      lat
      lng
      types
      rating
      googleId
      businessStatus
      name
      slug
    }
  }
`;

export const SAVE_VENUE_DATA = gql`
  mutation Mutation($venue: VenueDetailsInput!) {
    saveVenueData(venue: $venue) {
      slug
    }
  }
`;

export const GET_FULL_HISTORY = gql`
  query GetHistory {
    fullHistory {
      hasError
      dateString
    }
  }
`;
export const GET_HISTORY = gql`
  query History($dateRange: DateRangeInput!) {
    history(dateRange: $dateRange) {
      dateString
      hasError
    }
  }
`;
