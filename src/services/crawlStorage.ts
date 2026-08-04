import type { Pub } from '../types/pub'



export interface CrawlParticipant {

  id:string

  name:string

  joinedAt:string

  latitude:number | null

  longitude:number | null

  isHost:boolean

}





export interface CrawlPub extends Pub {

  visited:boolean

  visitedBy:string[]

  photos:string[]

  comments:CrawlComment[]

}





export interface CrawlComment {

  id:string

  userId:string

  userName:string

  text:string

  createdAt:string

}





export type CrawlStatus =

  | 'lobby'

  | 'active'

  | 'finished'





export interface CrawlData {


  code:string


  name:string


  status:CrawlStatus


  hostId:string


  participants:CrawlParticipant[]


  pubs:CrawlPub[]


  createdAt:string


}





export function saveCrawl(

  crawl:CrawlData

) {


  localStorage.setItem(

    `crawl-${crawl.code}`,

    JSON.stringify(crawl)

  )


}






export function getCrawl(

  code:string

):CrawlData | null {


  const data =

    localStorage.getItem(

      `crawl-${code}`

    )



  if(!data) {


    return null


  }



  return JSON.parse(data)


}






export function updateCrawl(

  crawl:CrawlData

) {


  saveCrawl(crawl)


}






export function joinCrawl(

  code:string,

  participant:CrawlParticipant

):CrawlData | null {


  const crawl =

    getCrawl(code)



  if(!crawl) {


    return null


  }



  crawl.participants.push(

    participant

  )



  saveCrawl(crawl)



  return crawl


}






export function startCrawl(

  code:string

):CrawlData | null {


  const crawl =

    getCrawl(code)



  if(!crawl) {


    return null


  }



  crawl.status =

    'active'



  saveCrawl(crawl)



  return crawl


}






export function markPubVisited(

  code:string,

  pubId:string,

  userId:string

):CrawlData | null {


  const crawl =

    getCrawl(code)



  if(!crawl) {


    return null


  }



  const pub =

    crawl.pubs.find(

      item =>

        item.id === pubId

    )



  if(pub) {


    pub.visited = true



    if(

      !pub.visitedBy.includes(

        userId

      )

    ) {


      pub.visitedBy.push(

        userId

      )


    }


  }



  saveCrawl(crawl)



  return crawl


}
