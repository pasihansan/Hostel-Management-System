import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ResidentTheme } from '@/constants/resident-management-theme';
import type { Resident } from '@/services/resident-api';
import { FadeSlideIn } from './fade-slide-in';
import { RatingBadge } from './rating-badge';

type ResidentCardProps = {
  resident: Resident;
  onPress: (id: string) => void;
  animationDelay?: number;
};

export function ResidentCard({ resident, onPress, animationDelay = 0 }: ResidentCardProps) {
  return (
    <FadeSlideIn delay={animationDelay}>
      <Pressable style={styles.card} onPress={() => onPress(resident.id)}>
        <View style={styles.rowTop}>
          <Text style={styles.name}>{resident.fullName}</Text>
          <RatingBadge rating={resident.averageRating || 0} />
        </View>
        <Text style={styles.meta}>Room {resident.roomNumber}</Text>
        <Text style={styles.meta}>{resident.phone}</Text>
        <Text style={styles.meta}>{resident.email}</Text>
        <View style={styles.statusRow}>
          <View style={[styles.dot, { backgroundColor: resident.isActive ? '#10B981' : '#9CA3AF' }]} />
          <Text style={styles.statusText}>{resident.isActive ? 'Active' : 'Inactive'}</Text>
        </View>
      </Pressable>
    </FadeSlideIn>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: ResidentTheme.colors.cardBg,
    borderRadius: ResidentTheme.radius.md,
    borderWidth: 1,
    borderColor: ResidentTheme.colors.border,
    padding: 12,
    gap: 3,
  },
  rowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    flex: 1,
    fontSize: ResidentTheme.fonts.medium,
    fontWeight: '700',
    color: ResidentTheme.colors.textPrimary,
    fontFamily: ResidentTheme.fonts.family,
    marginRight: 8,
  },
  meta: {
    fontSize: ResidentTheme.fonts.small,
    color: ResidentTheme.colors.textSecondary,
    fontFamily: ResidentTheme.fonts.family,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 99,
  },
  statusText: {
    fontSize: ResidentTheme.fonts.tiny,
    color: ResidentTheme.colors.textSecondary,
    fontFamily: ResidentTheme.fonts.family,
    fontWeight: '600',
  },
});
