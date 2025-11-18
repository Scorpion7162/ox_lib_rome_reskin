import React from 'react';
import { Box, createStyles, Text } from '@mantine/core';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import { fetchNui } from '../../utils/fetchNui';
import ScaleFade from '../../transitions/ScaleFade';
import type { ProgressbarProps } from '../../typings';

const useStyles = createStyles((theme) => ({
  container: {
    width: "36vh",
    height: "0.5556vh",
    overflow: 'hidden',
    marginTop: "4.75vh",
    borderRadius: "5.5556vh",
    background: "rgba(217, 217, 217, 0.24)"
  },
  wrapper: {
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
  bar: {
    height: '100%',
    background: "#FF4E62",
    borderRadius: "5.5556vh",
    boxShadow: "0 0 1.463vh 0 rgba(255, 78, 98, 0.41)",
  },
  labelWrapper: {
    position: 'absolute',
    display: 'flex',
    width: "38.8889vh",
    height: "3.5vh",
    marginTop: "-2.25vh",
    marginLeft: "2.5vh",
  },
  label: {
    color: "#fff",
    marginLeft: ".35vh",
    fontFamily: "Inter",
    fontSize: "1.4vh",
    fontWeight: 600
  },
}));

const Progressbar: React.FC = () => {
  const { classes } = useStyles();
  const [visible, setVisible] = React.useState(false);
  const [label, setLabel] = React.useState('');
  const [duration, setDuration] = React.useState(0);
  const [percent, setPercent] = React.useState(0);

  useNuiEvent('progressCancel', () => setVisible(false));

  useNuiEvent<ProgressbarProps>('progress', (data) => {
    setVisible(true);
    setLabel(data.label);
    setDuration(data.duration);
    setPercent(0);

    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const percentage = Math.min((elapsed / data.duration) * 100, 100);
      setPercent(percentage);
      if (percentage >= 100) clearInterval(interval);
    }, 100);
  });

  return (
    <>
        <ScaleFade visible={visible} onExitComplete={() => fetchNui('progressComplete')}>
          <Box className={classes.wrapper}>
            <Box className={classes.labelWrapper}>
              <Text className={classes.label}>{label}</Text>
              <div className="percent">
                <p>{Math.round(percent)}%</p>
              </div>
            </Box>
            <div className="pDesc">The process will be complete when the bar is fully filled..</div>
            <Box className={classes.container}>
              <Box
                className={classes.bar}
                onAnimationEnd={() => setVisible(false)}
                sx={{
                  animation: 'progress-bar linear',
                  animationDuration: `${duration}ms`,
                }}
              ></Box>
            </Box>
          </Box>
        </ScaleFade>
    </>
  );
};

export default Progressbar;
