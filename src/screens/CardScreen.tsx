import React, { useRef } from "react";
import { StyleSheet, View } from "react-native";
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  TapGestureHandler,
  TapGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedGestureHandler,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Card } from "../components/Card";
import { NumElements } from "../utils/constants";

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
});

export const CardScreen = () => {
  const panRef = useRef<PanGestureHandler>(null);
  const gestureProgress = useSharedValue(0);
  // This shared value "starts" the press animation by setting it to a number [0,1]
  const snapProgress = useSharedValue<null | number>(null);
  const y = useSharedValue(100);

  const onPress = () => {
    "worklet";

    const toValue = y.value <= -100 ? 0 : 1;
    snapProgress.value = toValue;
    // set gesture progress and pan y to match the press animation
    y.value = toValue >= 1 ? -100 : 100;
    gestureProgress.value = toValue;
  };

  const panGestureHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    { startY: number }
  >({
    onStart: (_, ctx) => {
      ctx.startY = y.value;
    },
    onActive: (event, ctx) => {
      snapProgress.value = null;
      y.value = ctx.startY + event.translationY;
      const progress = interpolate(
        y.value,
        [-1000, -200, -100, 100, 200, 1000],
        [1.2, 1.1, 1, 0, -0.1, -0.2],
        Extrapolation.EXTEND
      );
      gestureProgress.value = progress;
    },
    onEnd: ({ velocityY }) => {
      let toValue!: number;
      let cappedVelocity!: number;

      if (y.value <= 0 || -velocityY >= 1000) {
        toValue = 1;
        cappedVelocity =
          y.value < -100 ? 0 : Math.max(Math.min(-velocityY / 10, 8), -2);
        y.value = -100;
      } else if (y.value > 0 || -velocityY <= -1000) {
        toValue = 0;
        cappedVelocity =
          y.value > 100 ? 0 : Math.min(Math.max(-velocityY / 10, -5), 2);
        y.value = 100;
      }

      gestureProgress.value = withSpring(toValue, {
        damping: 15,
        stiffness: 100,
        restSpeedThreshold: 0.01,
        restDisplacementThreshold: 0.001,
        velocity: cappedVelocity,
      });
    },
  });

  const tapGestureHandler =
    useAnimatedGestureHandler<TapGestureHandlerGestureEvent>({
      onEnd: () => {
        onPress();
      },
    });

  return (
    <View style={styles.flex1}>
      <PanGestureHandler
        ref={panRef}
        minDist={1}
        onGestureEvent={panGestureHandler}
      >
        <Animated.View style={styles.flex1}>
          <TapGestureHandler
            onGestureEvent={tapGestureHandler}
            waitFor={panRef}
          >
            <Animated.View style={styles.flex1}>
              {[...Array(NumElements)].map((_, index) => (
                <Card
                  key={index}
                  snap={snapProgress}
                  gestureProgress={gestureProgress}
                  // We do this because we want the element with 0 index to snap to the top left
                  index={Math.abs(NumElements - 1 - index)}
                />
              ))}
            </Animated.View>
          </TapGestureHandler>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};
