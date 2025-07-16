import cloudinary from '../utils/cloudinary.js';
import multer from 'multer';

// ✅ 1. Setup multer to use memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ 2. Update controller to handle multiple images
export const uploadImages = async (req, res) => {
  try {
    const uploadedUrls = [];

    for (const file of req.files) {
      const fileStr = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;

      const uploadedResponse = await cloudinary.uploader.upload(fileStr, {
        folder: 'your-folder-name',
      });

      uploadedUrls.push(uploadedResponse.secure_url);
    }

    res.status(200).json({ imageUrls: uploadedUrls }); // ✅ returns an array of image URLs
  } catch (err) {
    console.error("Cloudinary Upload Error:", err);
    res.status(500).json({ error: 'Image upload failed' });
  }
};

export { upload };
