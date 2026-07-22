import { Inject, Injectable } from '@nestjs/common';
import toStream from 'buffer-to-stream';
import { UploadApiErrorResponse, UploadApiResponse, v2 as Cloudinary } from 'cloudinary';
import cloudinary from './cloudinary.provider';


@Injectable()
export class CloudinaryService {
    constructor(@Inject('CLOUDINARY') private readonly cloudinary: typeof Cloudinary) {}
    async uploadImage(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    // console.log(this.cloudinary)
    return new Promise((resolve, reject) => {
      const upload = this.cloudinary.uploader.upload_stream((error: Error, result: UploadApiResponse) => {
        if (error) {
          console.log('cloudinary error => ' + error.message)
        return reject(error);
      }
        resolve(result as UploadApiResponse);
      });
    
      toStream(file.buffer).pipe(upload);
    });
  }

  async uploadSingleImage (file: Express.Multer.File): Promise<Object> {
    const result = await this.uploadImage(file)
    return { 
      secure_url: result.secure_url,
      public_id: result.public_id }
  }

  async deleteImage (public_id: string) {
    const deletedImage = await cloudinary.uploader.destroy(public_id);
    return deletedImage;
  }
}
