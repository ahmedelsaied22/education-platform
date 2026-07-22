import { Readable } from 'stream';
import cloudinary from './multer.provider'

export const uploadFromBuffer = async (
  file: Express.Multer.File,
): Promise<any> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'courses' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      },
    )
    //  .end(file.buffer); 
    Readable.from(file.buffer).pipe(stream);
  });
};

export const UploadImage = async ({ file }: { file: any }) => {
    console.log(cloudinary.config())
        // const { secure_url, public_id } = await cloudinary.uploader.upload(file);
        return await uploadFromBuffer(file)
    }
