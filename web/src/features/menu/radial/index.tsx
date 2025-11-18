import { Box, createStyles } from '@mantine/core';
import { useEffect, useState } from 'react';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { useNuiEvent } from '../../../hooks/useNuiEvent';
import { fetchNui } from '../../../utils/fetchNui';
import { isIconUrl } from '../../../utils/isIconUrl';
import ScaleFade from '../../../transitions/ScaleFade';
import type { RadialMenuItem } from '../../../typings';
import { useLocales } from '../../../providers/LocaleProvider';
import LibIcon from '../../../components/LibIcon';

const useStyles = createStyles((theme) => ({
  wrapper: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
  hex: {
    fill: "#161616ff",
    stroke: "#373737",
    strokeWidth: 1,
    transition: 'fill 0.35s',
    '&:hover': {
      fill: "rgba(255, 255, 255, 1)",
      cursor: 'pointer',
      '& ~ g text': {
        fill: '#000',
      },
      '& ~ g svg path': {
        fill: '#000',
      },
    },
  },
  centerHex: {
    opacity: ".9",
    fill: "#ffffffff",
    transition: 'opacity 0.3s',
    '&:hover': {
      opacity: "1",
      cursor: 'pointer',
    },
  },
  iconText: {
    fill: '#fff',
    pointerEvents: 'none',
    textAnchor: 'middle',
    fontFamily: "Inter",
    fontSize: 10,
    fontWeight: 600,
  },
  centerIconContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    pointerEvents: 'none',
  },
  centerIcon: {
    color: '#373737',
  },
}));

const roundedHexPath = (cx: number, cy: number, size: number, radius: number) => {
  const angleStep = Math.PI / 3;
  let path = '';
  for (let i = 0; i < 6; i++) {
    const angle = angleStep * i - Math.PI / 6;
    const nextAngle = angleStep * (i + 1) - Math.PI / 6;

    const x1 = cx + size * Math.cos(angle);
    const y1 = cy + size * Math.sin(angle);
    const x2 = cx + size * Math.cos(nextAngle);
    const y2 = cy + size * Math.sin(nextAngle);

    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.sqrt(dx * dx + dy * dy);
    const ux = dx / len;
    const uy = dy / len;

    const startX = x1 + ux * radius;
    const startY = y1 + uy * radius;
    const endX = x2 - ux * radius;
    const endY = y2 - uy * radius;

    if (i === 0) path += `M ${startX} ${startY}`;
    else path += ` L ${startX} ${startY}`;

    path += ` Q ${x2} ${y2} ${endX} ${endY}`;
  }
  path += ' Z';
  return path;
};


const radius = 3;
const PAGE_ITEMS = 6;

