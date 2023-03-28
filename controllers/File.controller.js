import cloudinary from 'cloudinary';
import fs from 'fs/promises';

import uploadToCloudinary from '../utils/uploadToCloudinary.js';

export const uploadFile = async (req, res) => {
	try {
		const result = await uploadToCloudinary(req.file.path);
		await fs.unlink(req.file.path);
		res
			.status(201)
			.json({ url: result.secure_url, publicId: result.public_id });
	} catch (error) {
		res.status(500).json({ error: 'Error uploading the file' });
	}
};

export const deleteFile = async (req, res) => {
	try {
		const { publicId } = req.params;

		await cloudinary.v2.uploader.destroy(publicId);

		res.status(200).json({ message: 'File deleted successfully' });
	} catch (error) {
		res.status(500).json({ error: 'Error deleting the file' });
	}
};
