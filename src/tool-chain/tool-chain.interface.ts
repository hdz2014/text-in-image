import { ExportType, ITextInfo } from "./options";

export interface IToolChain {
  loadSrc: (
    src: string | HTMLImageElement | (string | HTMLImageElement)
  ) => IToolChain;
  markText: (mark: ITextInfo) => IToolChain;
  markOpacity: (opacity: number) => IToolChain;
  getImage: (
    type?: ExportType,
    quality?: number,
    size?: { width?: number, height?: number }
  ) => Promise<string | HTMLCanvasElement>;
}
