const GOOGLE_API_KEY =
  process.env.GOOGLE_MAPS_KEY ||
  process.env.GOOGLE_PLACES_API_KEY ||
  process.env.GOOGLE_API_KEY ||
  process.env.VITE_GOOGLE_MAPS_KEY


async function searchNearbyPubs(latitude, longitude) {


  const response = await fetch(

    'https://places.googleapis.com/v1/places:searchNearby',

    {

      method: 'POST',

      headers: {

        'Content-Type': 'application/json',

        'X-Goog-Api-Key': GOOGLE_API_KEY,

        'X-Goog-FieldMask':
          'places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.regularOpeningHours,places.types,places.websiteUri'

      },


      body: JSON.stringify({

        includedTypes: [

          'bar'

        ],


        maxResultCount: 20,


        locationRestriction: {

          circle: {

            center: {

              latitude: latitude,

              longitude: longitude

            },

            radius: 5000

          }

        }

      })

    }

  )



  const result =
    await response.json()



  console.log(
    "GOOGLE RESPONSE",
    JSON.stringify(result, null, 2)
  )



  if (!response.ok) {

    throw new Error(
      JSON.stringify(result)
    )

  }



  return (

    result.places || []

  ).map(place => {


    return {

      id:

        place.id,


      name:

        place.displayName?.text ??

        'Unknown Venue',


      address:

        place.formattedAddress ??

        '',


      latitude:

        place.location?.latitude,


      longitude:

        place.location?.longitude,


      rating:

        place.rating ?? null,


      website:

        place.websiteUri ?? null,


      reviewCount:

        place.userRatingCount ?? null,


      openingHours:

        place.regularOpeningHours
          ?.weekdayDescriptions ?? [],


      types:

        place.types ?? []

    }


  })


}



module.exports = {

  searchNearbyPubs

}
