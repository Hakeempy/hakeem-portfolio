// Daily KPIs computed from the trip pipeline's sample data (trip_start.csv joined to trip_end.csv on trip_id).
// Every one of the 4,999 matched trips was picked up on 2024-05-25.
export const tripDay = {
  date: "2024-05-25",
  tripCount: 4999,
  totalFare: 274393.88,
  maxFare: 99.99,
  minFare: 10.04,
} as const;

// The first trip in the source files, used as the starting point for the visitor's trip.
export const sampleTrip = {
  tripId: "c66ce556bc",
  pickup: "2024-05-25 13:19:00",
  dropoff: "2024-05-25 14:05:00",
  estimate: "34.19",
  fare: "40.10",
  /** fare_amount as stored, unrounded */
  fullFare: 40.09620692463166,
} as const;
