import { v2 as cloudinary } from 'cloudinary';

export const CLOUDINARY = 'CLOUDINARY'

export const CloudinaryProvider = {
  provide: CLOUDINARY,
  useFactory: () => {
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME as string,
      api_key: process.env.API_KEY as string,
      api_secret: process.env.API_SECRET as string,
    });
    return cloudinary;
  },
};

export default cloudinary;