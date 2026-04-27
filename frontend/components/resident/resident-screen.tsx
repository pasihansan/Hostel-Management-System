import type { PropsWithChildren, ReactNode } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { ResidentTheme } from '@/constants/resident-management-theme';

type ResidentScreenProps = PropsWithChildren<{
  title: string;
  subtitle?: string;
  rightAction?: ReactNode;
  useScroll?: boolean;
  showBackButton?: boolean;
}>;

export function ResidentScreen({
  title,
  subtitle,
  rightAction,
  useScroll = true,
  showBackButton = false,
  children,
}: ResidentScreenProps) {
  const router = useRouter();

  const body = useScroll ? (
    <ScrollView contentContainerStyle={styles.container}>{children}</ScrollView>
  ) : (
    <View style={styles.container}>{children}</View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        {showBackButton && (
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Back</Text>
          </Pressable>
        )}
        <View style={styles.headerRow}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>{title}</Text>
            {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </View>
          {rightAction}
        </View>
      </View>
      {body}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: ResidentTheme.colors.pageBg,
  },
  headerContainer: {
    paddingHorizontal: 14,
    marginBottom: 10,
  },
  backButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#E8EEF7',
    borderRadius: ResidentTheme.radius.md,
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginTop: 6,
    marginBottom: 8,
  },
  backButtonText: {
    color: ResidentTheme.colors.textPrimary,
    fontFamily: ResidentTheme.fonts.family,
    fontSize: ResidentTheme.fonts.tiny,
    fontWeight: '700',
  },
  container: {
    paddingHorizontal: 14,
    paddingBottom: 20,
    gap: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
    marginBottom: 2,
  },
  headerTextContainer: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: ResidentTheme.fonts.heading,
    color: ResidentTheme.colors.textPrimary,
    fontFamily: ResidentTheme.fonts.family,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: ResidentTheme.fonts.small,
    color: ResidentTheme.colors.textSecondary,
    fontFamily: ResidentTheme.fonts.family,
    marginTop: 2,
  },
});
