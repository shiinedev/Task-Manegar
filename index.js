import express from 'express'
import helmet from 'helmet';
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import cors from "cors"
import morgan from 'morgan'
dotenv.config();
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './utils/swagger.js';




const PORT = process.env.PORT
const app = express();

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(limiter)
app.use(helmet())
app.use(express.json());

app.use(cors({
    origin:["http://localhost:5000/"]
}))
// app.use(logger)
if(process.env.NODE_ENV == "dev"){
    app.use(morgan("dev"))
}


import  studentRoutes from "./routes/students.js"
import authRoutes from './routes/auth.js'
import adminRoutes from './routes/admin.js'
import uploadRoutes from './routes/upload.js'
import taskRoutes from './routes//tasks.js'
import { logger } from './middlewares/logger.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFound } from './middlewares/notFound.js';
import { limiter } from './middlewares/rateLimit.js';

app.use("/students",studentRoutes)
app.use("/auth",authRoutes)
app.use("/admin",adminRoutes)
app.use("/upload",uploadRoutes)
app.use("/tasks",taskRoutes)

app.use(notFound)
app.use(errorHandler)

mongoose.connect(process.env.NODE_ENV == "dev"? process.env.MONGO_URI_DEV : process.env.PRO)
.then(()=> console.log("✅ mongoDb is connected to locally"))
.catch((err) => console.log("❌ connection error",err))


app.listen(PORT,()=>{
    console.log(`server is running on http://localhost:${PORT}`); 
})