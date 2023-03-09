'use strict';

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

class BaseToolChains {
    constructor() {
        this.functionChainsArray = [];
    }
    addIntoFuncArray(type, func) {
        this.functionChainsArray.push({
            type,
            func: () => {
                func();
                this.runNext();
            },
        });
        return this;
    }
    runNext() {
        if (this.functionChainsArray.length === 0) {
            return;
        }
        const { func: currentFuncForApply } = this.functionChainsArray.shift();
        currentFuncForApply();
    }
}

function isBrowser() {
    return !!(typeof window !== "undefined" && document);
}
function isNode() {
    return !!(typeof module !== "undefined" &&
        module.exports &&
        typeof process === "object" &&
        typeof process.versions === "object");
}

class ImageLoader {
    static loadImage(src) {
        return __awaiter(this, void 0, void 0, function* () {
            if (src === undefined)
                throw Error("No Image Load");
            if (isBrowser()) {
                return ImageLoader.browserLoad(src);
            }
            if (isNode()) {
                return ImageLoader.nodeLoad(src);
            }
            throw Error("Unknown Environment!");
        });
    }
    /**
     *
     * @param src 图片参数路径或Base64都可 | DOM元素
     * @returns promise<HTMLImageElement>
     */
    static browserLoad(src) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                if (src instanceof Image) {
                    resolve(src);
                }
                else {
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
        });
    }
    static nodeLoad(src) {
        return __awaiter(this, void 0, void 0, function* () {
            return [];
        });
    }
}

class ImageExporter {
    static export(src, exportOptions) {
        const { type, quality, size } = exportOptions;
        if (!!size) {
            const { width, height } = size;
            ImageExporter.reSize(src, width, height);
        }
        switch (type) {
            case "canvas":
                return ImageExporter.toCanvas(src);
            case "jpeg":
                return ImageExporter.toJPG(src, quality);
            case "webp":
                return ImageExporter.toWEBP(src, quality);
            case "png":
            default:
                return ImageExporter.toPNG(src, quality);
        }
    }
    static reSize(canvas, width, height) {
        if (width === undefined && height === undefined)
            return canvas;
        const newWidth = width !== null && width !== void 0 ? width : canvas.width;
        const newHeight = height !== null && height !== void 0 ? height : canvas.height;
        const newCanvas = document.createElement("canvas");
        newCanvas.width = newWidth;
        newCanvas.height = newHeight;
        const newCtx = newCanvas.getContext("2d");
        newCtx === null || newCtx === void 0 ? void 0 : newCtx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, newWidth, newHeight);
        return newCanvas;
    }
    static toCanvas(src) {
        return src;
    }
    static toPNG(src, quality) {
        return src.toDataURL("image/png", quality);
    }
    static toJPG(src, quality) {
        return src.toDataURL("image/jpg", quality);
    }
    static toWEBP(src, quality) {
        return src.toDataURL("image/webp", quality);
    }
}

class BasePainter {
    generateMetaInfo(src) {
        // Get canvas and context
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx)
            throw new Error("Canvas Context Create Failed");
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
    drawTextAtPosition(ctx, item, widthLen) {
        //绘制文字信息
        const { left, top, right, bottom } = item.position;
        let x = 0;
        let y = 0;
        if (item.align === 'left') {
            x = left;
            y = top;
        }
        else if (item.align === 'middle') {
            let posWidth = right - left;
            let posHeight = bottom - top;
            x = left + posWidth / 2 - widthLen / 2;
            y = top + posHeight / 2;
        }
        else if (item.align === 'right') {
            x = right - widthLen;
            y = top;
        }
        // Rotate
        ctx.translate(x, y);
        ctx.rotate(item.rotation * Math.PI / 180);
        ctx.fillText(item.text, 0, 0, widthLen);
        ctx.restore();
    }
    setContextProperty(ctx, options, index) {
        ctx.save();
        const markOpacity = options.markOpacity;
        const { color, font } = options.textInfos[index];
        // Set opacity
        ctx.globalAlpha = markOpacity;
        // Set color and font
        ctx.fillStyle = color;
        ctx.font = font;
    }
}

