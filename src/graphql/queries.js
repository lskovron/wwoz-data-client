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
      slug
      name
      lat
      lng
      address
      types
      rating
      googleId
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
