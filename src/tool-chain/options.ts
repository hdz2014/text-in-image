export enum OptionType {
  LoadSrc,
  MarkImage,
  AddTextInfo,
  MarkOpacity,
  Scale,
  GetImage,
}

export type ExportType = "canvas" | "png" | "jpeg" | "webp";

export interface ITextInfo {
  text: string;
  color?: string;
  font?: string;
  position: { left: number; top: number; right: number; bottom: number };
  rotation: number;
  align?: string; //left, middle, right
}

export interface IExportOptions {
  type: ExportType;
  quality: number;
  size?: {
    width?: number;
    height?: number;
  };
}

export interface ITextMarkOptions {
  srcImage: string | HTMLImageElement;
  textInfos: ITextInfo[];
  markOpacity: number;
  exportOptions: IExportOptions;
}

export const defaultTextMarkOptions: ITextMarkOptions = {
  srcImage: "",
  textInfos: [
    {
      text: "测试文字",
      color: "black",
      font: "bold 24px serif",
      position: { left: 0, top: 0, right: 300, bottom: 300 },
      rotation: 0,
      align: "middle",
    },
  ],
  markOpacity: 0.8,
  exportOptions: {
    type: "png",
    quality: 1,
  },
};
