import { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { ActionToast } from '@/components/resident/action-toast';
import { ResidentForm } from '@/components/resident/resident-form';
import { ResidentScreen } from '@/components/resident/resident-screen';
import { fetchResidentById, updateResident, type Resident } from '@/services/resident-api';

export default function ResidentEditScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [resident, setResident] = useState<Resident | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    async function loadResident() {
      if (!id) {
        return;
      }

      try {
        const data = await fetchResidentById(id);
        setResident(data);
      } catch (error) {
        setToast({ type: 'error', message: (error as Error).message });
      }
    }

    loadResident();
  }, [id]);

  return (
    <ResidentScreen title="Update Resident" subtitle="Edit profile and contact details" showBackButton>
      <ActionToast
        visible={!!toast}
        type={toast?.type ?? 'success'}
        message={toast?.message ?? ''}
        onHide={() => setToast(null)}
      />
      {resident && (
        <ResidentForm
          initialValues={resident}
          submitLabel="Update Resident"
          onSubmit={async (payload) => {
            if (!id) {
              return;
            }

            try {
              await updateResident(id, payload);
              setToast({ type: 'success', message: 'Resident updated successfully.' });
              setTimeout(() => {
                router.replace(`/(tabs)/residents/${id}`);
              }, 700);
            } catch (error) {
              setToast({ type: 'error', message: (error as Error).message });
            }
          }}
        />
      )}
    </ResidentScreen>
  );
}
