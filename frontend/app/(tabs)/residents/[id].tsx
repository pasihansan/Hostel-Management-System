import { useCallback, useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { ActionToast } from '@/components/resident/action-toast';
import { FeedbackForm } from '@/components/resident/feedback-form';
import { RatingBadge } from '@/components/resident/rating-badge';
import { ResidentScreen } from '@/components/resident/resident-screen';
import { ResidentTheme } from '@/constants/resident-management-theme';
import { addResidentFeedback, deleteResident, fetchResidentById, type Resident } from '@/services/resident-api';

export default function ResidentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [resident, setResident] = useState<Resident | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const loadResident = useCallback(async () => {
    if (!id) {
      return;
    }

    try {
      const data = await fetchResidentById(id);
      setResident(data);
    } catch (error) {
      setToast({ type: 'error', message: (error as Error).message });
    }
  }, [id]);

  useEffect(() => {
    loadResident();
  }, [loadResident]);

  async function handleDelete() {
    if (!id) {
      return;
    }

    Alert.alert('Delete Resident', 'This action can not be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteResident(id);
            setToast({ type: 'success', message: 'Resident deleted successfully.' });
            router.replace('/(tabs)/residents');
          } catch (error) {
            setToast({ type: 'error', message: (error as Error).message });
          }
        },
      },
    ]);
  }

  if (!resident) {
    return (
      <ResidentScreen title="Resident Details" subtitle="Loading resident profile..." showBackButton>
        <ActionToast
          visible={!!toast}
          type={toast?.type ?? 'success'}
          message={toast?.message ?? ''}
          onHide={() => setToast(null)}
        />
        <Text style={styles.loadingText}>Please wait...</Text>
      </ResidentScreen>
    );
  }

  return (
    <ResidentScreen
      title={resident.fullName}
      subtitle={`Room ${resident.roomNumber}`}
      useScroll={false}
      showBackButton
      rightAction={
        <Pressable style={styles.editButton} onPress={() => router.push(`/(tabs)/residents/edit/${resident.id}`)}>
          <Text style={styles.editButtonText}>Edit</Text>
        </Pressable>
      }>
      <ActionToast
        visible={!!toast}
        type={toast?.type ?? 'success'}
        message={toast?.message ?? ''}
        onHide={() => setToast(null)}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <View style={styles.titleRow}>
            <Text style={styles.cardTitle}>Resident Profile</Text>
            <RatingBadge rating={resident.averageRating || 0} />
          </View>
          <Detail label="Phone" value={resident.phone} />
          <Detail label="Email" value={resident.email} />
          <Detail label="Gender" value={resident.gender} />
          <Detail label="Date Of Birth" value={resident.dateOfBirth?.slice(0, 10)} />
          <Detail label="Guardian" value={resident.guardianName} />
          <Detail label="Address" value={resident.address} />
          <Detail label="Emergency" value={resident.emergencyContact?.phone} />
          <Detail label="Notes" value={resident.notes} />
        </View>

        <FeedbackForm
          onSubmit={async (payload) => {
            if (!id) {
              return;
            }
            try {
              const updated = await addResidentFeedback(id, payload);
              setResident(updated);
              setToast({ type: 'success', message: 'Feedback added successfully.' });
            } catch (error) {
              setToast({ type: 'error', message: (error as Error).message });
            }
          }}
        />

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Recent Feedback</Text>
          {resident.feedback.length === 0 && <Text style={styles.muted}>No feedback yet.</Text>}
          {resident.feedback
            .slice()
            .reverse()
            .slice(0, 5)
            .map((item, index) => (
              <View key={`${item.createdAt}-${index}`} style={styles.feedbackRow}>
                <Text style={styles.feedbackMeta}>Rating {item.rating}/5</Text>
                <Text style={styles.feedbackComment}>{item.comment || 'No comments'}</Text>
              </View>
            ))}
        </View>

        <Pressable style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.deleteButtonText}>Delete Resident</Text>
        </Pressable>
      </ScrollView>
    </ResidentScreen>
  );
}

function Detail({ label, value }: { label: string; value?: string }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value || '-'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingText: {
    color: ResidentTheme.colors.textSecondary,
    fontSize: ResidentTheme.fonts.small,
    fontFamily: ResidentTheme.fonts.family,
  },
  content: {
    gap: 10,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: ResidentTheme.colors.cardBg,
    borderRadius: ResidentTheme.radius.md,
    borderWidth: 1,
    borderColor: ResidentTheme.colors.border,
    padding: 12,
    gap: 8,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    color: ResidentTheme.colors.textPrimary,
    fontFamily: ResidentTheme.fonts.family,
    fontWeight: '700',
    fontSize: ResidentTheme.fonts.small,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  detailLabel: {
    color: ResidentTheme.colors.textSecondary,
    fontFamily: ResidentTheme.fonts.family,
    fontSize: ResidentTheme.fonts.tiny,
  },
  detailValue: {
    color: ResidentTheme.colors.textPrimary,
    fontFamily: ResidentTheme.fonts.family,
    fontSize: ResidentTheme.fonts.small,
    flex: 1,
    textAlign: 'right',
  },
  muted: {
    color: ResidentTheme.colors.textSecondary,
    fontSize: ResidentTheme.fonts.tiny,
    fontFamily: ResidentTheme.fonts.family,
  },
  feedbackRow: {
    borderTopWidth: 1,
    borderTopColor: ResidentTheme.colors.border,
    paddingTop: 8,
    gap: 2,
  },
  feedbackMeta: {
    color: ResidentTheme.colors.brand,
    fontFamily: ResidentTheme.fonts.family,
    fontWeight: '700',
    fontSize: ResidentTheme.fonts.tiny,
  },
  feedbackComment: {
    color: ResidentTheme.colors.textSecondary,
    fontFamily: ResidentTheme.fonts.family,
    fontSize: ResidentTheme.fonts.small,
  },
  editButton: {
    backgroundColor: '#E0EDFF',
    borderRadius: ResidentTheme.radius.sm,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  editButtonText: {
    color: ResidentTheme.colors.brand,
    fontFamily: ResidentTheme.fonts.family,
    fontSize: ResidentTheme.fonts.tiny,
    fontWeight: '700',
  },
  deleteButton: {
    backgroundColor: '#FEE2E2',
    borderRadius: ResidentTheme.radius.md,
    paddingVertical: 11,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: ResidentTheme.colors.danger,
    fontFamily: ResidentTheme.fonts.family,
    fontWeight: '700',
    fontSize: ResidentTheme.fonts.small,
  },
});
