import { useEffect, useMemo, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

import { ResidentTheme } from '@/constants/resident-management-theme';

type ActionToastProps = {
  visible: boolean;
  type: 'success' | 'error';
  message: string;
  onHide: () => void;
};

export function ActionToast({ visible, type, message, onHide }: ActionToastProps) {
  const translateY = useRef(new Animated.Value(-30)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const themeStyle = useMemo(() => {
    if (type === 'success') {
      return {
        backgroundColor: '#ECFDF5',
        borderColor: '#A7F3D0',
        textColor: '#065F46',
      };
    }

    return {
      backgroundColor: '#FEF2F2',
      borderColor: '#FECACA',
      textColor: '#991B1B',
    };
  }, [type]);

  useEffect(() => {
    if (!visible) {
      return;
    }

    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: -20,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onHide();
      });
    }, 2200);

    return () => clearTimeout(timer);
  }, [visible, translateY, opacity, onHide]);

  if (!visible) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.wrapper,
        {
          opacity,
          transform: [{ translateY }],
          backgroundColor: themeStyle.backgroundColor,
          borderColor: themeStyle.borderColor,
        },
      ]}>
      <View style={styles.dot} />
      <Text style={[styles.message, { color: themeStyle.textColor }]}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: 12,
    left: 16,
    right: 16,
    zIndex: 200,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#0F172A',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 99,
    backgroundColor: ResidentTheme.colors.brand,
    marginRight: 8,
  },
  message: {
    flex: 1,
    fontFamily: ResidentTheme.fonts.family,
    fontSize: ResidentTheme.fonts.small,
    fontWeight: '600',
  },
});
