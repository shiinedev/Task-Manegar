import express from 'express'
import helmet from 'helmet';
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import cors from "cors"
import morgan from 'morgan'
import path from 'path'
import { fileURLToPath } from 'url';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './utils/swagger.js';
import authRoutes from './routes/auth.js'
import adminRoutes from './routes/admin.js'
import uploadRoutes from './routes/upload.js'
import taskRoutes from './routes//tasks.js'
import { errorHandler } from './middlewares/errorHandler.js';
import { notFound } from './middlewares/notFound.js';
import { limiter } from './middlewares/rateLimit.js';


dotenv.config();


const PORT = process.env.PORT
const app = express();

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(limiter)
app.use(helmet())
app.use(express.json());

app.use(cors({
    origin:["http://localhost:5000/","http://localhost:5173","https://mongodb-production-gcm2.onrender.com"]
}))
// app.use(logger)
if(process.env.NODE_ENV == "development"){
    app.use(morgan("dev"))
}



// app.use("/api/health",(req,res) => {
//    res.send("server is running") ;
// })

app.use("/api/auth",authRoutes)
app.use("/api/admin",adminRoutes)
app.use("/api/upload",uploadRoutes)
app.use("/api/tasks",taskRoutes)

// frontend production
if(process.env.NODE_ENV === "pro") {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    
    app.use(express.static(path.join(__dirname, "../frontend/dist")));


    /// routes

    app.get(/.*/, (req,res) =>{
        res.send(path.join(__dirname,'..', 'frontend', 'dist',  'index.html'));
    })
}


//Errors
app.use(notFound);
app.use(errorHandler);


mongoose.connect(process.env.NODE_ENV == "development"? process.env.MONGO_URI_DEV : process.env.MONGO_URI_PRO)




app.listen(PORT,()=>{

})