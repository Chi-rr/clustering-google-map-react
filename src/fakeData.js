const TOTAL_COUNT = 200;

export const susolvkaCoords = { lat: 60.814305, lng: 47.051773 };

export const markersData = [
  {id: 1, lat: 61.15486568402762, lng: 47.31176340287108},
  {id: 2, lat: 61.15486568402762, lng: 47.31176340287108}
]

  //[...Array(TOTAL_COUNT)]
  //  .fill(0) // fill(0) for loose mode
  //.map((__, index) => ({
  //  id: index,
  //  lat:
  //    susolvkaCoords.lat +
  //    0.01 *
  //      index *
  //      Math.sin(30 * Math.PI * index / 180) *
  //      Math.cos(50 * Math.PI * index / 180) +
  //    Math.sin(5 * index / 180),
  //  lng:
  //    susolvkaCoords.lng +
  //    0.01 *
  //      index *
  //      Math.cos(70 + 23 * Math.PI * index / 180) *
  //      Math.cos(50 * Math.PI * index / 180) +
  //    Math.sin(5 * index / 180),
  //}));