const RadialMenu: React.FC = () => {
  const { classes } = useStyles();
  const { locale } = useLocales();
  const newDimension = 350 * 1.1025;
  const [visible, setVisible] = useState(false);
  const [menuItems, setMenuItems] = useState<RadialMenuItem[]>([]);
  const [menu, setMenu] = useState<{ items: RadialMenuItem[]; sub?: boolean; page: number }>({
    items: [],
    sub: false,
    page: 1,
  });

  const changePage = async (increment?: boolean) => {
    setVisible(false);
    const didTransition: boolean = await fetchNui('radialTransition');
    if (!didTransition) return;
    setVisible(true);
    setMenu({ ...menu, page: increment ? menu.page + 1 : menu.page - 1 });
  };

  useEffect(() => {
    if (menu.items.length <= PAGE_ITEMS) return setMenuItems(menu.items);
    const items = menu.items.slice(
      PAGE_ITEMS * (menu.page - 1) - (menu.page - 1),
      PAGE_ITEMS * menu.page - menu.page + 1
    );
    if (PAGE_ITEMS * menu.page - menu.page + 1 < menu.items.length) {
      items[items.length - 1] = { icon: 'ellipsis-h', label: locale.ui.more || "More", isMore: true };
    }
    setMenuItems(items);
  }, [menu.items, menu.page]);

  useNuiEvent('openRadialMenu', async (data: { items: RadialMenuItem[]; sub?: boolean; option?: string } | false) => {
    if (!data) return setVisible(false);
    let initialPage = 1;
    if (data.option) {
      data.items.findIndex(
        (item, index) => item.menu == data.option && (initialPage = Math.floor(index / PAGE_ITEMS) + 1)
      );
    }
    setMenu({ ...data, page: initialPage });
    setVisible(true);
  });

  useNuiEvent('refreshItems', (data: RadialMenuItem[]) => {
    setMenu({ ...menu, items: data });
  });

  function truncateText(text: string, maxLength: number): string {
    if (typeof text !== 'string') return '';
    if (text.length <= maxLength) return text;
    return text.slice(0, Math.max(0, maxLength - 3)) + '...';
  }

  // 🐝 Honeycomb layout konumları
  // Üst 2, orta 2, alt 2 olacak şekilde (x,y koordinatları)
  const hexSize = 50;
  const gap = 5;
  const horizontal = hexSize * Math.sqrt(3) + gap;
  const vertical = hexSize * 1.5 + gap;

  const positions = [
    { x: 175 - horizontal / 2, y: 175 - vertical }, // üst sol
    { x: 175 + horizontal / 2, y: 175 - vertical }, // üst sağ
    { x: 175 - horizontal, y: 175 }, // orta sol
    { x: 175 + horizontal, y: 175 }, // orta sağ
    { x: 175 - horizontal / 2, y: 175 + vertical }, // alt sol
    { x: 175 + horizontal / 2, y: 175 + vertical }, // alt sağ
  ];

  return (
    <Box
      className={classes.wrapper}
      onContextMenu={async () => {
        if (menu.page > 1) await changePage();
        else if (menu.sub) fetchNui('radialBack');
      }}
    >
      <ScaleFade visible={visible}>
        <svg
          style={{ overflow: 'visible' }}
          width={`${newDimension}px`}
          height={`${newDimension}px`}
          viewBox="0 0 350 350"
        >
          {/* 6 dış altıgen */}
          {menuItems.slice(0, 6).map((item, index) => {
            const { x, y } = positions[index];
            return (
              <g
                key={index}
                onClick={async () => {
                  const clickIndex = menu.page === 1 ? index : PAGE_ITEMS * (menu.page - 1) - (menu.page - 1) + index;
                  if (!item.isMore) fetchNui('radialClick', clickIndex);
                  else await changePage(true);
                }}
              >
                <path d={roundedHexPath(x, y, hexSize, radius)} className={classes.hex} />
                <g transform={`translate(${x}, ${y + 5})`} pointerEvents="none">
                  {typeof item.icon === 'string' && isIconUrl(item.icon) ? (
                    <image href={item.icon} width={30} height={30} x={-15} y={-35} />
                  ) : (
                    <LibIcon
                      icon={item.icon as IconProp}
                      x={-13}
                      y={-30}
                      width={26}
                      height={26}
                      fixedWidth
                    />
                  )}
                  <text className={classes.iconText} x={0} y={15}>
                    {truncateText(item.label, 14)}
                  </text>
                </g>
              </g>
            );
          })}

          {/* Merkez altıgen */}
          <g
            transform={`translate(175,175)`}
            onClick={async () => {
              if (menu.page > 1) await changePage();
              else {
                if (menu.sub) fetchNui('radialBack');
                else {
                  setVisible(false);
                  fetchNui('radialClose');
                }
              }
            }}
          >
            <path d={roundedHexPath(0, 0, 45, radius)} className={classes.centerHex} />
          </g>
        </svg>

        <div className={classes.centerIconContainer}>
          <LibIcon
            icon={!menu.sub && menu.page < 2 ? 'xmark' : 'arrow-rotate-left'}
            fixedWidth
            className={classes.centerIcon}
            color="#fff"
            size="2x"
          />
        </div>
      </ScaleFade>
    </Box>
  );
};

export default RadialMenu;
