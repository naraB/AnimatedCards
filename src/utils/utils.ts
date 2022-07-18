import {
  NumCols,
  ScreenWidth,
  CardDimensions,
  InitTranslationY,
  NumRows,
  InitTranslationX,
} from "./constants";

export const getCardSnapPosition = (index: number, safeAreaBottom: number) => {
  const adjustedTranslationY = InitTranslationY - safeAreaBottom - 40;
  // shift the array, e.g index 1 becomes 0
  // because 0th element does not snap, it scales and moves a bit
  const column = (index - 1) % NumCols;
  const row = Math.floor((index - 1) / NumCols);
  return {
    x:
      index === 0
        ? InitTranslationX
        : ((column + 1) * (ScreenWidth - NumCols * CardDimensions.width)) /
            (NumCols + 1) +
          column * CardDimensions.width,
    y:
      index === 0
        ? adjustedTranslationY
        : ((row + 1) *
            (adjustedTranslationY - NumRows * CardDimensions.height)) /
            (NumRows + 1) +
          row * CardDimensions.height,
  };
};

export function arrayRotate(arr: string[], count: number) {
  count -= arr.length * Math.floor(count / arr.length);
  arr.push.apply(arr, arr.splice(0, count));
  return arr;
}

export function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
