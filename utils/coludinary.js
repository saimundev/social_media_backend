import cloudinary from "cloudinary";
import * as dotenv from 'dotenv'
//env confige
dotenv.config()

const cloudinaryModul = cloudinary.v2;

cloudinaryModul.config({
    cloud_name: "saimun",
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})


export default cloudinaryModul;