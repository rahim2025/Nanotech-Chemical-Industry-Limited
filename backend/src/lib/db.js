import mongoose from "mongoose";
export const connectDB = async ()=>{
  try{
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database connected:", mongoose.connection.name);
  }catch(e){
    console.log(e)
  }

};



