import {
  GoogleMap,
  Marker,
  useJsApiLoader
} from '@react-google-maps/api'

import type { Location } from '../types/location'


interface Props {
  location: Location
}


const containerStyle = {

  width: '100%',
  height: '400px',
  borderRadius: '12px'

}


function MapView({
  location
}: Props) {


  const { isLoaded } = useJsApiLoader({

    googleMapsApiKey:
      import.meta.env.VITE_GOOGLE_MAPS_KEY

  })


  if (!isLoaded) {

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

    >

      <Marker

        position={{

          lat: location.latitude,
          lng: location.longitude

        }}

      />

    </GoogleMap>

  )

}


export default MapView
 