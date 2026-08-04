import { useState } from 'react'
import { Link } from 'react-router-dom'

function CreateCrawl() {
  const [crawlName, setCrawlName] = useState('')
  const [location, setLocation] = useState('')
  const [numberOfPubs, setNumberOfPubs] = useState(5)
  const [crawlCode, setCrawlCode] = useState('')

  function generateCode() {
    const code = Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase()

    setCrawlCode(code)
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

      <button onClick={generateCode}>
        Create Crawl
      </button>

      {crawlCode && (
        <div>
          <hr />

          <h2>
            Crawl created! 🎉
          </h2>

          <p>
            Crawl name: {crawlName}
          </p>

          <p>
            Starting location: {location}
          </p>

          <p>
            Pubs planned: {numberOfPubs}
          </p>

          <h3>
            Invite Code:
          </h3>

          <strong>
            {crawlCode}
          </strong>
        </div>
      )}

      <br /><br />

      <Link to="/">
        Back Home
      </Link>
    </div>
  )
}

export default CreateCrawl
 