export interface Location {
  latitude: number
  longitude: number
  name?: string
  source?: 'search' | 'gps' | 'crawl'
}
