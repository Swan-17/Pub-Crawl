import type { Pub } from '../types/pub'


export async function searchNearbyPubs(

  latitude: number,

  longitude: number

): Promise<Pub[]> {


  const response = await fetch(

    `http://localhost:5000/api/pubs?lat=${latitude}&lng=${longitude}`

  )


  if (!response.ok) {

    throw new Error(
      'Unable to find pubs'
    )

  }


  const pubs: Pub[] =
    await response.json()


  return pubs


}
 