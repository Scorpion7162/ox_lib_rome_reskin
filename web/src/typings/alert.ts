export interface AlertProps {
  header: string;
  content: string;
  centered?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  overflow?: boolean | 'inside' | 'outside';
  cancel?: boolean;
  labels?: {
    cancel?: string;
    confirm?: string;
  };
  
  overlayOpacity?: number;
  closeOnClickOutside?: boolean;
}