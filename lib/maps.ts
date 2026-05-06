import { Client, TravelMode } from "@googlemaps/google-maps-services-js";

export const PRICE_PER_KM = 5.5; 
export const SIZES_BASE_PRICES: Record<string, number> = {
  'מעטפה': 35,
  'קטן': 45,
  'בינוני': 60,
  'גדול': 75
};

export function calculateFinalPrice(distanceKm: number, packageType: string): number {
  const basePrice = SIZES_BASE_PRICES[packageType] || 35;
  return Math.round(basePrice + (distanceKm * PRICE_PER_KM));
}

const mapsClient = new Client({});

export async function getServerPrice(pickup: any, dropOffs: any[], packageType: string) {
  const waypoints = [pickup, ...dropOffs];
  
  const requests = [];

  for (let i = 0; i < waypoints.length - 1; i++) {
    requests.push(
      mapsClient.distancematrix({
        params: {
          origins: [{ lat: waypoints[i].lat, lng: waypoints[i].lng }],
          destinations: [{ lat: waypoints[i + 1].lat, lng: waypoints[i + 1].lng }],
          mode: TravelMode.driving,
            key: process.env.BACKEND_GOOGLE_MAPS_API_KEY || '',
        },
      })
    );
  }

  const responses = await Promise.all(requests);

  let totalMeters = 0;
  responses.forEach((response) => {
    const element = response.data.rows[0]?.elements[0];
    if (element && element.status === "OK" && element.distance) {
      totalMeters += element.distance.value;
    }
  });

  const distanceKm = totalMeters / 1000;
  
  return calculateFinalPrice(distanceKm, packageType);
}
export const getFrontendPrice = async (
  pickup: { lat: number; lng: number },
  dropOffs: { lat: number; lng: number }[],
  packageType: string
) => {
  const service = new google.maps.DistanceMatrixService();
  const waypoints = [pickup, ...dropOffs];
  let totalMeters = 0;

  for (let i = 0; i < waypoints.length - 1; i++) {
    const response = await service.getDistanceMatrix({
      origins: [waypoints[i]],
      destinations: [waypoints[i + 1]],
      travelMode: google.maps.TravelMode.DRIVING,
    });

    const element = response.rows[0].elements[0];
    if (element.status === "OK" && element.distance) {
      totalMeters += element.distance.value;
    }
  }

  const distanceKm = totalMeters / 1000;
  return calculateFinalPrice(distanceKm, packageType);
};