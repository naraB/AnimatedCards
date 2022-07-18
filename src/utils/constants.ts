import { Dimensions } from "react-native";

export const { height: ScreenHeight, width: ScreenWidth } =
  Dimensions.get("screen");
export const CardDimensions = { width: 100, height: 150 };

export const InitTranslationY = ScreenHeight - CardDimensions.height;
export const InitTranslationX = ScreenWidth / 2 - CardDimensions.width / 2;

export const NumElements = 7;
export const NumCols = 3;
export const NumRows = Math.floor(NumElements / NumCols);

export const colors = [
  "#007aff",
  "#5ac8fa",
  "#34c759",
  "#5854d6",
  "#af52de",
  "#ff8fa3",
  "#ffb3c1",
];
