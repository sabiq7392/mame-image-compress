/* eslint-disable @next/next/no-img-element */
import { DetailedHTMLProps, ImgHTMLAttributes } from "react";
import { AvailableFormatInfo } from "sharp";

/**
 * @TODO
 * 1. Research More Optimization. source https://sharp.pixelplumbing.com
 * 2. Buat jadi responsive width dan height
 * 3. Handle Error. mungkin bisa kasih placeholder atau image default yg lain (?)
 * 4. Handle Loading. Enaknnya kasih placeholder atau skeleton loading
 *
 * Make it Powerfull guys
 */

export interface ImageOptimizeProps {
  src: string;
  fit?: "cover" | "contain" | "fill" | "inside" | "outside";
  format?: AvailableFormatInfo;
  width?: number;
  height?: number;
  alt?: string;
  backround?: string;
  quality?: number;
  imgProps?: Omit<
  DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>,
  "src" | "alt"
  >;
}

/**
 * @description
 * result img ini distream dari originalnya jadi ga buat file baru pas otak-atik optimasi.
 * belum tau efek sampingnnya.
 * hampir mirip sama Next Image tpi pake ini kita bisa lebih leluasa otak-atik optimasinya.
 * optimasi ada di {/app/api/optimize-image}
 *
 */
export default function ImageOptimize(props: ImageOptimizeProps): JSX.Element {
  const { fit = "cover", format = "webp", quality = 70 } = props;
  let query = "";

  if (props.width) query += `&width=${props.width}`;
  if (props.height) query += `&height=${props.height}`;

  return (
    <img
      {...props.imgProps}
      src={`/api/optimize-image?url=${props.src}&fit=${fit}&format=${format}&quality=${quality}${query}`}
      alt={props.alt}
    />
  );
}