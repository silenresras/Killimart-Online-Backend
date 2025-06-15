import cloudinary from '../utils/cloudinary.js';
import multer from 'multer';

// Use multer to handle form-data (multipart)
const storage = multer.memoryStorage(); // we’ll upload from buffer
const upload = multer({ storage });

export const uploadImage = async (req, res) => {
  try {
    const fileStr = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

    const uploadedResponse = await cloudinary.uploader.upload(fileStr, {
      folder: 'your-folder-name',
    });

    res.status(200).json({ imageUrl: uploadedResponse.secure_url });
  } catch (err) {
    console.error("Cloudinary Upload Error:", err);
    res.status(500).json({ error: 'Image upload failed' });
  }
};

export { upload };
