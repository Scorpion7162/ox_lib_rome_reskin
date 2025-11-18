import { debugData } from '../../../utils/debugData';
import type { RadialMenuItem } from '../../../typings';

export const debugRadial = () => {
  debugData<{ items: RadialMenuItem[]; sub?: boolean }>([
    {
      action: 'openRadialMenu',
      data: {
        items: [
          { icon: 'palette', label: 'Paint' },
          { icon: 'warehouse', label: 'Garage' },
          { icon: 'palette', label: 'Quite Long Text' },
          { icon: 'palette', label: 'Fahrzeuginteraktionen' },
          { icon: 'palette', label: 'Fahrzeuginteraktionen' },
          { icon: 'palette', label: 'Paint' },
          { icon: 'palette', label: 'Paint' },
          { icon: 'palette', label: 'Paint' },
          { icon: 'palette', label: 'Paint' },
          { icon: 'palette', label: 'Paint' },
        ],
      },
    },
  ]);
};
