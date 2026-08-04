import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { searchLocation } from '../services/locationSearch'
import { searchNearbyPubs } from '../services/pubSearch'
import { saveCrawl } from '../services/crawlStorage'

import type { Location } from '../types/location'
import type { Pub } from '../types/pub'

import MapView from '../components/MapView'



function CreateCrawl() {


  const navigate = useNavigate()



  const [crawlName,setCrawlName] =

    useState('')



  const [locationInput,setLocationInput] =

    useState('')



  const [selectedLocation,setSelectedLocation] =

    useState<Location | null>(null)



  const [nearbyPubs,setNearbyPubs] =

    useState<Pub[]>([])



  const [selectedPubs,setSelectedPubs] =

    useState<Pub[]>([])



  const [loadingPubs,setLoadingPubs] =

    useState(false)





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


    <div style={styles.container}>


      <div style={styles.counter}>


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

                onClick={()=>removePub(pub.id)}

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

        onClick={handleSearchLocation}

      >

        Search Location

      </button>







      <br/><br/>






      <button

        style={styles.secondaryButton}

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

        loadingPubs &&


        <p>

          Finding pubs...

        </p>


      }









      {

        nearbyPubs.length > 0 &&


        <div style={styles.card}>


          <h3>

            Recommended Pubs

          </h3>





          {

            nearbyPubs.map(pub => (


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








      <button

        style={styles.button}

        onClick={createCrawl}

      >

        Create Crawl ({selectedPubs.length} pubs)

      </button>








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


    padding:'40px'


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


    zIndex:1000


  },



  counterPub:{


    fontSize:'12px',


    margin:'8px'


  },



  input:{


    display:'block',


    margin:'15px auto',


    padding:'12px',


    width:'300px'


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
