import { Link } from 'react-router-dom'

function Home() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🍻 Pub Crawl</h1>

      <p style={styles.subtitle}>
        Plan, share and enjoy the perfect pub crawl with friends.
      </p>

      <div style={styles.buttonContainer}>
        <Link to="/create" style={styles.button}>
          Create Crawl
        </Link>

        <Link to="/join" style={styles.buttonSecondary}>
          Join Crawl
        </Link>
      </div>
    </div>
  )
}

const styles = {
  container: {
    textAlign: 'center' as const,
    padding: '40px',
    fontFamily: 'Arial, sans-serif',
  },

  title: {
    fontSize: '48px',
  },

  subtitle: {
    fontSize: '20px',
    marginBottom: '30px',
  },

  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
  },

  button: {
    background: '#1f7a4d',
    color: 'white',
    padding: '12px 25px',
    borderRadius: '8px',
    textDecoration: 'none',
  },

  buttonSecondary: {
    background: '#444',
    color: 'white',
    padding: '12px 25px',
    borderRadius: '8px',
    textDecoration: 'none',
  },
}

export default Home
  