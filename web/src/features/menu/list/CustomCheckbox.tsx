import { Checkbox, createStyles } from '@mantine/core';

const useStyles = createStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    width: "2",
    fontSize: "2vh",
    backgroundColor: theme.colors.dark[7],
    '&:checked': { backgroundColor: "#FFF", borderColor: "#3D3D3D" },
  },
  inner: {
    '> svg > path': {
      fill: "#3D3D3D",
    }
  },
}));

const CustomCheckbox: React.FC<{ checked: boolean }> = ({ checked }) => {
  const { classes } = useStyles();
  return (
    <Checkbox
      checked={checked}
      classNames={{ root: classes.root, input: classes.input, inner: classes.inner }}
    />
  );
};

export default CustomCheckbox;
