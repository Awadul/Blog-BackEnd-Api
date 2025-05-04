import multer from 'multer';
const userUpload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } })  // stores the uploaded-obtained file in the buffer - volatile memory

export default userUpload;  // instance of userUpload - handler middleware that can be placed in endpoint