import cors from "cors"
import express from "express"
import { errorHandlerMiddleware } from "./middlewares/error-handler.js"

const app = express()

app.use(cors())
app.use(errorHandlerMiddleware)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`server initialized in http://localhost:${PORT}`))