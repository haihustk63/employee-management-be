import { v2 as cloudinary } from "cloudinary";
import { cloudinaryKey, cloudinaryName, cloudinarySecret } from ".";
import fs from "fs";
import { transformFileName } from "@utils/index";

cloudinary.config({
  api_key: cloudinaryKey,
  api_secret: cloudinarySecret,
  cloud_name: cloudinaryName,
});

const uploadCloud = {
  normal: async ({ file, folder }: any) => {
    const result = await cloudinary.uploader.upload(file.path, {
      folder,
      public_id: transformFileName(file.originalname) + Date.now().toString(),
    });
    fs.unlinkSync(file.path);
    return { url: result.secure_url };
  },

  useConvert: async ({ file, folder }: any) => {
    const result = await cloudinary.uploader.upload(file.path, {
      folder,
      public_id: transformFileName(file.originalname) + Date.now().toString(),
      resource_type: "raw",
      raw_convert: "aspose",
    });
    fs.unlinkSync(file.path);
    return { url: result.secure_url };
  },
};

export default uploadCloud;
