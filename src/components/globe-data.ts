// ── Globe geographic data + utilities ──────────────────────────
// All coordinates are [latitude, longitude] — standard geographic convention.

import * as THREE from "three";

// ── Lat/Lng → 3D position ─────────────────────────────────────
export function latLngToPos(
  lat: number,
  lng: number,
  radius: number
): [number, number, number] {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lng + 180) * Math.PI) / 180;
  return [
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  ];
}

// ── Point-in-polygon (ray-cast, 2D lat/lng) ───────────────────
export function isPointInPolygon(
  lat: number,
  lng: number,
  polygon: [number, number][]
): boolean {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [yi, xi] = polygon[i];
    const [yj, xj] = polygon[j];
    if (yi > lat !== yj > lat && lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

// ── Great-circle arc interpolation (slerp) ────────────────────
export function greatCircleArc(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
  segments: number,
  radius: number,
  altitude: number
): THREE.Vector3[] {
  const p1 = new THREE.Vector3(...latLngToPos(lat1, lng1, 1));
  const p2 = new THREE.Vector3(...latLngToPos(lat2, lng2, 1));
  const omega = Math.acos(THREE.MathUtils.clamp(p1.dot(p2), -1, 1));
  const sinOmega = Math.sin(omega);
  const points: THREE.Vector3[] = [];

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    let pt: THREE.Vector3;
    if (sinOmega < 0.001) {
      pt = p1.clone().lerp(p2, t);
    } else {
      const a = Math.sin((1 - t) * omega) / sinOmega;
      const b = Math.sin(t * omega) / sinOmega;
      pt = p1.clone().multiplyScalar(a).add(p2.clone().multiplyScalar(b));
    }
    const h = radius * (1 + altitude * Math.sin(t * Math.PI));
    pt.normalize().multiplyScalar(h);
    points.push(pt);
  }
  return points;
}

// ── Continent polygons (simplified coastlines) ────────────────
// Each polygon: array of [lat, lng] pairs tracing the rough outline.
// These are intentionally simplified for visual rendering, not GIS accuracy.

export const CONTINENTS: { name: string; polygon: [number, number][] }[] = [
  {
    name: "Africa",
    polygon: [
      [35, -6],[37, 10],[34, 12],[32, 15],[31, 25],[30, 33],
      [22, 37],[15, 42],[12, 44],[11, 50],[2, 42],[-1, 42],
      [-12, 41],[-26, 34],[-35, 26],[-34, 18],[-29, 16],
      [-22, 14],[-17, 12],[-6, 12],[4, 0],[5, -4],[6, 1],
      [6, 10],[10, 14],[13, 14],[15, 18],[20, 16],[24, 17],
      [32, -9],[35, -6],
    ],
  },
  {
    name: "Europe",
    polygon: [
      [38, -10],[36, -6],[38, 0],[43, -2],[44, -1],[46, 2],
      [48, -5],[51, 2],[53, 7],[55, 9],[58, 6],[62, 5],
      [64, 10],[67, 14],[70, 20],[71, 28],[70, 33],[68, 40],
      [65, 30],[60, 30],[58, 28],[56, 22],[55, 14],[53, 10],
      [52, 6],[51, 4],[50, 1],[48, -2],[47, -2],[44, -9],
      [40, -10],[38, -10],
    ],
  },
  {
    name: "Scandinavia",
    polygon: [
      [56, 10],[58, 12],[60, 11],[62, 12],[65, 14],[67, 15],
      [69, 16],[70, 19],[71, 26],[71, 30],[70, 28],[68, 18],
      [66, 14],[63, 12],[60, 17],[58, 16],[56, 14],[56, 10],
    ],
  },
  {
    name: "British Isles",
    polygon: [
      [50, -6],[51, 1],[53, 0],[54, -1],[55, -2],[56, -3],
      [57, -5],[58, -5],[58, -3],[57, -2],[56, -3],[54, -3],
      [53, -5],[51, -5],[50, -6],
    ],
  },
  {
    name: "Russia-Siberia",
    polygon: [
      [55, 28],[58, 32],[60, 40],[62, 50],[64, 60],[65, 70],
      [68, 70],[70, 72],[72, 80],[73, 90],[74, 100],[73, 110],
      [72, 120],[70, 130],[68, 135],[65, 140],[63, 150],[62, 160],
      [65, 170],[64, 178],[62, 175],[58, 162],[55, 155],[52, 140],
      [50, 130],[48, 120],[50, 110],[52, 100],[54, 90],[52, 80],
      [50, 70],[50, 60],[48, 55],[50, 45],[50, 40],[52, 35],
      [55, 28],
    ],
  },
  {
    name: "Middle East",
    polygon: [
      [32, 32],[37, 36],[40, 40],[42, 42],[40, 44],[38, 48],
      [35, 46],[32, 48],[30, 48],[28, 48],[24, 52],[22, 55],
      [20, 58],[16, 52],[13, 44],[12, 44],[15, 42],[22, 37],
      [28, 35],[30, 33],[32, 32],
    ],
  },
  {
    name: "Arabian Peninsula",
    polygon: [
      [30, 35],[28, 35],[25, 37],[22, 37],[18, 42],[15, 42],
      [13, 44],[12, 44],[12, 51],[15, 52],[18, 54],[20, 58],
      [22, 56],[24, 54],[26, 56],[28, 50],[30, 48],[32, 48],
      [30, 40],[30, 35],
    ],
  },
  {
    name: "India",
    polygon: [
      [35, 74],[32, 72],[30, 68],[28, 67],[25, 68],[23, 70],
      [22, 72],[20, 73],[17, 73],[15, 74],[13, 75],[10, 76],
      [8, 77],[10, 80],[13, 80],[16, 81],[20, 86],[22, 89],
      [24, 89],[26, 89],[28, 88],[30, 82],[32, 79],[35, 77],
      [35, 74],
    ],
  },
  {
    name: "China-East Asia",
    polygon: [
      [54, 120],[50, 120],[48, 118],[46, 114],[42, 108],
      [40, 105],[38, 100],[36, 96],[35, 92],[35, 80],[37, 76],
      [40, 74],[42, 74],[44, 80],[46, 86],[48, 90],[50, 90],
      [50, 95],[48, 100],[47, 105],[46, 110],[45, 115],
      [42, 118],[40, 120],[38, 118],[35, 116],[32, 120],
      [30, 122],[26, 120],[24, 110],[22, 108],[20, 107],
      [18, 108],[16, 108],[22, 114],[26, 120],[30, 122],
      [35, 122],[40, 124],[42, 130],[44, 130],[46, 132],
      [48, 135],[50, 135],[52, 132],[54, 130],[54, 120],
    ],
  },
  {
    name: "Southeast Asia",
    polygon: [
      [22, 100],[20, 100],[18, 100],[16, 98],[14, 99],
      [10, 99],[7, 100],[4, 102],[1, 104],[2, 100],
      [6, 98],[10, 98],[12, 98],[16, 96],[20, 93],
      [21, 92],[22, 95],[22, 100],
    ],
  },
  {
    name: "Japan",
    polygon: [
      [31, 131],[33, 131],[34, 132],[35, 133],[36, 136],
      [38, 138],[40, 140],[42, 141],[44, 143],[44, 145],
      [42, 143],[40, 140],[38, 140],[36, 140],[35, 137],
      [34, 134],[33, 132],[31, 131],
    ],
  },
  {
    name: "North America",
    polygon: [
      [50, -128],[55, -132],[60, -140],[64, -164],[67, -165],
      [71, -157],[72, -145],[71, -138],[68, -130],[64, -120],
      [60, -115],[55, -110],[50, -100],[50, -95],[52, -85],
      [55, -80],[58, -68],[55, -60],[52, -56],[48, -54],
      [45, -62],[43, -67],[42, -71],[40, -74],[37, -76],
      [32, -80],[30, -82],[28, -82],[25, -80],[25, -82],
      [27, -85],[30, -88],[29, -90],[28, -95],[26, -97],
      [22, -98],[20, -100],[18, -96],[15, -92],[14, -87],
      [10, -84],[8, -78],[9, -77],[10, -80],[12, -84],
      [15, -87],[17, -88],[21, -87],[22, -90],[20, -96],
      [22, -105],[25, -108],[28, -112],[31, -117],[34, -120],
      [38, -123],[42, -124],[46, -124],[48, -125],[50, -128],
    ],
  },
  {
    name: "South America",
    polygon: [
      [12, -72],[10, -67],[8, -60],[6, -53],[3, -50],
      [0, -50],[-2, -44],[-5, -35],[-8, -35],[-12, -37],
      [-15, -39],[-20, -40],[-23, -42],[-28, -49],[-33, -52],
      [-38, -57],[-42, -63],[-46, -66],[-50, -69],[-53, -70],
      [-55, -68],[-55, -64],[-52, -69],[-48, -75],[-44, -73],
      [-40, -73],[-35, -72],[-30, -71],[-25, -70],[-18, -70],
      [-15, -75],[-10, -77],[-5, -80],[0, -80],[2, -77],
      [5, -77],[8, -73],[10, -73],[12, -72],
    ],
  },
  {
    name: "Greenland",
    polygon: [
      [60, -43],[62, -42],[65, -40],[68, -30],[72, -22],
      [76, -18],[78, -20],[80, -25],[82, -30],[83, -40],
      [82, -50],[80, -58],[78, -68],[76, -70],[72, -55],
      [68, -50],[65, -45],[62, -46],[60, -43],
    ],
  },
  {
    name: "Australia",
    polygon: [
      [-12, 130],[-12, 136],[-14, 136],[-15, 140],[-18, 146],
      [-24, 147],[-28, 153],[-33, 152],[-38, 148],[-40, 147],
      [-38, 144],[-35, 138],[-32, 133],[-30, 131],[-26, 128],
      [-22, 118],[-20, 114],[-18, 122],[-14, 126],[-12, 130],
    ],
  },
  {
    name: "Indonesia-Borneo",
    polygon: [
      [7, 109],[5, 109],[2, 109],[0, 109],[-2, 111],
      [-4, 114],[-3, 116],[-1, 118],[1, 118],[3, 117],
      [5, 115],[6, 112],[7, 109],
    ],
  },
  {
    name: "Indonesia-Sumatra",
    polygon: [
      [5, 95],[3, 98],[0, 100],[-2, 101],[-3, 104],
      [-5, 105],[-5, 103],[-3, 100],[0, 98],[2, 96],
      [5, 95],
    ],
  },
  {
    name: "New Zealand",
    polygon: [
      [-35, 172],[-37, 174],[-39, 176],[-42, 172],
      [-45, 167],[-47, 167],[-46, 169],[-43, 172],
      [-40, 176],[-38, 177],[-35, 175],[-35, 172],
    ],
  },
  {
    name: "Madagascar",
    polygon: [
      [-12, 49],[-14, 50],[-18, 44],[-22, 44],[-25, 46],
      [-24, 47],[-20, 48],[-16, 50],[-12, 49],
    ],
  },
  {
    name: "Iceland",
    polygon: [
      [64, -22],[65, -18],[66, -16],[66, -14],[65, -14],
      [64, -16],[63, -18],[63, -22],[64, -22],
    ],
  },
  {
    name: "Alaska",
    polygon: [
      [60, -140],[60, -148],[58, -155],[56, -160],[55, -165],
      [58, -168],[60, -168],[64, -168],[67, -165],[71, -157],
      [72, -145],[71, -138],[68, -130],[64, -138],[60, -140],
    ],
  },
];

// ── Check if lat/lng is on any continent ──────────────────────
export function isLand(lat: number, lng: number): boolean {
  for (const c of CONTINENTS) {
    if (isPointInPolygon(lat, lng, c.polygon)) return true;
  }
  return false;
}

// ── Location markers ──────────────────────────────────────────
export interface MarkerData {
  name: string;
  lat: number;
  lng: number;
}

export const TECH_HUBS: MarkerData[] = [
  { name: "Silicon Valley", lat: 37.4, lng: -122.1 },
  { name: "New York", lat: 40.7, lng: -74.0 },
  { name: "London", lat: 51.5, lng: -0.1 },
  { name: "Beijing", lat: 39.9, lng: 116.4 },
  { name: "Tokyo", lat: 35.7, lng: 139.7 },
  { name: "Bangalore", lat: 13.0, lng: 77.6 },
  { name: "Seoul", lat: 37.6, lng: 127.0 },
  { name: "Tel Aviv", lat: 32.1, lng: 34.8 },
  { name: "Berlin", lat: 52.5, lng: 13.4 },
  { name: "Shanghai", lat: 31.2, lng: 121.5 },
  { name: "Singapore", lat: 1.35, lng: 103.8 },
  { name: "Toronto", lat: 43.7, lng: -79.4 },
  { name: "Stockholm", lat: 59.3, lng: 18.1 },
  { name: "Shenzhen", lat: 22.5, lng: 114.1 },
  { name: "Dubai", lat: 25.2, lng: 55.3 },
];

export const DATA_CENTERS: MarkerData[] = [
  { name: "Ashburn VA", lat: 39.0, lng: -77.5 },
  { name: "Dublin", lat: 53.3, lng: -6.3 },
  { name: "Frankfurt", lat: 50.1, lng: 8.7 },
  { name: "Singapore DC", lat: 1.3, lng: 103.8 },
  { name: "Tokyo DC", lat: 35.7, lng: 139.8 },
  { name: "São Paulo", lat: -23.6, lng: -46.6 },
  { name: "Mumbai", lat: 19.1, lng: 72.9 },
  { name: "Sydney", lat: -33.9, lng: 151.2 },
  { name: "Oregon", lat: 45.6, lng: -121.2 },
  { name: "Iowa", lat: 41.9, lng: -93.1 },
  { name: "Finland", lat: 60.2, lng: 25.0 },
  { name: "Taiwan TSMC", lat: 25.0, lng: 121.5 },
  { name: "Netherlands", lat: 52.4, lng: 4.9 },
  { name: "Chile", lat: -33.4, lng: -70.7 },
];

export const WAR_ZONES: MarkerData[] = [
  { name: "Ukraine", lat: 48.4, lng: 35.0 },
  { name: "Gaza", lat: 31.4, lng: 34.4 },
  { name: "Sudan", lat: 15.6, lng: 32.5 },
  { name: "Yemen", lat: 15.4, lng: 44.2 },
  { name: "Myanmar", lat: 19.8, lng: 96.2 },
  { name: "Syria", lat: 35.0, lng: 38.5 },
  { name: "DR Congo", lat: -4.3, lng: 15.3 },
  { name: "Somalia", lat: 2.0, lng: 45.3 },
];

// ── Trade routes ──────────────────────────────────────────────
export interface RouteData {
  name: string;
  from: [number, number]; // [lat, lng]
  to: [number, number];
  type: "sea" | "air";
}

export const TRADE_ROUTES: RouteData[] = [
  // Sea routes
  { name: "Shanghai → LA", from: [31.2, 121.5], to: [33.7, -118.2], type: "sea" },
  { name: "Shanghai → Rotterdam", from: [31.2, 121.5], to: [51.9, 4.5], type: "sea" },
  { name: "Rotterdam → NYC", from: [51.9, 4.5], to: [40.7, -74.0], type: "sea" },
  { name: "Dubai → Mumbai", from: [25.2, 55.3], to: [19.1, 72.9], type: "sea" },
  { name: "Singapore → Sydney", from: [1.3, 103.8], to: [-33.9, 151.2], type: "sea" },
  { name: "Santos → Lisbon", from: [-23.9, -46.3], to: [38.7, -9.1], type: "sea" },
  { name: "Cape Town → Mumbai", from: [-33.9, 18.4], to: [19.1, 72.9], type: "sea" },
  { name: "Tokyo → Panama", from: [35.7, 139.7], to: [9.0, -79.5], type: "sea" },
  // Air routes
  { name: "NYC → London", from: [40.7, -74.0], to: [51.5, -0.1], type: "air" },
  { name: "LA → Tokyo", from: [33.9, -118.4], to: [35.7, 139.7], type: "air" },
  { name: "Dubai → Singapore", from: [25.2, 55.3], to: [1.3, 103.8], type: "air" },
  { name: "Frankfurt → Beijing", from: [50.1, 8.7], to: [39.9, 116.4], type: "air" },
  { name: "São Paulo → Lisbon", from: [-23.6, -46.6], to: [38.7, -9.1], type: "air" },
  { name: "Sydney → Singapore", from: [-33.9, 151.2], to: [1.3, 103.8], type: "air" },
  { name: "London → Dubai", from: [51.5, -0.1], to: [25.2, 55.3], type: "air" },
  { name: "Seoul → SF", from: [37.6, 127.0], to: [37.8, -122.4], type: "air" },
];
