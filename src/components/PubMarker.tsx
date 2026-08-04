import {
  Marker,
  InfoWindow
} from '@react-google-maps/api'

import type { Pub } from '../types/pub'



interface Props {

  pub: Pub

  order?: number

  showNumberedMarker?: boolean

  isSelected?: boolean

  isOpen?: boolean

  onOpen?: (pubId: string) => void

  onClose?: () => void

  onAddPub?: (pub: Pub) => void

}



function PubMarker({

  pub,

  order = 0,

  showNumberedMarker = false,

  isSelected = false,

  isOpen = false,

  onOpen,

  onClose,

  onAddPub

}: Props) {


  const today = new Date().getDay()

  const todayIndex = today === 0 ? 6 : today - 1

  const todayHours =

    pub.openingHours?.[todayIndex] ||
    pub.openingHours?.[0] ||
    'Opening hours unavailable'



  return (

    <>

      <Marker

        position={{

          lat: pub.latitude,

          lng: pub.longitude

        }}

        onClick={() => onOpen?.(pub.id)}

        label={showNumberedMarker ? String(order + 1) : undefined}

      />



      {


        isOpen && (


          <InfoWindow

            position={{

              lat: pub.latitude,

              lng: pub.longitude

            }}

            onCloseClick={() => onClose?.()}

          >


            <div

              style={{

                maxWidth:'220px'

              }}

            >


              <h3>

                {pub.name}

              </h3>



              <p>

                ⭐ {pub.rating ?? 'N/A'}

              </p>




              {

                pub.openingHours &&

                pub.openingHours.length > 0 &&

                (

                  <div>

                    <strong>

                      Opening hours for today

                    </strong>


                    <p>

                      {todayHours}

                    </p>


                  </div>

                )

              }




              {

                pub.website && (

                  <p>

                    <a

                      href={pub.website}

                      target="_blank"

                      rel="noreferrer"

                    >

                      Visit website

                    </a>

                  </p>

                )

              }




              <button

                onClick={()=>{

                  if(onAddPub){

                    onAddPub(pub)

                  }

                }}

                disabled={isSelected}


                style={{

                  padding:'8px',

                  cursor:'pointer'

                }}

              >

                {

                  isSelected

                  ? '✓ Added'

                  : '+ Add to Crawl'

                }


              </button>


            </div>


          </InfoWindow>


        )

      }


    </>

  )

}



export default PubMarker
