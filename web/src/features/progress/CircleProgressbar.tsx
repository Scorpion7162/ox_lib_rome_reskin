import React from 'react';
import {createStyles, keyframes, RingProgress, Stack, Text, useMantineTheme, Box} from '@mantine/core';
import {useNuiEvent} from '../../hooks/useNuiEvent';
import {fetchNui} from '../../utils/fetchNui';
import ScaleFade from '../../transitions/ScaleFade';
import type {CircleProgressbarProps} from '../../typings';

const progressCircle = keyframes({
  '0%': { strokeDasharray: `0, ${33.5 * 2 * Math.PI}` },
  '100%': { strokeDasharray: `${33.5 * 2 * Math.PI}, 0` },
});

const useStyles = createStyles((theme, params: { position: 'middle' | 'bottom'; duration: number }) => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: "8.7037vh",
    left: "69.05vh",
    position: 'absolute',
    borderRadius: "0.9259vh",
    width: "40vh",
    height: "8.2778vh",
    border: "0.0926vh solid #373737",
    background: "radial-gradient(140.75% 140.75% at 50% 50%, rgba(26, 27, 30, 0.97) 0%, rgba(8, 8, 9, 0.87) 100%), linear-gradient(156deg, rgba(255, 255, 255, 0.00) 38.82%, rgba(255, 255, 255, 0.10) 131.78%)"
  },
  progress: {
    marginTop: "0vh",
    width: "6.9444vh",
    height: "6.9444vh",
    '> svg': {
      display: "flex",
      width: "6.9444vh",
      height: "6.9444vh",
    },
    marginLeft: "-30vh",
    '> svg > circle:nth-child(1)': {
      display: "flex",
      width: "6.9444vh",
      height: "6.9444vh",
      stroke: "radial-gradient(50% 50% at 50% 50%, rgba(217, 217, 217, 0.00) 57.69%, rgba(115, 115, 115, 0.14) 100%)"
    },
    '> svg > circle:nth-child(2)': {
      display: "flex",
      width: "6.9444vh",
      height: "6.9444vh",
      transition: 'none',
      animation: `${progressCircle} linear forwards`,
      animationDuration: `${params.duration}ms`,
      stroke: "#FF4E62",
      boxShadow: "0 0 1.463vh 0 rgba(255, 78, 99, 0.53)"
    },
  },
  value: {
    textAlign: 'center',
    fontFamily: 'Inter',
    textShadow: theme.shadows.sm,
    color: theme.colors.gray[3],
  },
  label: {
    position: 'absolute',
    textAlign: "left",
    marginTop: "-1.75vh",
    marginLeft: "-13.25vh",
    color: "#fff",
    fontFamily: "Inter",
    fontSize: "1.4vh",
    fontWeight: 600
  },
  wrapper: {
    marginTop: params.position === 'middle' ? 25 : undefined,
  },
}));

const CircleProgressbar: React.FC = () => {
  const [visible, setVisible] = React.useState(false);
  const [progressDuration, setProgressDuration] = React.useState(0);
  const [position, setPosition] = React.useState<'middle' | 'bottom'>('middle');
  const [value, setValue] = React.useState(0);
  const [label, setLabel] = React.useState('');
  const theme = useMantineTheme();
  const { classes } = useStyles({ position, duration: progressDuration });

  useNuiEvent('progressCancel', () => {
    setValue(99);
    setVisible(false);
  });

  useNuiEvent<CircleProgressbarProps>('circleProgress', (data) => {
    if (visible) return;
    setVisible(true);
    setValue(0);
    setLabel(data.label || '');
    setProgressDuration(data.duration);
    setPosition(data.position || 'middle');
    const onePercent = data.duration * 0.01;
    const updateProgress = setInterval(() => {
      setValue((previousValue) => {
        const newValue = previousValue + 1;
        newValue >= 100 && clearInterval(updateProgress);
        return newValue;
      });
    }, onePercent);
  });

  return (
    <>
        <ScaleFade visible={visible} onExitComplete={() => fetchNui('progressComplete')}>
          <Box className={classes.container}>
            {/* <Stack spacing={0} align="center" className={classes.wrapper}> */}
              <RingProgress
                size={75}
                thickness={6}
                sections={[{ value: 0, color: theme.primaryColor }]}
                onAnimationEnd={() => setVisible(false)}
                className={classes.progress}
              />

              <div className="progbg2"></div>
              {label && <Text className={"classeslabel"}>Progressbar</Text> || <Text className={"classeslabel"}>Progressbar</Text>}
              <div className="percent2">
                <p>{value}%</p>
              </div>
              <div className="percent3">
                <p>{value}%</p>
              </div>

              <div className="pDesc2">The process will be complete when the bar is fully filled..</div>
            {/* </Stack> */}
          </Box>
        </ScaleFade>
    </>
  );
};

export default CircleProgressbar;
