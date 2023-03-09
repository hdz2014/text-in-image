declare class BaseToolChains<T> {
  private functionChainsArray;
  protected addIntoFuncArray(type: T, func: () => void): this;
  protected runNext(): void;
}

declare enum OptionType {
  LoadSrc,
  MarkImage,
  AddTextInfo,
  MarkOpacity,
  Scale,
  GetImage,
}

declare type ExportType = "canvas" | "png" | "jpeg" | "webp";

interface ITextInfo {
  text: string;
  color?: string;
  font?: string;
  position: { left: number; top: number; right: number; bottom: number };
  rotation: number;
  align?: string; //left, middle, right
}

interface IToolChain {
  loadSrc: (
    src: string | HTMLImageElement | (string | HTMLImageElement)
  ) => IToolChain;
  markText: (mark: ITextInfo) => IToolChain;
  markOpacity: (opacity: number) => IToolChain;
  getImage: (
    type?: ExportType,
    quality?: number,
    size?: { width?: number; height?: number }
  ) => Promise<string | HTMLCanvasElement>;
}

declare class TextMark
  extends BaseToolChains<OptionType>
  implements IToolChain
{
  private receivedOptions;

  loadSrc(src: string | HTMLImageElement | (string | HTMLImageElement)): this;
  markText(mark: ITextInfo): this;
  markOpacity(opacity: number): this;
  getImage(
    type?: ExportType,
    quality?: number,
    size?: { width?: number; height?: number }
  ): Promise<string | HTMLCanvasElement>;
}

export { TextMark };
