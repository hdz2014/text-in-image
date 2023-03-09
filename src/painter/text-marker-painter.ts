import { ITextInfo, ITextMarkOptions } from "../tool-chain/options";
import { BasePainter } from "./base-painter";
import { getTextWidth, getImageWidth } from "../utils/draw";

interface ITextMarkPainter {
  markText: (texts: ITextInfo[]) => HTMLCanvasElement;
}
export class TextMarkerPainter extends BasePainter implements ITextMarkPainter {
  private srcArray: HTMLImageElement;
  private painterOptions: ITextMarkOptions;

  constructor(srcArray: HTMLImageElement, painterOptions: ITextMarkOptions) {
    super();
    this.srcArray = srcArray;
    this.painterOptions = painterOptions;
  }

  public markText(texts: ITextInfo[]) {
    // Set general mark callback
    const getItemWidthFunc = getTextWidth;
    const args = texts;

    // Go into general mark
    return this.generalMark<ITextInfo>(
      texts,
      { getItemWidthFunc, args },
      this.drawTextAtPosition
    );
  }

  private generalMark<T>(
    items: T[],
    getItemWidth: {
      getItemWidthFunc: (item: T, ...args: any) => number | undefined;
      args: any[];
    },
    drawItemFunc: any
  ) {
    // Get meta info array
    const metaInfo = this.generateMetaInfo(this.srcArray);

    // Get item width array
    const { getItemWidthFunc, args } = getItemWidth;
    const undefinedItemIndexMap = new Set();
    const itemWidthArray = items
      .map((item) => {
        return getItemWidthFunc(item, ...args);
      })
      .filter((val, index) => {
        if (val === undefined) {
          undefinedItemIndexMap.add(index);
          return false;
        }
        return true;
      }) as number[];
    items = items.filter((val, index) => !undefinedItemIndexMap.has(index));

    // Mark Item
    items.forEach((item, index) => {
      // Set context
      this.setContextProperty(metaInfo.ctx, this.painterOptions, index);
      // Mark text
      drawItemFunc(metaInfo.ctx, item, itemWidthArray[index]);
    });

    // Return canvas list
    return metaInfo.canvas;
  }
}
