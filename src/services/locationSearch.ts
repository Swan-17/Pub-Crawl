import type { Location } from '../types/location'

export async function searchLocation(
  query: string
): Promise<Location | null> {

  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
  )

  const data = await response.json()

  if (!data.length) {
    return null
  }

  return {
    latitude: Number(data[0].lat),
    longitude: Number(data[0].lon),
    name: data[0].display_name,
  }
}

