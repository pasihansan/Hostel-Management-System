import { useMemo, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';

import { ResidentTheme } from '@/constants/resident-management-theme';
import type { ResidentPayload } from '@/services/resident-api';
import { validateResidentInput } from '@/services/resident-api';
import { FadeSlideIn } from './fade-slide-in';

type ResidentFormProps = {
  initialValues?: Partial<ResidentPayload>;
  submitLabel: string;
  showTestFillButton?: boolean;
  onSubmit: (payload: ResidentPayload) => Promise<void>;
};

const defaultValues: ResidentPayload = {
  fullName: '',
  gender: 'Other',
  dateOfBirth: '',
  roomNumber: '',
  phone: '',
  email: '',
  guardianName: '',
  emergencyContact: {
    name: '',
    relation: '',
    phone: '',
  },
  address: '',
  notes: '',
  isActive: true,
};

const genders: ResidentPayload['gender'][] = ['Male', 'Female', 'Other'];

export function ResidentForm({
  initialValues,
  submitLabel,
  showTestFillButton = false,
  onSubmit,
}: ResidentFormProps) {
  const [values, setValues] = useState<ResidentPayload>({
    ...defaultValues,
    ...initialValues,
    emergencyContact: {
      ...defaultValues.emergencyContact,
      ...(initialValues?.emergencyContact ?? {}),
    },
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = useMemo(() => !submitting, [submitting]);

  function setField<K extends keyof ResidentPayload>(key: K, value: ResidentPayload[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit() {
    const validation = validateResidentInput(values);
    setErrors(validation);

    if (Object.keys(validation).length > 0) {
      return;
    }

    try {
      setSubmitting(true);
      await onSubmit(values);
    } finally {
      setSubmitting(false);
    }
  }

  function getRandomFrom<T>(items: T[]): T {
    return items[Math.floor(Math.random() * items.length)];
  }

  function buildRandomDateOfBirth() {
    const year = 1993 + Math.floor(Math.random() * 10);
    const month = 1 + Math.floor(Math.random() * 12);
    const day = 1 + Math.floor(Math.random() * 28);
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }

  function buildRandomPhone() {
    const base = Math.floor(1000000000 + Math.random() * 9000000000);
    return `+91 ${String(base)}`;
  }

  function fillRandomTestData() {
    const firstNames = ['Aarav', 'Meera', 'Rohan', 'Kavya', 'Ishaan', 'Anaya', 'Vihaan', 'Neha'];
    const lastNames = ['Sharma', 'Patel', 'Reddy', 'Gupta', 'Kapoor', 'Nair', 'Khan', 'Das'];
    const streets = ['Lake View Road', 'Park Street', 'River Side Lane', 'Rose Avenue'];
    const cities = ['Bengaluru', 'Mumbai', 'Hyderabad', 'Pune'];
    const relations = ['Father', 'Mother', 'Brother', 'Sister', 'Guardian'];
    const gendersLocal: ResidentPayload['gender'][] = ['Male', 'Female', 'Other'];

    const firstName = getRandomFrom(firstNames);
    const lastName = getRandomFrom(lastNames);
    const emergencyFirst = getRandomFrom(firstNames);
    const emergencyLast = getRandomFrom(lastNames);
    const roomBlock = getRandomFrom(['A', 'B', 'C', 'D']);
    const roomNo = 100 + Math.floor(Math.random() * 300);
    const idSuffix = Math.floor(1000 + Math.random() * 9000);
    const gender = getRandomFrom(gendersLocal);

    const randomPayload: ResidentPayload = {
      fullName: `${firstName} ${lastName}`,
      gender,
      dateOfBirth: buildRandomDateOfBirth(),
      roomNumber: `${roomBlock}-${roomNo}`,
      phone: buildRandomPhone(),
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${idSuffix}@example.com`,
      guardianName: `${getRandomFrom(firstNames)} ${lastName}`,
      emergencyContact: {
        name: `${emergencyFirst} ${emergencyLast}`,
        relation: getRandomFrom(relations),
        phone: buildRandomPhone(),
      },
      address: `${Math.floor(10 + Math.random() * 90)}, ${getRandomFrom(streets)}, ${getRandomFrom(cities)}`,
      notes: `Test resident profile generated at ${new Date().toISOString()}`,
      isActive: Math.random() > 0.2,
    };

    setValues(randomPayload);
    setErrors({});
  }

  return (
    <FadeSlideIn delay={70} offset={10}>
      <View style={styles.formCard}>
      {showTestFillButton && (
        <Pressable style={styles.testFillButton} onPress={fillRandomTestData}>
          <Text style={styles.testFillButtonText}>Fill Test Data</Text>
        </Pressable>
      )}
      <LabeledInput
        label="Full Name"
        value={values.fullName}
        onChangeText={(text) => setField('fullName', text)}
        error={errors.fullName}
      />
      <View style={styles.rowWrap}>
        {genders.map((gender) => (
          <Pressable
            key={gender}
            style={[styles.genderChip, values.gender === gender && styles.genderChipActive]}
            onPress={() => setField('gender', gender)}>
            <Text style={[styles.genderChipText, values.gender === gender && styles.genderChipTextActive]}>
              {gender}
            </Text>
          </Pressable>
        ))}
      </View>

      <LabeledInput
        label="Date of Birth (YYYY-MM-DD)"
        value={values.dateOfBirth}
        onChangeText={(text) => setField('dateOfBirth', text)}
      />
      <LabeledInput
        label="Room Number"
        value={values.roomNumber}
        onChangeText={(text) => setField('roomNumber', text)}
        error={errors.roomNumber}
      />
      <LabeledInput
        label="Phone"
        value={values.phone}
        onChangeText={(text) => setField('phone', text)}
        keyboardType="phone-pad"
        error={errors.phone}
      />
      <LabeledInput
        label="Email"
        value={values.email}
        onChangeText={(text) => setField('email', text)}
        keyboardType="email-address"
        autoCapitalize="none"
        error={errors.email}
      />
      <LabeledInput
        label="Guardian Name"
        value={values.guardianName || ''}
        onChangeText={(text) => setField('guardianName', text)}
      />
      <LabeledInput
        label="Emergency Contact Name"
        value={values.emergencyContact?.name || ''}
        onChangeText={(text) =>
          setField('emergencyContact', { ...values.emergencyContact, name: text })
        }
      />
      <LabeledInput
        label="Emergency Contact Relation"
        value={values.emergencyContact?.relation || ''}
        onChangeText={(text) =>
          setField('emergencyContact', { ...values.emergencyContact, relation: text })
        }
      />
      <LabeledInput
        label="Emergency Contact Phone"
        value={values.emergencyContact?.phone || ''}
        onChangeText={(text) =>
          setField('emergencyContact', { ...values.emergencyContact, phone: text })
        }
        keyboardType="phone-pad"
      />
      <LabeledInput
        label="Address"
        value={values.address || ''}
        onChangeText={(text) => setField('address', text)}
      />
      <LabeledInput
        label="Notes"
        value={values.notes || ''}
        onChangeText={(text) => setField('notes', text)}
        multiline
      />

      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>Active Resident</Text>
        <Switch
          value={values.isActive}
          onValueChange={(nextValue) => setField('isActive', nextValue)}
          trackColor={{ false: '#BFDBFE', true: '#1D4ED8' }}
          thumbColor="#FFFFFF"
        />
      </View>

      <Pressable style={[styles.submitButton, !canSubmit && styles.submitButtonDisabled]} onPress={handleSubmit}>
        <Text style={styles.submitText}>{submitting ? 'Please wait...' : submitLabel}</Text>
      </Pressable>
      </View>
    </FadeSlideIn>
  );
}

type LabeledInputProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  error?: string;
  keyboardType?: 'default' | 'email-address' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences';
  multiline?: boolean;
};

function LabeledInput({
  label,
  value,
  onChangeText,
  error,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  multiline = false,
}: LabeledInputProps) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        style={[styles.input, multiline && styles.inputMulti]}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        multiline={multiline}
        placeholder={label}
        placeholderTextColor="#9AA8BC"
      />
      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  formCard: {
    backgroundColor: ResidentTheme.colors.cardBg,
    borderWidth: 1,
    borderColor: ResidentTheme.colors.border,
    borderRadius: ResidentTheme.radius.lg,
    padding: 14,
    gap: 9,
    shadowColor: '#0F172A',
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 1,
  },
  rowWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  testFillButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#E0EDFF',
    borderWidth: 1,
    borderColor: ResidentTheme.colors.border,
    borderRadius: ResidentTheme.radius.sm,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  testFillButtonText: {
    color: ResidentTheme.colors.brand,
    fontFamily: ResidentTheme.fonts.family,
    fontSize: ResidentTheme.fonts.tiny,
    fontWeight: '700',
  },
  genderChip: {
    borderWidth: 1,
    borderColor: ResidentTheme.colors.border,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#EFF6FF',
  },
  genderChipActive: {
    backgroundColor: ResidentTheme.colors.brand,
    borderColor: ResidentTheme.colors.brand,
  },
  genderChipText: {
    color: ResidentTheme.colors.brand,
    fontSize: ResidentTheme.fonts.small,
    fontFamily: ResidentTheme.fonts.family,
    fontWeight: '600',
  },
  genderChipTextActive: {
    color: '#FFFFFF',
  },
  inputGroup: {
    gap: 4,
  },
  inputLabel: {
    fontSize: ResidentTheme.fonts.tiny,
    fontFamily: ResidentTheme.fonts.family,
    color: '#6D7E95',
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  input: {
    borderWidth: 1,
    borderColor: ResidentTheme.colors.border,
    borderRadius: ResidentTheme.radius.sm,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: ResidentTheme.colors.textPrimary,
    fontFamily: ResidentTheme.fonts.family,
    fontSize: ResidentTheme.fonts.small,
    backgroundColor: ResidentTheme.colors.inputBg,
  },
  inputMulti: {
    minHeight: 72,
    textAlignVertical: 'top',
  },
  errorText: {
    color: ResidentTheme.colors.danger,
    fontFamily: ResidentTheme.fonts.family,
    fontSize: ResidentTheme.fonts.tiny,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  switchLabel: {
    fontSize: ResidentTheme.fonts.small,
    color: ResidentTheme.colors.textPrimary,
    fontFamily: ResidentTheme.fonts.family,
    fontWeight: '600',
  },
  submitButton: {
    marginTop: 8,
    backgroundColor: ResidentTheme.colors.brand,
    borderRadius: ResidentTheme.radius.md,
    paddingVertical: 11,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: ResidentTheme.fonts.small,
    fontFamily: ResidentTheme.fonts.family,
  },
});
