import sharp, { AvailableFormatInfo, FitEnum, ResizeOptions, Color, fit as fitSharp, FormatEnum } from "sharp";
import { NextRequest, NextResponse } from "next/server";
import eliminateObjectFalseValue from "@/utils/objects/eliminateObjectFalseValue";
import { NumberString } from "@/types";

/**
 * MORE INFO https://sharp.pixelplumbing.com
 * TODO
 * 1. Research More Optimization. source https://sharp.pixelplumbing.com
 */

type RequestQuery = {
  url?: string;
  w?: NumberString;
  h?: NumberString;
  format?: AvailableFormatInfo;
  fit?: keyof FitEnum;
  bg?: string;
  q?: NumberString;
};


export async function GET(req: NextRequest) {
  const queryGet = (name: keyof RequestQuery) => {
    const query = req.nextUrl.searchParams;
    return query.get(name);
  };

  const format = (queryGet("format") ?? "webp") as keyof FormatEnum;
  const width = queryGet("w") ? Number(queryGet("w")) : null;
  const height = queryGet("h") ? Number(queryGet("h")) : null;
  const fit = (queryGet("fit") as keyof FitEnum) ?? fitSharp.contain;
  const quality = Number(queryGet("q") ?? 70);
  const background = (queryGet("bg") ?? "") as Color;
  
  if (!queryGet("url")) {
    return NextResponse.json({ message: "Query 'url' Required!" }, { status: 400 });
  }
  
  const response = await fetch(queryGet("url")!);
  const imageBuffer = await response.arrayBuffer();
  const transformer = sharp(imageBuffer)
    .resize(width, height, {
      fit,
      withoutEnlargement: true, // biar ga di upscale klo size aslinya lebih kecil dari height/width
      background: background, // background pas fit contain
    })
    .toFormat(format)
    .webp({ quality })
    .jpeg({ quality })
    .png({ quality })
    .avif({ quality });

  const transformedImage = await transformer.toBuffer();

  return new Response(transformedImage, {
    headers: {
      "Content-Type": `image/${format}`,
    },
  });
}