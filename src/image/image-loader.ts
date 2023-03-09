import { isBrowser, isNode } from "../utils/env";

export class ImageLoader {
  public static async loadImage(src: (string | HTMLImageElement) | undefined) {
    if (src === undefined) throw Error("No Image Load");

    if (isBrowser()) {
      return ImageLoader.browserLoad(src);
    }

    if (isNode()) {
      return ImageLoader.nodeLoad(src);
    }

    throw Error("Unknown Environment!");
  }

  /**
   *
   * @param src 图片参数路径或Base64都可 | DOM元素
   * @returns promise<HTMLImageElement>
   */
  private static async browserLoad(src: string | HTMLImageElement) {
    const loadPromiseArray: Promise<HTMLImageElement>[] = [];

    return new Promise((resolve, reject) => {
      if (src instanceof Image) {
        resolve(src);
      } else {
        const img = new Image();
        img.onload = () => {
          resolve(img);
        };
        img.onerror = () => {
          reject(new Error("Load Image Error"));
        };
        img.src = src;
      }
    });
  }

  private static async nodeLoad(src: string | HTMLImageElement) {
    return [];
  }
}
