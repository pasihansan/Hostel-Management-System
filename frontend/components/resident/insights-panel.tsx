import { StyleSheet, Text, View } from 'react-native';

import { ResidentTheme } from '@/constants/resident-management-theme';
import type { ResidentSummary } from '@/services/resident-api';
import { FadeSlideIn } from './fade-slide-in';

type InsightsPanelProps = {
  summary?: ResidentSummary;
};

export function InsightsPanel({ summary }: InsightsPanelProps) {
  if (!summary) {
    return null;
  }

  return (
    <FadeSlideIn delay={40}>
      <View style={styles.panel}>
      <Text style={styles.title}>Resident Insights</Text>
      <View style={styles.grid}>
        <Stat label="Total" value={String(summary.totalResidents)} />
        <Stat label="Active" value={String(summary.activeResidents)} />
        <Stat label="Avg Rating" value={summary.averageOccupantRating.toFixed(2)} />
      </View>
      {!!summary.topResidents.length && (
        <View style={styles.topList}>
          <Text style={styles.topTitle}>Top Rated</Text>
          {summary.topResidents.map((resident) => (
            <Text key={resident.id} style={styles.topItem}>
              {resident.fullName} - Room {resident.roomNumber} ({resident.averageRating.toFixed(1)})
            </Text>
          ))}
        </View>
      )}
      </View>
    </FadeSlideIn>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: ResidentTheme.colors.cardBg,
    borderWidth: 1,
    borderColor: ResidentTheme.colors.border,
    borderRadius: ResidentTheme.radius.md,
    padding: 12,
    gap: 10,
  },
  title: {
    fontSize: ResidentTheme.fonts.small,
    fontWeight: '700',
    color: ResidentTheme.colors.brand,
    fontFamily: ResidentTheme.fonts.family,
  },
  grid: {
    flexDirection: 'row',
    gap: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#EFF6FF',
    borderRadius: ResidentTheme.radius.sm,
    padding: 8,
  },
  statLabel: {
    color: ResidentTheme.colors.textSecondary,
    fontFamily: ResidentTheme.fonts.family,
    fontSize: ResidentTheme.fonts.tiny,
  },
  statValue: {
    marginTop: 2,
    color: ResidentTheme.colors.textPrimary,
    fontFamily: ResidentTheme.fonts.family,
    fontWeight: '700',
    fontSize: ResidentTheme.fonts.base,
  },
  topList: {
    gap: 4,
  },
  topTitle: {
    color: ResidentTheme.colors.textPrimary,
    fontFamily: ResidentTheme.fonts.family,
    fontSize: ResidentTheme.fonts.small,
    fontWeight: '700',
  },
  topItem: {
    color: ResidentTheme.colors.textSecondary,
    fontFamily: ResidentTheme.fonts.family,
    fontSize: ResidentTheme.fonts.tiny,
  },
});
