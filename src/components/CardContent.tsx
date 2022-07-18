import React from "react";
import { StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";
import { colors } from "../utils/constants";
import { arrayRotate, randomIntFromInterval } from "../utils/utils";

const styles = StyleSheet.create({
  bar: {
    height: 10,
    borderRadius: 3,
    justifyContent: "center",
    shadowColor: "#CCC",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.08,
    shadowRadius: 2,

    elevation: 5,
  },
});

type Props = {
  index: number;
};
export const CardContent = ({ index }: Props) => {
  return (
    <>
      {colors.map((_, colorIndex) => (
        <Animated.View
          key={colorIndex}
          style={[
            styles.bar,
            {
              width: randomIntFromInterval(30, 65),
              marginBottom: colorIndex === 2 || colorIndex === 4 ? 16 : 4,
              backgroundColor: arrayRotate(colors, index % 2)[colorIndex],
            },
          ]}
        />
      ))}
    </>
  );
};
