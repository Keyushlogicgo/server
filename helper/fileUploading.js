import fs from "fs/promises";
import { join } from "path";
import { SERVER_BASE_URL } from "../config/env.js";
import { fileTypeFromBuffer } from "file-type";

export const isValidURL = (string) => {
  var res = string.match(
    /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
  );
  return res !== null;
};

export const handleFile = async (imageData, file) => {
  const imageBuffer = Buffer.from(imageData, "base64");
  const { ext } = await fileTypeFromBuffer(imageBuffer);
  const fileExt = ext === "xml" ? "svg" : ext === "cfb" ? "xls" : ext;
  const timestamp = Date.now();
  const filename = `${file}_${timestamp}.${fileExt}`;
  const imagePath = join(process.cwd(), "uploads", file, filename);
  await fs.writeFile(imagePath, imageBuffer);
  const imageUrl = `${SERVER_BASE_URL}/uploads/${file}/${filename}`;
  return imageUrl;
};
export const handleMultiFile = async (imageData, file) => {
  const imageArray = [];
  for (let i = 0; i < imageData.length; i++) {
    var imageBaseCode = imageData[i];
    var imageBuffer = Buffer.from(imageBaseCode, "base64");
    var { ext } = await fileTypeFromBuffer(imageBuffer);
    var fileExt = ext === "xml" ? "svg" : ext === "cfb" ? "xls" : ext;
    var timestamp = Date.now();
    var filename = `${file}_${timestamp}.${fileExt}`;
    var imagePath = join(process.cwd(), "uploads", file, filename);
    await fs.writeFile(imagePath, imageBuffer);
    var imageUrl = `${SERVER_BASE_URL}/uploads/${file}/${filename}`;

    imageArray.push(imageUrl);
  }
  return imageArray;
};

export const handleFileRemove = async (imageUrl, file) => {
  const imageName = imageUrl.split("/").slice(-1)[0];
  const imagePath = join(process.cwd(), "uploads", file, imageName);
  await fs.unlink(imagePath);
};

export const handleMultiFileRemove = async (data, file) => {
  for (let i = 0; i < data.length; i++) {
    const imageUrl = data[i];
    const imageName = imageUrl.split("/").slice(-1)[0];
    const imagePath = join(process.cwd(), "uploads", file, imageName);
    if (imagePath) {
      await fs.unlink(imagePath);
    }
  }
};
