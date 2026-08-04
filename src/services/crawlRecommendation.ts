import type { Pub } from '../types/pub'


export async function getRecommendedCrawl(

  venues: Pub[],

  numberOfPubs: number

): Promise<Pub[]> {


  const response = await fetch(

    'http://localhost:5000/api/pubs/recommend',

    {

      method: 'POST',

      headers: {

        'Content-Type':
          'application/json'

      },

      body: JSON.stringify({

        venues,

        numberOfPubs

      })

    }

  )



  if (!response.ok) {


    throw new Error(

      'Unable to generate crawl recommendations'

    )


  }



  const recommendations: Pub[] =

    await response.json()



  return recommendations


}
