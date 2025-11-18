import { createStyles, Group, Modal, Stack, useMantineTheme } from '@mantine/core';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import { fetchNui } from '../../utils/fetchNui';
import { useLocales } from '../../providers/LocaleProvider';
import remarkGfm from 'remark-gfm';
import type { AlertProps } from '../../typings';
import MarkdownComponents from '../../config/MarkdownComponents';

const useStyles = createStyles((theme) => ({
  contentStack: {
    color: theme.colors.dark[2],
  },
}));



const AlertDialog: React.FC = () => {
  const { locale } = useLocales();
  const { classes } = useStyles();
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const [dialogData, setDialogData] = useState<AlertProps>({
    header: '',
    content: '',
  });

  const closeAlert = (button: string) => {
    setOpened(false);
    fetchNui('closeAlert', button);
  };

  useNuiEvent('sendAlert', (data: AlertProps) => {
    setDialogData(data);
    setOpened(true);
  });

  useNuiEvent('closeAlertDialog', () => {
    setOpened(false);
  });

  return (
    <>
  {opened && (
    <div
      className="alertDialog"
      onClick={() => {
        if (!dialogData.closeOnClickOutside) return;
        setOpened(false);
        closeAlert('cancel');
      }}
    >
      <div
        className="custom-modal"
        style={{
          width: dialogData.size === 'md' ? '46.2963vh' : dialogData.size,
          maxHeight: dialogData.overflow === 'inside' ? '80vh' : 'unset',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {dialogData.header && (
          <div className="alertDialogHeader">
            <ReactMarkdown components={MarkdownComponents}>
              {dialogData.header}
            </ReactMarkdown>
          </div>
        )}

        {/* Content */}
        <div className="alertDialogText">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              ...MarkdownComponents,
              img: (props) => (
                <img style={{ maxWidth: "100%", maxHeight: "100%" }} {...props} />
              ),
            }}
          >
            {dialogData.content}
          </ReactMarkdown>

          <div className="alertDialogButtons">
            {dialogData.cancel && (
              <button
                className='cancelButton'
                onClick={() => closeAlert("cancel")}
              >
                {dialogData.labels?.cancel || locale.ui.cancel}
              </button>
            )}

            <button
                className='confirmButton'
              onClick={() => closeAlert("confirm")}
            >
              {dialogData.labels?.confirm || locale.ui.confirm}
            </button>
          </div>
        </div>
      </div>
    </div>
  )}
    </>
  );
};

export default AlertDialog;
