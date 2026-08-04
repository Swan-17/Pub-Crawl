import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { searchLocation } from '../services/locationSearch'
import { searchNearbyPubs } from '../services/pubSearch'
import { saveCrawl } from '../services/crawlStorage'

import type { Location } from '../types/location'
import type { Pub } from '../types/pub'

import MapView from '../components/MapView'


const DRAFT_KEY = 'pub-crawl-create-draft'


type DraftState = {
  crawlName: string
  locationInput: string
  selectedLocation: Location | null
  nearbyPubs: Pub[]
  selectedPubs: Pub[]
}


function loadDraft(): DraftState {
  if (typeof window === 'undefined') {
    return {
      crawlName: '',
      locationInput: '',
      selectedLocation: null,
      nearbyPubs: [],
      selectedPubs: []
    }
  }

  const raw = window.localStorage.getItem(DRAFT_KEY)

  if (!raw) {
    return {
      crawlName: '',
      locationInput: '',
      selectedLocation: null,
      nearbyPubs: [],
      selectedPubs: []
    }
  }

  try {
    return JSON.parse(raw) as DraftState
  } catch {
    return {
      crawlName: '',
      locationInput: '',
      selectedLocation: null,
      nearbyPubs: [],
      selectedPubs: []
    }
  }
}


function CreateCrawl() {


  const navigate = useNavigate()



  const draft = loadDraft()

  const [crawlName,setCrawlName] =

    useState(draft.crawlName)



  const [locationInput,setLocationInput] =

    useState(draft.locationInput)



  const [selectedLocation,setSelectedLocation] =

    useState<Location | null>(draft.selectedLocation)



  const [nearbyPubs,setNearbyPubs] =

    useState<Pub[]>(draft.nearbyPubs)



  const [selectedPubs,setSelectedPubs] =

    useState<Pub[]>(draft.selectedPubs)



  const [loadingPubs,setLoadingPubs] =

    useState(false)


  useEffect(() => {
    window.localStorage.setItem(
      DRAFT_KEY,
      JSON.stringify({
        crawlName,
        locationInput,
        selectedLocation,
        nearbyPubs,
        selectedPubs
      })
    )
  }, [crawlName, locationInput, selectedLocation, nearbyPubs, selectedPubs])





  const recommendedPubs =

    [...nearbyPubs]

      .sort((a,b)=>

        (b.rating ?? 0) - (a.rating ?? 0)

      )

      .slice(0,5)




  async function loadPubs(location:Location) {


    try {


      setLoadingPubs(true)



      const pubs =

        await searchNearbyPubs(

          location.latitude,

          location.longitude

        )



      setNearbyPubs(pubs)


    }

    catch(error) {


      console.error(error)

      alert(
        'Unable to load pubs'
      )


    }

    finally {


      setLoadingPubs(false)


    }


  }






  async function handleSearchLocation() {


    const result =

      await searchLocation(

        locationInput

      )



    if(result) {


      const location: Location = {


        ...result,


        source:'search'


      }



      setSelectedLocation(location)


      loadPubs(location)


    }

    else {


      alert(
        'Location not found'
      )


    }


  }






  function useCurrentLocation() {


    navigator.geolocation.getCurrentPosition(


      position=>{


        const location:Location = {


          latitude:

            position.coords.latitude,


          longitude:

            position.coords.longitude,


          name:

            'Current location',


          source:

            'gps'


        }





        setSelectedLocation(location)


        loadPubs(location)


      },



      ()=>{


        alert(

          'Unable to get your location'

        )


      }


    )


  }








  function addPub(pub:Pub) {


    const exists =

      selectedPubs.some(

        item =>

          item.id === pub.id

      )



    if(!exists) {


      setSelectedPubs([

        ...selectedPubs,

        pub

      ])


    }


  }







  function removePub(id:string) {


    setSelectedPubs(

      selectedPubs.filter(

        pub =>

          pub.id !== id

      )

    )


  }







  function createCrawl() {


    if(selectedPubs.length < 2) {


      alert(

        'Please add at least 2 pubs'

      )


      return


    }





    const code =

      Math.random()

      .toString(36)

      .substring(2,8)

      .toUpperCase()





    const hostId =

      crypto.randomUUID()





    const crawlPubs =

      selectedPubs.map(pub => ({


        ...pub,


        visited:false,


        visitedBy:[],


        photos:[],


        comments:[]


      }))





    saveCrawl({


      code,



      name:

        crawlName || 'My Pub Crawl',



      status:

        'lobby',



      hostId,



      createdAt:

        new Date().toISOString(),



      participants:[


        {


          id:

            hostId,


          name:

            'Host',


          joinedAt:

            new Date().toISOString(),


          latitude:null,


          longitude:null,


          isHost:true


        }


      ],



      pubs:

        crawlPubs


    })





    navigate(

      `/crawl/${code}`

    )


  }








  return (


    <div style={styles.container} className="create-crawl-page">


      <div style={styles.counter} className="crawl-counter">


        <h3>

          🍻 My Crawl

        </h3>



        <strong>

          {selectedPubs.length} pubs

        </strong>





        {

          selectedPubs.map(pub => (


            <div

              key={pub.id}

              style={styles.counterPub}

            >


              {pub.name}



              <button
                type="button"
                onClick={() => removePub(pub.id)}
                style={{ minHeight: '40px' }}
                aria-label={`Remove ${pub.name}`}
              >
                ✕
              </button>


            </div>


          ))

        }


      </div>







      <h1>

        🍻 Create Crawl

      </h1>






      <input

        style={styles.input}
        className="create-input"

        placeholder="Crawl name"

        value={crawlName}

        onChange={e=>

          setCrawlName(

            e.target.value

          )

        }

      />







      <input

        style={styles.input}
        className="create-input"

        placeholder="City, postcode or address"

        value={locationInput}

        onChange={e=>

          setLocationInput(

            e.target.value

          )

        }

      />






      <button

        style={styles.button}
        className="create-input"

        onClick={handleSearchLocation}

      >

        Search Location

      </button>







      <br/><br/>






      <button

        style={styles.secondaryButton}
        className="create-input"

        onClick={useCurrentLocation}

      >

        📍 Use My Location

      </button>








      {

        selectedLocation &&


        <MapView


          location={selectedLocation}


          pubs={nearbyPubs}


          selectedPubs={selectedPubs}


          onAddPub={addPub}


        />


      }









      {

        selectedLocation &&


        <button

          style={styles.button}
          className="create-cta"

          onClick={createCrawl}

        >

          Create Crawl ({selectedPubs.length} pubs)

        </button>


      }



      {

        loadingPubs &&


        <p>

          Finding pubs...

        </p>


      }









      {

        recommendedPubs.length > 0 &&


        <div style={styles.card}>


          <h3>

            Recommended Pubs

          </h3>





          {

            recommendedPubs.map(pub => (


              <div

                key={pub.id}

                style={styles.pub}

              >


                <strong>

                  {pub.name}

                </strong>



                <p>

                  ⭐ {pub.rating}

                </p>





                <button

                  style={styles.button}

                  onClick={()=>addPub(pub)}

                >


                  {

                    selectedPubs.some(

                      item =>

                        item.id === pub.id

                    )

                    ? '✓ Added'

                    : '+ Add to Crawl'


                  }


                </button>


              </div>


            ))

          }


        </div>


      }

      <br/><br/>
      <Link to="/">

        Back Home

      </Link>


    </div>


  )


}