function getTextWidth(text, font) {
    if (isBrowser()) {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx)
            throw new Error("Canvas Context not found");
        ctx.font = font;
        return ctx.measureText(text.text).width;
    }
}

class TextMarkerPainter extends BasePainter {
    constructor(srcArray, painterOptions) {
        super();
        this.srcArray = srcArray;
        this.painterOptions = painterOptions;
    }
    markText(texts) {
        // Set general mark callback
        const getItemWidthFunc = getTextWidth;
        const args = texts;
        // Go into general mark
        return this.generalMark(texts, { getItemWidthFunc, args }, this.drawTextAtPosition);
    }
    generalMark(items, getItemWidth, drawItemFunc) {
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
        });
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

function rangeNumValue(min, max, value) {
    if (value <= min)
        return min;
    if (value >= max)
        return max;
    return value;
}

function preHandleArrayForm(arg) {
    if (Array.isArray(arg)) {
        return arg[0];
    }
    else {
        return arg;
    }
}
function preHandleExport(options) {
    const { type, quality, size } = options;
    return {
        type: type !== null && type !== void 0 ? type : "png",
        quality: quality === undefined ? 1.0 : rangeNumValue(0, 1, quality),
        size,
    };
}

var OptionType;
(function (OptionType) {
    OptionType[OptionType["LoadSrc"] = 0] = "LoadSrc";
    OptionType[OptionType["MarkImage"] = 1] = "MarkImage";
    OptionType[OptionType["AddTextInfo"] = 2] = "AddTextInfo";
    OptionType[OptionType["MarkOpacity"] = 3] = "MarkOpacity";
    OptionType[OptionType["Scale"] = 4] = "Scale";
    OptionType[OptionType["GetImage"] = 5] = "GetImage";
})(OptionType || (OptionType = {}));
const defaultTextMarkOptions = {
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

function isObject(item) {
    return item && typeof item === "object" && !Array.isArray(item);
}
function mergeOptions(deafult, target) {
    if (isObject(deafult) && isObject(target)) {
        let res = Object.assign({}, deafult);
        for (const key in target) {
            if (isObject(target[key])) {
                res[key] = mergeOptions(deafult[key], target[key]);
            }
            else if (target[key] !== undefined) {
                // When target is undefined, use default value
                Object.assign(res, { [key]: target[key] });
            }
        }
        return res;
    }
    else {
        if (target === undefined) {
            return deafult;
        }
        else {
            return target;
        }
    }
}

class TextMark extends BaseToolChains {
    constructor() {
        super(...arguments);
        this.receivedOptions = {};
    }
    /**
     * Set source image
     * Receive a single source image or a array of images
     */
    loadSrc(src) {
        const runFunc = () => {
            this.receivedOptions["srcImage"] = preHandleArrayForm(src);
        };
        return this.addIntoFuncArray(OptionType.LoadSrc, runFunc);
    }
    markText(mark) {
        const runFunc = () => {
            let value = this.receivedOptions["textInfos"];
            if (value === undefined) {
                this.receivedOptions["textInfos"] = [];
            }
            this.receivedOptions["textInfos"].push(mark);
        };
        return this.addIntoFuncArray(OptionType.AddTextInfo, runFunc);
    }
    markOpacity(opacity) {
        const runFunc = () => {
            this.receivedOptions["markOpacity"] = opacity;
        };
        return this.addIntoFuncArray(OptionType.MarkOpacity, runFunc);
    }
    getImage(type, quality, size) {
        return __awaiter(this, void 0, void 0, function* () {
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
            const mergedOptions = mergeOptions(defaultTextMarkOptions, this.receivedOptions);
            // Load source image
            const sourceImageArray = (yield ImageLoader.loadImage(mergedOptions.srcImage));
            // Init water mark painter
            const canvasPainter = new TextMarkerPainter(sourceImageArray, mergedOptions);
            // Priority image > text
            let outputRes = canvasPainter.markText(mergedOptions.textInfos);
            return ImageExporter.export(outputRes, mergedOptions.exportOptions);
        });
    }
}

exports.TextMark = TextMark;
