import { useNuiEvent } from '../../../hooks/useNuiEvent';
import { Box, createStyles, Flex, Stack, Text } from '@mantine/core';
import { useEffect, useState } from 'react';
import { ContextMenuProps } from '../../../typings';
import ContextButton from './components/ContextButton';
import { fetchNui } from '../../../utils/fetchNui';
import ReactMarkdown from 'react-markdown';
import HeaderButton from './components/HeaderButton';
import HeaderButton2 from './components/HeaderButton2';
import ScaleFade from '../../../transitions/ScaleFade';
import MarkdownComponents from '../../../config/MarkdownComponents';

const openMenu = (id: string | undefined) => {
  fetchNui<ContextMenuProps>('openContext', { id: id, back: true });
};

const useStyles = createStyles((theme) => ({
  titleContainer: {
    borderRadius: "0.3704vh",
    flex: '1 85%',
    backgroundColor: theme.colors.dark[6],
  },
  titleText: {
    color: theme.colors.dark[0],
    padding: "0.5556vh",
    textAlign: 'center',
  },
  buttonsContainer: {
    height: "51.8519vh",
    overflowY: 'scroll',
  },
  buttonsFlexWrapper: {
    gap: "0.3389vh",
  },
}));

const ContextMenu: React.FC = () => {
  const { classes } = useStyles();
  const [visible, setVisible] = useState(false);
  const [contextMenu, setContextMenu] = useState<ContextMenuProps>({
    title: '',
    options: { '': { description: '', metadata: [] } },
  });

  const closeContext = () => {
    if (contextMenu.canClose === false) return;
    setVisible(false);
    fetchNui('closeContext');
  };

  useEffect(() => {
    if (!visible) return;

    const keyHandler = (e: KeyboardEvent) => {
      if (['Escape'].includes(e.code)) closeContext();
    };

    window.addEventListener('keydown', keyHandler);

    return () => window.removeEventListener('keydown', keyHandler);
  }, [visible]);

  useNuiEvent('hideContext', () => setVisible(false));

  useNuiEvent<ContextMenuProps>('showContext', async (data) => {
    if (visible) {
      setVisible(false);
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    setContextMenu(data);
    setVisible(true);
  });

  return (
    <div className={"container"}>
      <ScaleFade visible={visible}>
        <Flex className={"header"}>
          {contextMenu.menu && (
            <HeaderButton2 icon="chevron-left" iconSize={16} handleClick={() => openMenu(contextMenu.menu)} />
          )}
          <Box className={"titleContainer"}>
            <Text className={"titleText"}>
              <ReactMarkdown components={MarkdownComponents}>{contextMenu.title}</ReactMarkdown>
            </Text>
          </Box>
          <HeaderButton icon="xmark" canClose={contextMenu.canClose} iconSize={18} handleClick={closeContext} />
        </Flex>
        <Box className={classes.buttonsContainer}>
          <Stack className={classes.buttonsFlexWrapper}>
            {Object.entries(contextMenu.options).map((option, index) => (
              <ContextButton option={option} key={`context-item-${index}`} />
            ))}
          </Stack>
        </Box>
      </ScaleFade>
    </div>
  );
};

export default ContextMenu;
