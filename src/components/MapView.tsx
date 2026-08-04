import {
  GoogleMap,
  Marker,
  useJsApiLoader
} from '@react-google-maps/api'

import type { Location } from '../types/location'
import type { Pub } from '../types/pub'

import PubMarker from './PubMarker'


interface Props {

  location: Location

  pubs?: Pub[]

  selectedPubs?: Pub[]

  onAddPub?: (pub: Pub) => void

}



const containerStyle = {

  width:'100%',

  height:'500px',

  borderRadius:'12px'

}



function MapView({

  location,

  pubs = [],

  selectedPubs = [],

  onAddPub

}: Props) {



  const { isLoaded } = useJsApiLoader({

    googleMapsApiKey:

      import.meta.env.VITE_GOOGLE_MAPS_KEY

  })



  if(!isLoaded) {

    return (

      <p>
        Loading map...
      </p>

    )

  }




  return (

    <GoogleMap


      mapContainerStyle={containerStyle}


      center={{

        lat: location.latitude,

        lng: location.longitude

      }}


      zoom={14}


      options={{

        streetViewControl:false,

        mapTypeControl:false

      }}

    >



      <Marker

        position={{

          lat:location.latitude,

          lng:location.longitude

        }}

        label="📍"

      />




      {

        pubs.map((pub)=>(

          <PubMarker


            key={pub.id}


            pub={pub}


            isSelected={

              selectedPubs.some(

                item => item.id === pub.id

              )

            }


            onAddPub={onAddPub}


          />

        ))

      }



    </GoogleMap>

  )

}



export default MapView
