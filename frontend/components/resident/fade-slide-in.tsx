import { useEffect, useRef, type PropsWithChildren } from 'react';
import { Animated, Easing } from 'react-native';

type FadeSlideInProps = PropsWithChildren<{
  delay?: number;
  offset?: number;
  duration?: number;
}>;

export function FadeSlideIn({
  children,
  delay = 0,
  offset = 10,
  duration = 260,
}: FadeSlideInProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(offset)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [delay, duration, opacity, translateY]);

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }}>
      {children}
    </Animated.View>
  );
}
