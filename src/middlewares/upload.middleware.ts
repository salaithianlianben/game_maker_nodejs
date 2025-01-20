import multer from "multer";
import path from "path";
import fs from "fs";
import { fileUploadConfig } from "../config/uploadConfig";

const getStorage = (folderName: string) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.join(
        fileUploadConfig.uploadFolder,
        "images",
        folderName
      );

      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }

      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(
        null,
        file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
      );
    },
  });
};

const fileFilter = (
  req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (fileUploadConfig.allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type") as any, false);
  }
};

export const dynamicUpload = (folderName: string) => {
  return multer({
    storage: getStorage(folderName),
    fileFilter,
    limits: { fileSize: fileUploadConfig.fileSizeLimit },
  });
};
