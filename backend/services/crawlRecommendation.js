function calculateVenueScore(venue) {


  let score = 0



  // Rating score (maximum 40)

  if (venue.rating) {

    score += venue.rating * 8

  }



  // Popularity score (maximum 20)

  if (venue.reviewCount) {

    if (venue.reviewCount > 2000) {

      score += 20

    }

    else if (venue.reviewCount > 1000) {

      score += 15

    }

    else if (venue.reviewCount > 500) {

      score += 10

    }

    else {

      score += 5

    }

  }



  // Food availability

  if (

    venue.types?.includes('restaurant') ||

    venue.types?.includes('food')

  ) {

    score += 15

  }



  // Pub suitability

  if (

    venue.types?.includes('pub')

  ) {

    score += 15

  }



  // Late opening

  const hours =
    venue.openingHours || []



  const opensLate =
    hours.some(hour =>

      hour.includes('11') ||

      hour.includes('12:00') ||

      hour.includes('1:00')

    )



  if (opensLate) {

    score += 10

  }



  return Math.round(score)

}





function recommendCrawl(

  venues,

  numberOfPubs

) {


  const scoredVenues = venues.map(

    venue => ({


      ...venue,


      crawlScore:

        calculateVenueScore(venue)


    })

  )



  return scoredVenues

    .sort(

      (a,b) =>

        b.crawlScore -

        a.crawlScore

    )

    .slice(

      0,

      numberOfPubs

    )


}





module.exports = {

  recommendCrawl

}
