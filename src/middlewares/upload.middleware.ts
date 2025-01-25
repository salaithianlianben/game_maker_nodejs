import multer from "multer";
import path from "path";
import fs from "fs";
import { fileUploadConfig } from "../config/uploadConfig";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { ErrorResponse } from "../types/ApiResponse";

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
      cb(null, uniqueSuffix + path.extname(file.originalname));
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

export const dynamicMemoryUpload = () => {
  return multer({
    storage: multer.memoryStorage(),
    fileFilter,
    limits: { fileSize: fileUploadConfig.fileSizeLimit },
  });
};

export const saveFile = (folderName: string) =>  {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.file) {
      next();
      return;
    }

    const uploadPath = path.join(
      fileUploadConfig.uploadFolder,
      "images",
      folderName
    );

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(req.file.originalname)}`;

    const fullPath = path.join(uploadPath, fileName);

    try {
      fs.writeFileSync(fullPath, req.file.buffer);
      req.file.path = fullPath;

      next();
    } catch (error: any) {
      res
        .status(500)
        .json({
          message: "Failed to save the file",
          error: error.message,
          status: "fail",
          data: null,
        } as ErrorResponse);
      return;
    }
  };
};

const ensureFileUploaded =
  (fieldName: string): RequestHandler =>
  (req: Request, res: Response, next: NextFunction): void => {
    if (!req.file || req.file.fieldname !== fieldName) {
      res.status(400).json({
        message: `${fieldName} is required`,
        status: "fail",
        data: null,
      } as ErrorResponse);
      return;
    }
    next();
  };

export { ensureFileUploaded };
