import { Button, createStyles } from '@mantine/core';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import LibIcon from '../../../../components/LibIcon';

interface Props {
  icon: IconProp;
  canClose?: boolean;
  iconSize: number;
  handleClick: () => void;
}

const useStyles = createStyles((theme, params: { canClose?: boolean }) => ({
  button: {
    borderRadius: "0.3704vh",
    flex: '1 15%',
    alignSelf: 'stretch',
    height: 'auto',
    textAlign: 'center',
    justifyContent: 'center',
    padding: "0.1852vh",
  },
  root: {
    border: 'none',
  },
  label: {
    color: params.canClose === false ? theme.colors.dark[2] : theme.colors.dark[0],
  },
}));

const HeaderButton2: React.FC<Props> = ({ icon, canClose, iconSize, handleClick }) => {
  const { classes } = useStyles({ canClose });

  return (
    <button
      className={"headerButton2"}
      disabled={canClose === false}
      onClick={handleClick}
    >
      <LibIcon className='headerButtonIcon' icon={icon} fixedWidth />
    </button>
  );
};

export default HeaderButton2;
