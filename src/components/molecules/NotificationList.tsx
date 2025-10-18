import { deleteNotificationAction } from '@/app/actions/notificationActions';
import { NotificationResponse } from '@/services/types/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Hash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import DetailsCard from '../atoms/DetailsCard';
import DetailsCardField from '../atoms/DetailsCardField';
import ActionButtonGroup from './ActionButtonGroup';

interface NotificationListProps {
  data: NotificationResponse[];
  showRelatedPatient?: boolean;
  isSimplified?: boolean;
}

export default function NotificationList({
  data,
  showRelatedPatient = false,
}: NotificationListProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const deleteNotificationMutation = useMutation({
    mutationFn: deleteNotificationAction,
    onSuccess: () => {
      // Invalidate and refetch patients list after successful deletion
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const handleNotificationDeletion = (notificationId: string) => {
    // TODO: Improve this
    if (confirm('Are you sure you want to delete this patient?')) {
      deleteNotificationMutation.mutate(notificationId);
    }
  };

  if (!data) {
    return null;
  }

  return data.length ? (
    <div className="flex flex-col gap-y-2">
      {data.map((notification, index) => (
        <DetailsCard key={notification._id ?? index}>
          <div className="mb-4 flex items-center justify-between">
            <span className="flex items-center">
              <Hash size={18} />
              &nbsp;{notification?._id}
            </span>
            <ActionButtonGroup
              edit={{
                action: () =>
                  router.push(
                    `/patients/${notification?.patient}/notifications/${notification?._id}`
                  ),
              }}
              remove={{
                action: () => () =>
                  handleNotificationDeletion(notification?._id),
                isDisabled: deleteNotificationMutation.isPending,
              }}
            />
          </div>

          <DetailsCardField label="SINAN" value={notification?.sinan} />
          <DetailsCardField
            label="Observações"
            value={notification?.observations}
            isBordered={showRelatedPatient}
          />

          {showRelatedPatient ? (
            <DetailsCardField
              label="Identificador do paciente"
              value={notification?.patient}
              isBordered={false}
            />
          ) : null}
        </DetailsCard>
      ))}
    </div>
  ) : (
    <p>Nenhum tratamento foi cadastrado para este paciente.</p>
  );
}
