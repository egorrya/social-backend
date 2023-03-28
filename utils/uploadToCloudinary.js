import cloudinary from 'cloudinary';
import { promisify } from 'util';

const uploadToCloudinary = promisify(cloudinary.v2.uploader.upload);

export default uploadToCloudinary;
