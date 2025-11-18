import { Button, createStyles, Group, HoverCard, Image, Progress, Stack, Text } from '@mantine/core';
import ReactMarkdown from 'react-markdown';
import { ContextMenuProps, Option } from '../../../../typings';
import { fetchNui } from '../../../../utils/fetchNui';
import { isIconUrl } from '../../../../utils/isIconUrl';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import MarkdownComponents from '../../../../config/MarkdownComponents';
import LibIcon from '../../../../components/LibIcon';

const openMenu = (id: string | undefined) => {
  fetchNui<ContextMenuProps>('openContext', { id: id, back: false });
};

const clickContext = (id: string) => {
  fetchNui('clickContext', id);
};

const useStyles = createStyles((theme, params: { disabled?: boolean; readOnly?: boolean }) => ({
  inner: {
    justifyContent: 'flex-start',
  },
  iconImage: {
    maxWidth: '2.3148vh',
  },
  buttonStack: {
    gap: "0.1852vh",
    flex: '1',
  },
  buttonGroup: {
    gap: "0.3704vh",
    flexWrap: 'nowrap',
  }
}));

const ContextButton: React.FC<{
  option: [string, Option];
}> = ({ option }) => {
  const button = option[1];
  const buttonKey = option[0];
  const { classes } = useStyles({ disabled: button.disabled, readOnly: button.readOnly });

  return (
    <>
      <HoverCard
        position="right-start"
        disabled={button.disabled || !(button.metadata || button.image)}
        openDelay={200}
      >
        <HoverCard.Target>
          <Button
            className={"buttonsFlexWrapper"}
            onClick={() =>
              !button.disabled && !button.readOnly
                ? button.menu
                  ? openMenu(button.menu)
                  : clickContext(buttonKey)
                : null
            }
            variant="default"
            disabled={button.disabled}
          >
            <Group position="apart" w="100%" noWrap>
              <Stack className={classes.buttonStack}>
                {(button.title || Number.isNaN(+buttonKey)) && (
                  <Group className={classes.buttonGroup}>
                    {button?.icon && (
                      <Stack className={"buttonIconContainer"}>
                        {typeof button.icon === 'string' && isIconUrl(button.icon) ? (
                          <img src={button.icon} className={classes.iconImage} alt="" />
                        ) : (
                          <LibIcon
                            icon={button.icon as IconProp}
                            fixedWidth
                            size="sm"
                            className='contexticon'
                            style={{ marginLeft: "-.25vh", color: button.disabled ? '#afafafff' : '#FFFFFF' }}
                            animation={button.iconAnimation}
                          />
                        )}
                      </Stack>
                    )}
                    <Text className={"buttonTitleText"}>
                      <ReactMarkdown components={MarkdownComponents}>{button.title || buttonKey}</ReactMarkdown>
                    </Text>
                  </Group>
                )}
                {button.description && (
                  <Text className={"description"}>
                    <ReactMarkdown components={MarkdownComponents}>{button.description}</ReactMarkdown>
                  </Text>
                )}
                {button.progress !== undefined && (
                  <Progress   classNames={{
                    root: 'progressRoot',
                    bar: 'progressBar'
                  }} value={button.progress} size="sm" color={button.colorScheme || 'dark.3'} />
                )}
              </Stack>
              {(button.menu || button.arrow) && button.arrow !== false && (
                <Stack className={"buttonArrowContainer"}>
                  <LibIcon className={"arrowIcon"} icon="chevron-right" fixedWidth />
                </Stack>
              )}
            </Group>
          </Button>
        </HoverCard.Target>
        <HoverCard.Dropdown className={"contextButtonHover"}>
          {button.image && <Image src={button.image} />}
          {Array.isArray(button.metadata) ? (
            button.metadata.map(
              (
                metadata: string | { label: string; value?: any; progress?: number; colorScheme?: string },
                index: number
              ) => (
                <>
                  <div className='contextButtonText' key={`context-metadata-${index}`}>
                    {typeof metadata === 'string' ? `${metadata}` : `${metadata.label}: ${metadata?.value ?? ''}`}
                  </div>

                  {typeof metadata === 'object' && metadata.progress !== undefined && (
                    <Progress
                      value={metadata.progress}
                      size="sm"
                      color={metadata.colorScheme || button.colorScheme || 'dark.3'}
                    />
                  )}
                </>
              )
            )
          ) : (
            <>
              {typeof button.metadata === 'object' &&
                Object.entries(button.metadata).map((metadata: { [key: string]: any }, index) => (
                  <Text key={`context-metadata-${index}`}>
                    {metadata[0]}: {metadata[1]}
                  </Text>
                ))}
            </>
          )}
        </HoverCard.Dropdown>
      </HoverCard>
    </>
  );
};

export default ContextButton;
