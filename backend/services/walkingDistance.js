import dotenv from "dotenv"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({
  path: path.resolve(__dirname, "../.env")
})

dotenv.config({
  path: path.resolve(__dirname, "../../.env")
})

const GOOGLE_API_KEY =
  process.env.GOOGLE_MAPS_KEY ||
  process.env.GOOGLE_PLACES_API_KEY ||
  process.env.GOOGLE_API_KEY ||
  process.env.VITE_GOOGLE_MAPS_KEY



export async function getWalkingDistances(pubs) {


  console.log(
    "Walking distance request:",
    pubs
  )


  console.log(
    "Google key exists:",
    !!GOOGLE_API_KEY
  )



  if (!pubs || pubs.length < 2) {

    return []

  }



  const distances = []



  for (
    let i = 0;
    i < pubs.length - 1;
    i++
  ) {


    const origin = pubs[i]

    const destination = pubs[i + 1]



    try {


      const response = await fetch(

        "https://routes.googleapis.com/directions/v2:computeRoutes",

        {

          method:"POST",

          headers:{

            "Content-Type":"application/json",

            "X-Goog-Api-Key":
              GOOGLE_API_KEY,

            "X-Goog-FieldMask":
              "routes.distanceMeters,routes.duration"

          },


          body:JSON.stringify({

            origin:{

              location:{

                latLng:{

                  latitude:
                    origin.latitude,

                  longitude:
                    origin.longitude

                }

              }

            },


            destination:{

              location:{

                latLng:{

                  latitude:
                    destination.latitude,

                  longitude:
                    destination.longitude

                }

              }

            },


            travelMode:
              "WALK"


          })


        }

      )



      const data =
        await response.json()



      console.log(
        "Routes status:",
        response.status
      )


      console.log(
        JSON.stringify(
          data,
          null,
          2
        )
      )



      if (
        data.routes &&
        data.routes.length > 0
      ) {


        distances.push({

          from:
            origin.name,

          to:
            destination.name,

          distanceMeters:
            data.routes[0].distanceMeters,

          duration:
            data.routes[0].duration

        })

      }


    }

    catch(error) {


      console.error(
        "Routes error:",
        error
      )


    }


  }



  console.log(
    "Returning distances:",
    distances
  )


  return distances


}
