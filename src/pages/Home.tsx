import { Link } from 'react-router-dom'

function Home() {
  return (
    <div>
      <h1>Pub Crawl 🍻</h1>

      <p>
        Plan the perfect pub crawl with your friends.
      </p>

      <Link to="/create">
        Create Crawl
      </Link>

      <br />

      <Link to="/join">
        Join Crawl
      </Link>
    </div>
  )
}

export default Home