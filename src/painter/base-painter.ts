import { ITextInfo, ITextMarkOptions } from "../tool-chain/options";

interface IPainterMetaInfo {
  width: number;
  height: number;
  img: HTMLImageElement;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
}

interface IPosition {
  x: number;
  y: number;
}

export class BasePainter {
  protected generateMetaInfo(src: HTMLImageElement): IPainterMetaInfo {
    // Get canvas and context
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas Context Create Failed");

    // Get width and height
    const { height, width } = src;
    canvas.width = width;
    canvas.height = height;

    // Draw the image on canvas
    ctx.drawImage(src, 0, 0);

    // Return meta info
    return {
      width,
      height,
      img: src,
      canvas,
      ctx,
    };
  }

  protected drawTextAtPosition(
    ctx: CanvasRenderingContext2D,
    item: ITextInfo,
    widthLen: number
  ) {
    //绘制文字信息
    const { left, top,right,bottom } = item.position;
    let x = 0;
    let y = 0;
    if (item.align === 'left'){
      x = left;
      y = top;
    }else if (item.align === 'middle'){
      let posWidth = right - left;
      let posHeight = bottom - top;
      x = left + posWidth/2 - widthLen/2;
      y = top + posHeight/2;
    }else if (item.align === 'right'){
      x = right - widthLen;
      y = top;
    }
    // Rotate
    ctx.translate(x,y);
    ctx.rotate(item.rotation * Math.PI /180 );

    ctx.fillText(item.text, 0, 0, widthLen);
    ctx.restore();
  }

  protected setContextProperty(
    ctx: CanvasRenderingContext2D,
    options: ITextMarkOptions,
    index: number
  ) {
    ctx.save();
    const markOpacity = options.markOpacity;
    const { color, font } = options.textInfos[index];

    // Set opacity
    ctx.globalAlpha = markOpacity;

    // Set color and font
    ctx.fillStyle = color!;
    ctx.font = font!;
  }
}
