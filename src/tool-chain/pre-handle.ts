import { ExportType } from "./options";
import { rangeNumValue } from "../utils/math";

export function preHandleOpicity(opacity: number) {
  return rangeNumValue(0, 1, opacity);
}

export function preHandleArrayForm<T>(arg: T | T[]) {
  if (Array.isArray(arg)) {
    return arg[0];
  } else {
    return arg;
  }
}

export function preHandleExport(options: {
  type?: ExportType,
  quality?: number,
  size?: { width?: number, height?: number },
}) {
  const { type, quality, size } = options;
  return {
    type: type ?? "png",
    quality: quality === undefined ? 1.0 : rangeNumValue(0, 1, quality),
    size,
  };
}
