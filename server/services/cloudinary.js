const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadBuffer = (buffer, folder = 'roadlink', resourceType = 'auto', isPrivate = true) => {
  return new Promise((resolve, reject) => {
    const uploadOptions = { 
      folder, 
      resource_type: resourceType,
      transformation: [
        { width: 1600, crop: "limit" },
        { quality: "auto" },
        { fetch_format: "auto" }
      ]
    };
    if (isPrivate) {
      uploadOptions.type = 'private'; // Enforce private access
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    uploadStream.end(buffer);
  });
};

const uploadPDFBuffer = (buffer, folder = 'roadlink/receipts', isPrivate = false) => {
  return new Promise((resolve, reject) => {
    const uploadOptions = { 
      folder, 
      resource_type: 'image', // Use image for PDFs to allow inline viewing
      format: 'pdf',
    };
    if (isPrivate) {
      uploadOptions.type = 'private';
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    uploadStream.end(buffer);
  });
};

const extractPublicId = (url) => {
  if (!url || !url.includes('cloudinary.com')) return null;
  try {
    const parts = url.split('/upload/');
    if (parts.length < 2) return null;
    
    let path = parts[1];
    const pathParts = path.split('/');
    if (pathParts[0].match(/^v\d+$/)) {
      pathParts.shift();
    }
    path = pathParts.join('/');
    
    const lastDot = path.lastIndexOf('.');
    if (lastDot !== -1) {
      path = path.substring(0, lastDot);
    }
    return path;
  } catch (e) {
    return null;
  }
};

const deleteResource = (publicId, resourceType = 'image') => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, { resource_type: resourceType, type: 'private' }, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
};

const getSignedUrl = (publicId) => {
  if (!publicId) return null;
  return cloudinary.url(publicId, { type: 'private', secure: true, sign_url: true });
};

module.exports = {
  cloudinary,
  uploadBuffer,
  uploadPDFBuffer,
  extractPublicId,
  deleteResource,
  getSignedUrl
};
