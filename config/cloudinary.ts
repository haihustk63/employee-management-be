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
    try {
      const result = await cloudinary.uploader.upload(file.path, {
        folder,
        public_id: transformFileName(file.originalname) + Date.now().toString(),
      });
      return { url: result.secure_url };
    } catch (e: any) {
      console.log(e);
      throw new Error();
    } finally {
      fs.unlinkSync(file.path);
    }
  },

  useConvert: async ({ file, folder }: any) => {
    try {
      const result = await cloudinary.uploader.upload(file.path, {
        folder,
        public_id: transformFileName(file.originalname) + Date.now().toString(),
        resource_type: "raw",
        raw_convert: "aspose",
      });
      return { url: result.secure_url };
    } catch (e: any) {
      console.log(e);
      throw new Error(e);
    } finally {
      fs.unlinkSync(file.path);
    }
  },
};

export default uploadCloud;
