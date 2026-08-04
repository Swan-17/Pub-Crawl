export interface Pub {
  id: string
  name: string
  address: string
  latitude: number
  longitude: number
  rating?: number
  reviewCount?: number
  openingHours?: string[]
  photoUrl?: string
  website?: string
}
