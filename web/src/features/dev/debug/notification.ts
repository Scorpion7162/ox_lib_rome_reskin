import { NotificationProps } from '../../../typings';
import { debugData } from '../../../utils/debugData';

export const debugCustomNotification = () => {
  debugData<NotificationProps>([
    {
      action: 'notify',
      data: {
        title: 'Success',
        description: 'Notification description will coming soon',
        type: 'success',
        id: 'pogchamp',
        duration: 5000,
        showDuration: true,
      },
    },
  ]);
  debugData<NotificationProps>([
    {
      action: 'notify',
      data: {
        duration: 5000,
        title: 'Error',
        description: 'Notification description',
        type: 'error',
        showDuration: true,
      },
    },
  ]);
  debugData<NotificationProps>([
    {
      action: 'notify',
      data: {
        duration: 5000,
        title: 'Custom icon success',
        description: 'Notification description',
        type: 'inform',
        showDuration: true,
      },
    },
  ]);
};
