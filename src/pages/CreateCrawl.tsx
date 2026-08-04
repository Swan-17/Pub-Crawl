import { useState } from 'react'
import { Link } from 'react-router-dom'
import { searchLocation } from '../services/locationSearch'
import type { Location } from '../types/location'
import MapView from '../components/MapView'


function CreateCrawl() {

  const [crawlName, setCrawlName] = useState('')
  const [numberOfPubs, setNumberOfPubs] = useState(5)

  const [locationInput, setLocationInput] = useState('')
  const [selectedLocation, setSelectedLocation] =
    useState<Location | null>(null)

  const [crawlCode, setCrawlCode] = useState('')


  async function handleSearchLocation() {

    if (!locationInput) {
      alert('Please enter a location')
      return
    }

    const result = await searchLocation(locationInput)

    if (result) {

      setSelectedLocation({
        ...result,
        source: 'search'
      })

    } else {

      alert('Location not found')

    }

  }


  function useCurrentLocation() {

    navigator.geolocation.getCurrentPosition(

      (position) => {

        setSelectedLocation({

          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          name: 'Current location',
          source: 'gps'

        })

      },

      () => {

        alert('Unable to access your location')

      }

    )

  }


  function createCrawl() {

    const code =
      Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase()

    setCrawlCode(code)

  }


  return (

    <div style={styles.container}>


      <h1>
        🍻 Create Pub Crawl
      </h1>


      <p>
        Plan your route, choose pubs and invite friends.
      </p>



      <div style={styles.card}>

        <h2>
          Crawl Details
        </h2>


        <input
          style={styles.input}
          placeholder="Crawl name"
          value={crawlName}
          onChange={(e) =>
            setCrawlName(e.target.value)
          }
        />


        <input
          style={styles.input}
          type="number"
          min="1"
          placeholder="Number of pubs"
          value={numberOfPubs}
          onChange={(e) =>
            setNumberOfPubs(
              Number(e.target.value)
            )
          }
        />


      </div>




      <div style={styles.card}>

        <h2>
          📍 Starting Point
        </h2>


        <input
          style={styles.input}
          placeholder="City, postcode or address"
          value={locationInput}
          onChange={(e) =>
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


        <button
          style={styles.darkButton}
          onClick={useCurrentLocation}
        >
          📍 Use My Location
        </button>



        {
          selectedLocation && (

            <div>

              <div style={styles.locationBox}>

                <h3>
                  {selectedLocation.name}
                </h3>


                <p>
                  Location selected
                </p>


              </div>


              <MapView
                location={selectedLocation}
              />

            </div>

          )
        }


      </div>




      <button
        style={styles.createButton}
        onClick={createCrawl}
      >
        Create Crawl 🍺
      </button>




      {
        crawlCode && (

          <div style={styles.card}>

            <h2>
              Crawl Created 🎉
            </h2>


            <p>
              Share this code with your friends:
            </p>


            <h1>
              {crawlCode}
            </h1>


            <Link
              to={`/crawl/${crawlCode}`}
            >
              Open Crawl
            </Link>


          </div>

        )
      }



      <br />


      <Link to="/">
        ← Back Home
      </Link>


    </div>

  )

}



const styles = {

  container: {

    maxWidth: '900px',
    margin: '0 auto',
    padding: '40px',
    textAlign: 'center' as const

  },


  card: {

    background: '#ffffff',
    padding: '25px',
    margin: '25px 0',
    borderRadius: '16px',
    boxShadow:
      '0 4px 15px rgba(0,0,0,0.12)'

  },


  input: {

    display: 'block',
    width: '80%',
    maxWidth: '400px',
    margin: '15px auto',
    padding: '14px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '16px'

  },


  button: {

    padding: '12px 20px',
    margin: '8px',
    background: '#1f7a4d',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer'

  },


  darkButton: {

    padding: '12px 20px',
    margin: '8px',
    background: '#333',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer'

  },


  createButton: {

    padding: '16px 35px',
    background: '#d97706',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '18px',
    cursor: 'pointer'

  },


  locationBox: {

    margin: '20px',
    padding: '15px',
    borderRadius: '10px',
    background: '#f3f4f6'

  }

}


export default CreateCrawl
 