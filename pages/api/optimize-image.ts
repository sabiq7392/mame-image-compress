/* eslint-disable no-useless-catch */
import type { NextApiRequest, NextApiResponse } from "next";
import sharp, { AvailableFormatInfo, FitEnum } from "sharp";
import axios from "axios";

/**
 * MORE INFO https://sharp.pixelplumbing.com
 * TODO
 * 1. Research More Optimization. source https://sharp.pixelplumbing.com
 */

type ResponseData = {
  message: string;
};

type RequestQuery = {
  url: string;
  width: number;
  height: number;
  format: AvailableFormatInfo;
  fit: keyof FitEnum;
  background: string;
  quality: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  const query = req.query as Partial<RequestQuery>;
  const format = query.format ?? "webp";
  const width = query.width ? Number(query.width) : null;
  const height = query.height ? Number(query.height) : null;
  const fit = query.fit ?? sharp.fit.contain;
  const quality = Number(query.quality ?? 70);

  if (!query.url) {
    return res.status(400).json({ message: "Query 'url' Required!" });
  }

  const imageData = await fetchImage({ url: query.url });

  const sharpStream = sharp(imageData)
    .resize(width, height, {
      fit,
      withoutEnlargement: true, // biar ga di upscale klo size aslinya lebih kecil dari height/width
      background: query.background, // background pas fit contain
    })
    .toFormat(format)
    .webp({ quality })
    .jpeg({ quality })
    .png({ quality })
    .avif({ quality });

  res.setHeader("Content-Type", `image/${format}`);
  sharpStream.pipe(res);
}

async function fetchImage(props: { url: string }) {
  try {
    const response = await axios.get(props.url, {
      responseType: "arraybuffer",
    });

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(
        `Failed to fetch image. Status: ${response.status}. url: ${props.url}`,
      );
    }
  } catch (error) {
    throw error;
  }
}