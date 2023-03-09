import { BaseToolChains } from "./base-tool-chains";
import { IToolChain } from "./tool-chain.interface";
import { ImageLoader } from "../image/image-loader";
import { ImageExporter } from "../image/image-exporter";
import { TextMarkerPainter } from "../painter/text-marker-painter";
import { preHandleArrayForm, preHandleExport } from "./pre-handle";
import {
  OptionType,
  ExportType,
  ITextInfo,
  ITextMarkOptions,
  defaultTextMarkOptions,
} from "./options";
import { mergeOptions } from "../utils/merge-options";

export class TextMark extends BaseToolChains<OptionType> implements IToolChain {
  private receivedOptions: Partial<ITextMarkOptions> = {};

  /**
   * Set source image
   * Receive a single source image or a array of images
   */
  public loadSrc(src: string | HTMLImageElement | (string | HTMLImageElement)) {
    const runFunc = () => {
      this.receivedOptions["srcImage"] = preHandleArrayForm(src);
    };
    return this.addIntoFuncArray(OptionType.LoadSrc, runFunc);
  }

  public markText(mark: ITextInfo) {
    const runFunc = () => {
      let value = this.receivedOptions["textInfos"];
      if (value === undefined) {
        this.receivedOptions["textInfos"] = [];
      }
      this.receivedOptions["textInfos"]!.push(mark);
    };
    return this.addIntoFuncArray(OptionType.AddTextInfo, runFunc);
  }

  public markOpacity(opacity: number) {
    const runFunc = () => {
      this.receivedOptions["markOpacity"] = opacity;
    };
    return this.addIntoFuncArray(OptionType.MarkOpacity, runFunc);
  }

  public async getImage(
    type?: ExportType,
    quality?: number,
    size?: { width?: number; height?: number }
  ) {
    // Handle received property
    this.addIntoFuncArray(OptionType.MarkOpacity, () => {
      this.receivedOptions["exportOptions"] = preHandleExport({
        type,
        quality,
        size,
      });
    });

    // Start load options and merge them with default options
    this.runNext();
    const mergedOptions = mergeOptions(
      defaultTextMarkOptions,
      this.receivedOptions
    );

    // Load source image
    const sourceImageArray: HTMLImageElement = (await ImageLoader.loadImage(
      mergedOptions.srcImage
    )) as HTMLImageElement;

    // Init water mark painter
    const canvasPainter = new TextMarkerPainter(
      sourceImageArray,
      mergedOptions
    );

    // Priority image > text
    let outputRes = canvasPainter.markText(mergedOptions.textInfos);

    return ImageExporter.export(outputRes, mergedOptions.exportOptions);
  }
}
