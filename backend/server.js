import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import path from "node:path"
import { fileURLToPath } from "node:url"

import pubsRouter from "./routes/pubs.js"
import crawlRouter from "./routes/crawl.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({
  path: path.resolve(__dirname, ".env")
})

dotenv.config({
  path: path.resolve(__dirname, "../.env")
})


const app = express()


app.use(cors())

app.use(express.json())


app.use(
  "/api/pubs",
  pubsRouter
)


app.use(
  "/api/crawl",
  crawlRouter
)


app.get(
  "/",
  (req, res) => {

    res.send(
      "Pub Crawl API running"
    )

  }
)


const PORT = 5000


app.listen(
  PORT,
  () => {

    console.log(
      `Server running on port ${PORT}`
    )

  }
)
