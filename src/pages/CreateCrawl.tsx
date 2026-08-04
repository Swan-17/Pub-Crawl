import { useState } from 'react'
import { Link } from 'react-router-dom'

function CreateCrawl() {
  const [crawlName, setCrawlName] = useState('')
  const [location, setLocation] = useState('')
  const [numberOfPubs, setNumberOfPubs] = useState(5)
  const [created, setCreated] = useState(false)

  function handleCreateCrawl() {
    setCreated(true)
  }

  return (
    <div>
      <h1>Create Crawl 🍻</h1>

      <label>
        Crawl name:
      </label>

      <br />

      <input
        type="text"
        value={crawlName}
        onChange={(event) => setCrawlName(event.target.value)}
      />

      <br /><br />

      <label>
        Starting location:
      </label>

      <br />

      <input
        type="text"
        value={location}
        onChange={(event) => setLocation(event.target.value)}
      />

      <br /><br />

      <label>
        Number of pubs:
      </label>

      <br />

      <input
        type="number"
        value={numberOfPubs}
        onChange={(event) =>
          setNumberOfPubs(Number(event.target.value))
        }
      />

      <br /><br />

      <button onClick={handleCreateCrawl}>
        Create Crawl
      </button>

      <hr />

      <h3>Current Details</h3>

      <p>
        Crawl name: {crawlName}
      </p>

      <p>
        Starting location: {location}
      </p>

      <p>
        Number of pubs: {numberOfPubs}
      </p>

      {created && (
        <div>
          <h2>
            Crawl created! 🎉
          </h2>

          <p>
            Your crawl "{crawlName}" has been planned.
          </p>

          <p>
            Starting at: {location}
          </p>

          <p>
            Pubs planned: {numberOfPubs}
          </p>
        </div>
      )}

      <br />

      <Link to="/">
        Back Home
      </Link>
    </div>
  )
}

export default CreateCrawl 