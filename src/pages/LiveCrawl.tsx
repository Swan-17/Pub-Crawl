import { useParams, Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'

import {
  DndContext,
  closestCenter
} from '@dnd-kit/core'

import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable'

import {
  CSS
} from '@dnd-kit/utilities'


import MapView from '../components/MapView'

import {
  getCrawl,
  saveCrawl,
  startCrawl
} from '../services/crawlStorage'

import type { Pub } from '../types/pub'

import type { Location } from '../types/location'





function SortablePub({

  pub,

  index

}: {

  pub:Pub

  index:number

}) {


  const {

    attributes,

    listeners,

    setNodeRef,

    transform,

    transition

  } = useSortable({

    id:pub.id

  })



  const style = {


    transform:

      CSS.Transform.toString(transform),


    transition,


    padding:'15px',


    margin:'10px 0',


    border:'1px solid #ddd',


    borderRadius:'10px',


    background:'white'


  }





  return (


    <div

      ref={setNodeRef}

      style={style}

      {...attributes}

    >


      <span

        {...listeners}

        style={{

          cursor:'grab',

          marginRight:'15px',

          fontSize:'20px'

        }}

      >

        ☰

      </span>





      <strong>

        {index + 1}. {pub.name}

      </strong>



      <p>

        ⭐ {pub.rating ?? 'N/A'}

      </p>



      <p>

        {pub.address}

      </p>



      {

        pub.website && (

          <p>

            <a

              href={pub.website}

              target="_blank"

              rel="noreferrer"

            >

              Visit website

            </a>

          </p>

        )

      }


    </div>


  )

}







function LiveCrawl() {



  const { id } = useParams()
  const navigate = useNavigate()



  const crawl =

    id

    ?

    getCrawl(id)

    :

    null




  const [pubs,setPubs] =

    useState<Pub[]>(

      crawl?.pubs || []

    )

  const [localOrder, setLocalOrder] = useState<Pub[]>(crawl?.pubs || [])






  if(!crawl) {


    return (

      <div>

        <h1>

          Crawl not found

        </h1>


        <Link to="/create">

          Back to Create Crawl

        </Link>

      </div>

    )


  }







  function handleDragEnd(event: any) {


    const {

      active,

      over

    } = event



    if(!over) return




    if(active.id !== over.id) {


      setPubs((items)=>{


        const oldIndex =

          items.findIndex(

            item=>item.id===active.id

          )



        const newIndex =

          items.findIndex(

            item=>item.id===over.id

          )



        const reordered = arrayMove(

          items,

          oldIndex,

          newIndex

        ) as Pub[]

        setLocalOrder(reordered)

        return reordered


      })


    }


  }






  function handleStartCrawl() {
    if (!crawl || !id) {
      return
    }

    const updatedCrawl = getCrawl(id)

    if (!updatedCrawl) {
      return
    }

    updatedCrawl.pubs = localOrder.map((pub) => ({
      ...pub,
      visited: false,
      visitedBy: [],
      photos: [],
      comments: []
    }))

    saveCrawl(updatedCrawl)
    startCrawl(id)

    navigate(`/crawl/${id}/active`)
  }


  const startLocation:Location = {


    latitude:

      pubs[0].latitude,


    longitude:

      pubs[0].longitude,


    name:

      pubs[0].name,


    source:

      'crawl'


  }






  return (


    <div style={styles.container} className="live-crawl-page">


      <h1>

        🍻 {crawl.name}

      </h1>



      <p>

        Crawl Code:

        <strong>

          {' '}{crawl.code}

        </strong>

      </p>





      <h2>

        Route Map

      </h2>





      <MapView


        location={startLocation}


        pubs={pubs}

        showNumberedMarkers={true}


      />







      <div style={styles.card}>


        <h2>

          Pub Order

        </h2>





        <DndContext

          collisionDetection={closestCenter}

          onDragEnd={handleDragEnd}

        >


          <SortableContext

            items={pubs.map(

              pub=>pub.id

            )}

            strategy={

              verticalListSortingStrategy

            }

          >


            {

              pubs.map((pub,index)=>(


                <SortablePub


                  key={pub.id}


                  pub={pub}


                  index={index}


                />


              ))

            }


          </SortableContext>


        </DndContext>


      </div>






      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button style={styles.button} onClick={handleStartCrawl}>
          Start Crawl
        </button>

        <Link to="/create">
          Back to Create Crawl
        </Link>
      </div>


    </div>


  )

}






const styles = {


  container:{

    textAlign:'center' as const,

    padding:'40px',

    maxWidth:'1100px',

    margin:'0 auto'

  },

  button:{
    padding:'10px 20px',
    background:'#1f7a4d',
    color:'white',
    border:'none',
    borderRadius:'8px',
    cursor:'pointer'
  },


  card:{

    margin:'30px auto',

    maxWidth:'600px',

    padding:'20px',

    border:'1px solid #ddd',

    borderRadius:'12px'

  }


}





export default LiveCrawl
