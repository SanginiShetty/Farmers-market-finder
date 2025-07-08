import { S3Client } from "@aws-sdk/client-s3";
import multer from "multer";
import multerS3 from "multer-s3";
import dotenv from "dotenv";

dotenv.config({
    path: "./.env"
});

// Configure AWS SDK (v2)
const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

// Create a product image upload middleware
export const uploadProductImage = multer({
    storage: multerS3({
        s3,
        bucket: process.env.AWS_BUCKET_NAME,
        acl: "public-read",
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: (req, file, cb) => {
            const fileName = `products/${Date.now()}-${file.originalname}`;
            cb(null, fileName);
        }
    })
}).single("image");

// Keep the original profile upload for user profiles
export const upload = multer({
    storage: multerS3({
        s3,
        bucket: process.env.AWS_BUCKET_NAME,
        acl: "public-read",
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: (req, file, cb) => {
            const fileName = `profiles/${Date.now()}-${file.originalname}`;
            cb(null, fileName);
        }
    })
}).fields([
    { name: 'licenseDocument', maxCount: 1 }, // Expecting a field named "licenseDocument"
    { name: 'idProof', maxCount: 1 }, // Expecting a field named "idProof"
    { name: 'profile', maxCount: 1 } // Expecting a field named "profile"
]);

