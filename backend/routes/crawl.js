import express from "express"

import {
  getWalkingDistances
} from "../services/walkingDistance.js"



const router = express.Router()



router.post(

  "/distance",

  async (req,res)=>{


    try {


      const {

        pubs

      } = req.body




      const distances =

        await getWalkingDistances(

          pubs

        )



      res.json(

        distances

      )


    }


    catch(error) {


      console.error(error)



      res.status(500).json({

        error:

          "Unable to calculate walking distances"

      })


    }


  }

)



export default router
