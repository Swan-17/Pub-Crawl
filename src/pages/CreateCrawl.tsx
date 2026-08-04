import { useState } from 'react'
import { Link } from 'react-router-dom'

function CreateCrawl() {
  const [crawlName, setCrawlName] = useState('')
  const [location, setLocation] = useState('')
  const [numberOfPubs, setNumberOfPubs] = useState(5)
  const [crawlCode, setCrawlCode] = useState('')

  function createCrawl() {
    const code = Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase()

    setCrawlCode(code)
  }

  return (
    <div style={styles.container}>

      <h1>🍻 Create Crawl</h1>

      <input
        style={styles.input}
        placeholder="Crawl name"
        value={crawlName}
        onChange={(e) => setCrawlName(e.target.value)}
      />

      <input
        style={styles.input}
        placeholder="Starting location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />

      <input
        style={styles.input}
        type="number"
        value={numberOfPubs}
        onChange={(e) =>
          setNumberOfPubs(Number(e.target.value))
        }
      />

      <button
        style={styles.button}
        onClick={createCrawl}
      >
        Create Crawl
      </button>


      {crawlCode && (
        <div style={styles.card}>

          <h2>Crawl Created 🎉</h2>

          <p>
            Invite code:
          </p>

          <strong style={styles.code}>
            {crawlCode}
          </strong>

          <p>
            Share this code with friends.
          </p>

          <Link to={`/crawl/${crawlCode}`}>
            Open Crawl
          </Link>

        </div>
      )}


      <br />

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

  input:{
    display:'block',
    margin:'15px auto',
    padding:'12px',
    width:'300px',
    borderRadius:'8px'
  },

  button:{
    padding:'12px 30px',
    background:'#1f7a4d',
    color:'white',
    border:'none',
    borderRadius:'8px',
    cursor:'pointer'
  },

  card:{
    marginTop:'30px',
    padding:'20px',
    border:'1px solid #ddd',
    borderRadius:'10px'
  },

  code:{
    fontSize:'30px'
  }
}


export default CreateCrawl
