import express from "express"

const router = express.Router()



router.get("/", async (req, res) => {


  console.log(
    "PUB SEARCH REQUEST RECEIVED"
  )


  console.log(
    "Query:",
    req.query
  )



  const {

    lat,

    lng

  } = req.query





  if (!lat || !lng) {


    return res.status(400).json({

      error:
        "Missing latitude or longitude"

    })


  }






  try {


    const GOOGLE_KEY =

      process.env.GOOGLE_PLACES_API_KEY ||
      process.env.GOOGLE_MAPS_KEY ||
      process.env.GOOGLE_API_KEY ||
      process.env.VITE_GOOGLE_MAPS_KEY





    console.log(

      "Google key exists:",

      Boolean(GOOGLE_KEY)

    )





    if (!GOOGLE_KEY) {


      return res.status(500).json({

        error:

          "Google Places API key missing"

      })


    }






    const response = await fetch(


      "https://places.googleapis.com/v1/places:searchNearby",


      {


        method: "POST",



        headers: {


          "Content-Type":

            "application/json",



          "X-Goog-Api-Key":

            GOOGLE_KEY,



          "X-Goog-FieldMask":

            "places.id,places.displayName,places.location,places.rating"


        },



        body: JSON.stringify({



          includedTypes: [


            "bar"


          ],



          maxResultCount: 20,



          locationRestriction: {


            circle: {



              center: {



                latitude:

                  Number(lat),



                longitude:

                  Number(lng)


              },



              radius:

                3000


            }


          }



        })

      }


    )






    const data = await response.json()





    console.log(

      "Google response status:",

      response.status

    )





    console.log(

      JSON.stringify(

        data,

        null,

        2

      )

    )







    if (!response.ok) {


      return res.status(500).json({

        error:

          data.error?.message ||

          "Google Places request failed"

      })


    }







    const pubs =


      (data.places || []).map(place => ({



        id:

          place.id,



        name:

          place.displayName?.text ||

          "Unknown Pub",



        latitude:

          place.location.latitude,



        longitude:

          place.location.longitude,



        rating:

          place.rating || null



      }))






    console.log(

      "Returning pubs:",

      pubs.length

    )





    res.json(

      pubs

    )





  }


  catch(error) {


    console.error(

      "PUB SEARCH ERROR:",

      error

    )



    res.status(500).json({

      error:

        "Unable to find pubs"

    })


  }


})



export default router
