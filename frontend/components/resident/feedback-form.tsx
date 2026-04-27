import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { ResidentTheme } from '@/constants/resident-management-theme';
import { FadeSlideIn } from './fade-slide-in';

type FeedbackFormProps = {
  onSubmit: (payload: { rating: number; comment?: string }) => Promise<void>;
};

export function FeedbackForm({ onSubmit }: FeedbackFormProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSave() {
    try {
      setIsSubmitting(true);
      await onSubmit({ rating, comment });
      setComment('');
      setRating(5);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <FadeSlideIn delay={110}>
      <View style={styles.card}>
      <Text style={styles.title}>Add Feedback</Text>
      <View style={styles.starRow}>
        {[1, 2, 3, 4, 5].map((value) => (
          <Pressable
            key={value}
            style={[styles.starChip, rating === value && styles.starChipActive]}
            onPress={() => setRating(value)}>
            <Text style={[styles.starText, rating === value && styles.starTextActive]}>{value}</Text>
          </Pressable>
        ))}
      </View>
      <TextInput
        style={styles.input}
        value={comment}
        onChangeText={setComment}
        placeholder="Write feedback"
        placeholderTextColor={ResidentTheme.colors.textSecondary}
        multiline
      />
      <Pressable style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>{isSubmitting ? 'Saving...' : 'Save Feedback'}</Text>
      </Pressable>
      </View>
    </FadeSlideIn>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: ResidentTheme.colors.cardBg,
    borderWidth: 1,
    borderColor: ResidentTheme.colors.border,
    borderRadius: ResidentTheme.radius.md,
    padding: 12,
    gap: 10,
  },
  title: {
    color: ResidentTheme.colors.textPrimary,
    fontFamily: ResidentTheme.fonts.family,
    fontWeight: '700',
    fontSize: ResidentTheme.fonts.small,
  },
  starRow: {
    flexDirection: 'row',
    gap: 8,
  },
  starChip: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: ResidentTheme.colors.border,
  },
  starChipActive: {
    borderColor: ResidentTheme.colors.brand,
    backgroundColor: ResidentTheme.colors.brandSoft,
  },
  starText: {
    color: ResidentTheme.colors.textSecondary,
    fontFamily: ResidentTheme.fonts.family,
    fontSize: ResidentTheme.fonts.small,
    fontWeight: '700',
  },
  starTextActive: {
    color: ResidentTheme.colors.brand,
  },
  input: {
    minHeight: 64,
    borderWidth: 1,
    borderColor: ResidentTheme.colors.border,
    borderRadius: ResidentTheme.radius.sm,
    paddingHorizontal: 10,
    paddingVertical: 8,
    textAlignVertical: 'top',
    color: ResidentTheme.colors.textPrimary,
    fontSize: ResidentTheme.fonts.small,
    fontFamily: ResidentTheme.fonts.family,
  },
  button: {
    backgroundColor: ResidentTheme.colors.brand,
    borderRadius: ResidentTheme.radius.sm,
    paddingVertical: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontFamily: ResidentTheme.fonts.family,
    fontWeight: '700',
    fontSize: ResidentTheme.fonts.small,
  },
});
