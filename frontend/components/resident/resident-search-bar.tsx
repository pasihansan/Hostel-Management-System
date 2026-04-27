import { StyleSheet, TextInput, View } from 'react-native';

import { ResidentTheme } from '@/constants/resident-management-theme';

type ResidentSearchBarProps = {
  value: string;
  onChangeText: (value: string) => void;
};

export function ResidentSearchBar({ value, onChangeText }: ResidentSearchBarProps) {
  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search by name, room, email, phone"
        placeholderTextColor={ResidentTheme.colors.textSecondary}
        value={value}
        onChangeText={onChangeText}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: ResidentTheme.colors.inputBg,
    borderRadius: ResidentTheme.radius.md,
    borderWidth: 1,
    borderColor: ResidentTheme.colors.border,
    paddingHorizontal: 12,
    shadowColor: '#0F172A',
    shadowOpacity: 0.03,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
  },
  input: {
    height: 44,
    fontFamily: ResidentTheme.fonts.family,
    fontSize: ResidentTheme.fonts.small,
    color: ResidentTheme.colors.textPrimary,
  },
});
