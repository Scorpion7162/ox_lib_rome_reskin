import { TextUiProps } from '../../../typings';
import { debugData } from '../../../utils/debugData';

export const debugTextUI = () => {
  debugData<TextUiProps>([
    {
      action: 'textUi',
      data: {
        text: '[E] Fuel Vehicle',
        position: 'bottom-center',
        icon: 'hand',
      },
    },
  ]);
};
