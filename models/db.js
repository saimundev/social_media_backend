import mongoose from "mongoose"
const dbConnect = async ()=>{
    try {
        await mongoose.connect(process.env.DB_CONNECT)
        console.log("Database connect successful")
    } catch (error) {
        console.log(error.message)
    }
}

export default dbConnect;