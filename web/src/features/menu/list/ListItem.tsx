import { Box, createStyles, Group, Progress, Stack, Text } from '@mantine/core';
import React, { forwardRef } from 'react';
import CustomCheckbox from './CustomCheckbox';
import type { MenuItem } from '../../../typings';
import { isIconUrl } from '../../../utils/isIconUrl';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import LibIcon from '../../../components/LibIcon';

interface Props {
  item: MenuItem;
  index: number;
  scrollIndex: number;
  checked: boolean;
}

const useStyles = createStyles((theme, params: { iconColor?: string }) => ({
  buttonContainer: {
    border: "1 solid rgba(255, 255, 255, 0.0)",
    background: "rgba(66, 66, 66, 0.0)",
    borderRadius: theme.radius.md,
    padding: "0.9259vh",
    height: "4.6296vh",
    scrollMargin: "0.7407vh",
    '&:focus': {
      background: "#37373746",
      outline: 'none',
    },
  },
  iconImage: {
    maxWidth: "2.963vh",
  },
  buttonWrapper: {
    paddingLeft: "0.9259vh",
    paddingRight: "0.9259vh",
    height: '100%',
  },
  iconContainer: {
    display: 'flex',
    alignItems: 'center',
    width: "2.037vh",
    height: "2.037vh",
  },
  icon: {
    fontSize: "1.6667vh",
    color: '#fff',
  },
  label: {
    verticalAlign: 'middle',
    color: "#FFF",
    fontFamily: "Inter",
    fontSize: "1.15vh",
    fontWeight: 600,
    width: "12vh",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis"
  },
  chevronIcon: {
    width: "1.95vh",
    height: "2vh",
    borderRadius: "0.2778vh",
    background: "#fff"
  },
  scrollIndexValue: {
    paddingTop: ".35vh",
    textAlign: "center",
    width: "3.2407vh",
    height: "2.2222vh",
    borderRadius: "0.2778vh",
    background: "rgba(217, 217, 217, 0.18)",
    color: "#FFF",
    fontFamily: "Inter",
    fontSize: "0.9259vh",
    fontWeight: 600,
    letterSpacing: ".1vh"
  },
  progressStack: {
    width: '100%',
    marginRight: "0.463vh",
    height: "110%"
  },
  progressLabel: {
    color: "#FFF",
    fontFamily: "Inter",
    fontSize: "1.25vh",
    fontWeight: 600
  },
}));

const ListItem = forwardRef<Array<HTMLDivElement | null>, Props>(({ item, index, scrollIndex, checked }, ref) => {
  const { classes } = useStyles({ iconColor: item.iconColor });

  return (
    <Box
      tabIndex={index}
      className={classes.buttonContainer}
      key={`item-${index}`}
      ref={(element: HTMLDivElement) => {
        if (ref)
          // @ts-ignore i cba
          return (ref.current = [...ref.current, element]);
      }}
    >
      <Group spacing={15} noWrap className={classes.buttonWrapper}>
        {item.icon && (
          <Box className={classes.iconContainer}>
            {typeof item.icon === 'string' && isIconUrl(item.icon) ? (
              <img src={item.icon} alt="Missing image" className={classes.iconImage} />
            ) : (
              <LibIcon
                icon={item.icon as IconProp}
                className={classes.icon}
                fixedWidth
                animation={item.iconAnimation}
              />
            )}
          </Box>
        )}
        {Array.isArray(item.values) ? (
          <Group position="apart" w="100%">
            <Stack spacing={0} justify="space-between">
              <Text className={classes.label}>{item.label}</Text>
              <Text className='menuText'>
                {typeof item.values[scrollIndex] === 'object'
                  ? // @ts-ignore for some reason even checking the type TS still thinks it's a string
                    item.values[scrollIndex].label
                  : item.values[scrollIndex]}
              </Text>
            </Stack>
            <Group spacing={1} position="center">
              <Box className={classes.chevronIcon} style={{
                marginRight: "0.2778vh"
              }}>
                <LibIcon icon="chevron-left" style={{ display: "flex", marginTop: ".45vh", color: "#3D3D3D", paddingLeft: ".6vh", fontSize: "1.15vh" }} />
              </Box>
              <Text className={classes.scrollIndexValue}>
                {scrollIndex + 1}/{item.values.length}
              </Text>
              <Box className={classes.chevronIcon} style={{
                marginLeft: "0.2778vh"
              }}>
                <LibIcon icon="chevron-right" style={{ display: "flex", marginTop: ".45vh", color: "#3D3D3D", paddingLeft: ".6vh", fontSize: "1.15vh" }} />
              </Box>
            </Group>
          </Group>
        ) : item.checked !== undefined ? (
          <Group position="apart" w="100%">
            <Text className='menuHeader'>{item.label}</Text>
            <CustomCheckbox checked={checked}></CustomCheckbox>
          </Group>
        ) : item.progress !== undefined ? (
          <Stack className={classes.progressStack} spacing={0}>
            <Text className={classes.progressLabel}>{item.label}</Text>
            <Progress
              classNames={{
                root: 'progressRoot2',
                bar: 'progressBar2',
              }}
              value={item.progress}
              styles={(theme) => ({ root: { backgroundColor: theme.colors.dark[3] } })}
            />
          </Stack>
        ) : (
          <Text className='menuHeader'>{item.label}</Text>
        )}

      </Group>
    </Box>
  );
});

export default React.memo(ListItem);
