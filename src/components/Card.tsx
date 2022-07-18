import React from "react";
import { PixelRatio, StyleSheet } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  withDelay,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  CardDimensions,
  InitTranslationX,
  InitTranslationY,
} from "../utils/constants";
import { getCardSnapPosition } from "../utils/utils";
import { CardContent } from "./CardContent";

const styles = StyleSheet.create({
  card: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    height: CardDimensions.height,
    width: CardDimensions.width,
    backgroundColor: "#FBFBFC",
    borderColor: "#EEE",
    borderWidth: PixelRatio.roundToNearestPixel(1.5),
    borderRadius: 8,
    position: "absolute",
    shadowColor: "#CCC",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.3,
    shadowRadius: 7,

    elevation: 5,
  },
});

type Props = {
  index: number;
  gestureProgress: SharedValue<number>;
  snap: SharedValue<number | null>;
};
export const Card = ({ index, gestureProgress, snap }: Props) => {
  const safeAreaInsets = useSafeAreaInsets();
  const safeAreaInsetBottom = (safeAreaInsets.bottom || 20) + 16;
  const snapPosition = getCardSnapPosition(index, safeAreaInsetBottom);
  const progress = useDerivedValue(() => {
    if (snap.value !== null) {
      return withDelay(
        index * 35,
        withSpring(snap.value, {
          damping: 15,
          stiffness: 100,
          restSpeedThreshold: 0.01,
          restDisplacementThreshold: 0.001,
        })
      );
    } else {
      return gestureProgress.value;
    }
  });

  const animatedStyle = useAnimatedStyle(() => {
    const rotation = interpolate(
      progress.value,
      [0, 0.5],
      [-Math.min(index, 4) * 10, 0],
      Extrapolation.CLAMP
    );
    return {
      transform: [
        {
          rotate: `${rotation}deg`,
        },
        {
          scale: interpolate(
            progress.value,
            [0, 1],
            [1, index === 0 ? 1.1 : 1],
            Extrapolation.CLAMP
          ),
        },
      ],
    };
  });

  const animatedContainer = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            progress.value,
            [0, 1],
            [InitTranslationY - 40, snapPosition.y]
          ),
        },
        {
          translateX: interpolate(
            progress.value,
            [0, 1],
            [InitTranslationX, snapPosition.x]
          ),
        },
      ],
    };
  });

  const animatedContentStyle = useAnimatedStyle(
    () => ({
      opacity: interpolate(progress.value, [0, 1], [0.4, 0.9]),
    }),
    []
  );

  return (
    <Animated.View style={animatedContainer}>
      <Animated.View style={[styles.card, animatedStyle]}>
        <Animated.View style={animatedContentStyle}>
          <CardContent index={index} />
        </Animated.View>
      </Animated.View>
    </Animated.View>
  );
};
