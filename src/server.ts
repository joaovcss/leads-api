import cors from "cors"
import express from "express"
import { errorHandlerMiddleware } from "./middlewares/error-handler.js"
import { router } from "./routes.ts"

const app = express()

app.use(cors())
app.use(express.json())
app.use("/api", router)
app.use(errorHandlerMiddleware) 

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`server initialized in http://localhost:${PORT}`))