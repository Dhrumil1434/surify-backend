import express from 'express';
import connectDB from './db/db_connect.js';
const app = express();

const PORT  = process.env.PORT || 3000;
connectDB();
app.get("/",(req,res)=>{
    
});
app.listen(PORT,()=> {
   console.log(`🗄️ server is running at  : http://localhost:${PORT}`);
});