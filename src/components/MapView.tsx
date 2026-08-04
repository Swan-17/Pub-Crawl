import {
  useEffect,
  useState
} from 'react'

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

  showNumberedMarkers?: boolean

}



function MapView({

  location,

  pubs = [],

  selectedPubs = [],

  onAddPub,

  showNumberedMarkers = false

}: Props) {



  const [activePubId,setActivePubId] = useState<string | null>(null)
  const [isMobile,setIsMobile] = useState(
    typeof window !== 'undefined' && window.innerWidth <= 768
  )

  useEffect(() => {
    const updateViewport = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    updateViewport()
    window.addEventListener('resize', updateViewport)

    return () => {
      window.removeEventListener('resize', updateViewport)
    }
  }, [])

  const containerStyle = {
    width:'100%',
    height:isMobile ? '320px' : '420px',
    maxWidth:'100%',
    borderRadius:'12px'
  }

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

        pubs.map((pub, index)=>(

          <PubMarker


            key={pub.id}


            pub={pub}

            order={index}

            showNumberedMarker={showNumberedMarkers}

            isOpen={activePubId === pub.id}

            onOpen={(pubId) => setActivePubId(pubId)}

            onClose={() => setActivePubId(null)}

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
