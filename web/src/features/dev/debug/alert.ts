import { debugData } from '../../../utils/debugData';
import { AlertProps } from '../../../typings';

export const debugAlert = () => {
  debugData<AlertProps>([
    {
      action: 'sendAlert',
      data: {
        header: 'Ernesto Valverde',
        content: 'This action cannot be undone. This will permanently delete your account and remove your data from our servers.',
        centered: true,
        size: 'lg',
        overflow: true,
        cancel: true,
        // labels: {
        //   confirm: 'Ok',
        //   cancel: 'Not ok',
        // },
      },
    },
  ]);
};
