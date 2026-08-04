import {
  Marker,
  InfoWindow
} from '@react-google-maps/api'

import {
  useState
} from 'react'

import type { Pub } from '../types/pub'



interface Props {

  pub: Pub

  isSelected?: boolean

  onAddPub?: (pub: Pub) => void

}



function PubMarker({

  pub,

  isSelected = false,

  onAddPub

}: Props) {


  const [open,setOpen] = useState(false)



  return (

    <>

      <Marker

        position={{

          lat: pub.latitude,

          lng: pub.longitude

        }}

        onClick={()=>setOpen(true)}

        label="🍺"

      />



      {


        open && (


          <InfoWindow

            position={{

              lat: pub.latitude,

              lng: pub.longitude

            }}

            onCloseClick={()=>setOpen(false)}

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

                pub.reviewCount && (

                  <p>

                    Reviews: {pub.reviewCount}

                  </p>

                )

              }





              {

                pub.openingHours &&

                pub.openingHours.length > 0 &&

                (

                  <div>

                    <strong>

                      Opening hours

                    </strong>


                    <p>

                      {pub.openingHours[0]}

                    </p>


                  </div>

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
