import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();


// export const CloudinaryProvider = {
//     provide: 'CLOUDINARY',
//     useFactory: () => {
//         return v2.config({
//             secure: true,
//             cloud_name: process.env.CLOUD_NAME as string,
//             api_key: process.env.API_KEY as string,
//             api_secret: process.env.API_SECRET as string,
//         })
//     }
// }

cloudinary.config({
    secure: true,
        cloud_name: process.env.CLOUD_NAME as string,
        api_key: process.env.API_KEY as string,
        api_secret: process.env.API_SECRET as string,
})

export default cloudinary;