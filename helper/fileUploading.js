import fs from "fs/promises";
import { join } from "path";
import { SERVER_BASE_URL } from "../config/env.js";

const isValidURL = (string) => {
  var res = string.match(
    /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
  );
  return res !== null;
};

export const handleFile = async (imageData, file) => {
  const imageBuffer = Buffer.from(imageData, "base64");
  const timestamp = Date.now();
  const filename = `${file}_${timestamp}.jpg`;
  const imagePath = join(process.cwd(), "uploads", file, filename);
  await fs.writeFile(imagePath, imageBuffer);
  const imageUrl = `${SERVER_BASE_URL}/uploads/${file}/${filename}`;
  return imageUrl;
};
export const handleMultiFile = async (imageData, file) => {
  const imageArray = [];
  for (let i = 0; i < imageData.length; i++) {
    var imageBaseCode = imageData[i];
    const isUrl = isValidURL(imageBaseCode);
    if (isUrl) {
      imageArray.push(imageBaseCode);
    } else {
      var imageBuffer = Buffer.from(imageBaseCode, "base64");
      var timestamp = Date.now();
      var filename = `${file}_${timestamp}.jpg`;
      var imagePath = join(process.cwd(), "uploads", file, filename);
      await fs.writeFile(imagePath, imageBuffer);
      var imageUrl = `${SERVER_BASE_URL}/uploads/${file}/${filename}`;
      imageArray.push(imageUrl);
    }
  }
  return imageArray;
};

export const handleFileRemove = async (imageUrl, file) => {
  const imageName = imageUrl.split("/").slice(-1)[0];
  const imagePath = join(process.cwd(), "uploads", file, imageName);
  await fs.unlink(imagePath);
};