const styles = {


  container:{


    textAlign:'center' as const,


    padding:'40px',


    maxWidth:'1100px',


    margin:'0 auto'


  },



  counter:{


    position:'fixed' as const,


    right:'20px',


    top:'120px',


    width:'220px',


    background:'white',


    padding:'20px',


    border:'1px solid #ddd',


    borderRadius:'12px',


    zIndex:1000,


    maxWidth:'calc(100vw - 40px)'


  },



  counterPub:{


    fontSize:'12px',


    margin:'8px'


  },



  input:{


    display:'block',


    margin:'15px auto',


    padding:'12px',


    width:'min(100%, 300px)'


  },



  button:{


    padding:'10px 20px',


    background:'#1f7a4d',


    color:'white',


    border:'none',


    borderRadius:'8px',


    cursor:'pointer'


  },



  secondaryButton:{


    padding:'10px 20px',


    background:'#444',


    color:'white',


    border:'none',


    borderRadius:'8px'


  },



  card:{


    margin:'25px auto',


    padding:'20px',


    maxWidth:'500px',


    width:'100%',


    border:'1px solid #ddd',


    borderRadius:'12px'


  },



  pub:{


    padding:'15px',


    margin:'10px',


    border:'1px solid #ddd',


    borderRadius:'8px'


  }


}



export default CreateCrawl
