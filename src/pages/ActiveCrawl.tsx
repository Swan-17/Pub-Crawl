import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import MapView from '../components/MapView'
import { getCrawl, updateCrawl, markPubVisited } from '../services/crawlStorage'

import type { CrawlPub } from '../services/crawlStorage'
import type { Location } from '../types/location'


function ActiveCrawl() {
  const { id } = useParams()

  const crawl = id ? getCrawl(id) : null

  const [activePubs, setActivePubs] = useState<CrawlPub[]>(crawl?.pubs || [])
  const [liveLocation, setLiveLocation] = useState<Location | null>(null)
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({})
  const [photoDrafts, setPhotoDrafts] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!crawl) {
      return
    }

    setActivePubs(crawl.pubs)
  }, [crawl])

  useEffect(() => {
    if (!navigator.geolocation) {
      return
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setLiveLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          name: 'Your location',
          source: 'gps'
        })
      },
      () => {
        setLiveLocation(null)
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 10000
      }
    )

    return () => {
      navigator.geolocation.clearWatch(watchId)
    }
  }, [])

  const startLocation = useMemo<Location>(() => {
    if (liveLocation) {
      return liveLocation
    }

    const firstPub = activePubs[0]

    if (!firstPub) {
      return {
        latitude: 51.5072,
        longitude: -0.1276,
        name: 'London',
        source: 'crawl'
      }
    }

    return {
      latitude: firstPub.latitude,
      longitude: firstPub.longitude,
      name: firstPub.name,
      source: 'crawl'
    }
  }, [activePubs, liveLocation])

  if (!crawl) {
    return (
      <div style={styles.container}>
        <h1>Crawl not found</h1>
        <Link to="/create">Back to Create Crawl</Link>
      </div>
    )
  }

  function handleToggleVisited(pubId: string) {
    if (!crawl) {
      return
    }

    const updated = markPubVisited(crawl.code, pubId, crawl.hostId)

    if (!updated) {
      return
    }

    setActivePubs(updated.pubs)
  }

  function handleAddComment(pubId: string) {
    if (!crawl) {
      return
    }

    const message = (commentDrafts[pubId] || '').trim()

    if (!message) {
      return
    }

    const updated = getCrawl(crawl.code)

    if (!updated) {
      return
    }

    const pub = updated.pubs.find((item) => item.id === pubId)

    if (!pub) {
      return
    }

    pub.comments.push({
      id: crypto.randomUUID(),
      userId: crawl.hostId,
      userName: 'Host',
      text: message,
      createdAt: new Date().toISOString()
    })

    updateCrawl(updated)
    setActivePubs(updated.pubs)
    setCommentDrafts((current) => ({ ...current, [pubId]: '' }))
  }

  function handleAddPhoto(pubId: string) {
    if (!crawl) {
      return
    }

    const photoUrl = (photoDrafts[pubId] || '').trim()

    if (!photoUrl) {
      return
    }

    const updated = getCrawl(crawl.code)

    if (!updated) {
      return
    }

    const pub = updated.pubs.find((item) => item.id === pubId)

    if (!pub) {
      return
    }

    pub.photos.push(photoUrl)
    updateCrawl(updated)
    setActivePubs(updated.pubs)
    setPhotoDrafts((current) => ({ ...current, [pubId]: '' }))
  }

  return (
    <div style={styles.container} className="active-crawl-page">
      <h1>🍻 {crawl.name}</h1>
      <p>
        Crawl Code: <strong>{crawl.code}</strong>
      </p>

      <h2>Live Map</h2>

      <MapView
        location={startLocation}
        pubs={activePubs}
        showNumberedMarkers={true}
      />

      <div style={styles.card}>
        <h2>Pub Stops</h2>

        {activePubs.map((pub, index) => (
          <details key={pub.id} style={styles.details}>
            <summary style={styles.summary}>
              <strong>
                {index + 1}. {pub.name}
              </strong>
              <span style={styles.status}>
                {pub.visited ? '✓ Complete' : 'Open'}
              </span>
            </summary>

            <div style={styles.detailContent}>
              <p>⭐ {pub.rating ?? 'N/A'}</p>
              <p>{pub.address}</p>

              {pub.website && (
                <p>
                  <a href={pub.website} target="_blank" rel="noreferrer">
                    Visit website
                  </a>
                </p>
              )}

              <button style={styles.button} onClick={() => handleToggleVisited(pub.id)}>
                {pub.visited ? 'Mark as not complete' : 'Mark as complete'}
              </button>

              <div style={styles.feedSection}>
                <h3>Photo updates</h3>
                <input
                  style={styles.input}
                  placeholder="Paste photo URL"
                  value={photoDrafts[pub.id] || ''}
                  onChange={(event) =>
                    setPhotoDrafts((current) => ({
                      ...current,
                      [pub.id]: event.target.value
                    }))
                  }
                />
                <button style={styles.button} onClick={() => handleAddPhoto(pub.id)}>
                  Add photo
                </button>

                {pub.photos.length > 0 && (
                  <ul>
                    {pub.photos.map((photo, photoIndex) => (
                      <li key={`${pub.id}-photo-${photoIndex}`}>
                        <a href={photo} target="_blank" rel="noreferrer">
                          Photo {photoIndex + 1}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div style={styles.feedSection}>
                <h3>Comments</h3>
                <input
                  style={styles.input}
                  placeholder="Add a comment"
                  value={commentDrafts[pub.id] || ''}
                  onChange={(event) =>
                    setCommentDrafts((current) => ({
                      ...current,
                      [pub.id]: event.target.value
                    }))
                  }
                />
                <button style={styles.button} onClick={() => handleAddComment(pub.id)}>
                  Post comment
                </button>

                {pub.comments.length > 0 && (
                  <ul>
                    {pub.comments.map((comment) => (
                      <li key={comment.id}>
                        <strong>{comment.userName}</strong>
                        <div>{comment.text}</div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </details>
        ))}
      </div>

      <Link to="/create">Back to Create Crawl</Link>
    </div>
  )
}

const styles = {
  container: {
    textAlign: 'center' as const,
    padding: '40px',
    maxWidth: '1100px',
    margin: '0 auto'
  },
  card: {
    margin: '30px auto',
    maxWidth: '800px',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '12px'
  },
  details: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    margin: '12px 0',
    padding: '12px'
  },
  summary: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    cursor: 'pointer'
  },
  status: {
    fontSize: '12px',
    color: '#1f7a4d',
    fontWeight: 700
  },
  detailContent: {
    textAlign: 'left' as const,
    marginTop: '12px'
  },
  feedSection: {
    marginTop: '18px'
  },
  input: {
    display: 'block',
    width: '100%',
    margin: '10px 0',
    padding: '10px'
  },
  button: {
    padding: '10px 20px',
    background: '#1f7a4d',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer'
  }
}

export default ActiveCrawl
