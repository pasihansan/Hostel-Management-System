import { useState } from 'react';
import { useRouter } from 'expo-router';

import { ActionToast } from '@/components/resident/action-toast';
import { ResidentForm } from '@/components/resident/resident-form';
import { ResidentScreen } from '@/components/resident/resident-screen';
import { createResident } from '@/services/resident-api';

export default function ResidentCreateScreen() {
  const router = useRouter();
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  return (
    <ResidentScreen
      title="Add Resident"
      showBackButton
      subtitle="Create a new resident profile with personal details">
      <ActionToast
        visible={!!toast}
        type={toast?.type ?? 'success'}
        message={toast?.message ?? ''}
        onHide={() => setToast(null)}
      />
      <ResidentForm
        submitLabel="Create Resident"
        showTestFillButton
        onSubmit={async (payload) => {
          try {
            await createResident(payload);
            setToast({ type: 'success', message: 'Resident created successfully.' });
            setTimeout(() => {
              router.replace('/(tabs)/residents');
            }, 700);
          } catch (error) {
            setToast({ type: 'error', message: (error as Error).message });
          }
        }}
      />
    </ResidentScreen>
  );
}
