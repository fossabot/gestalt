// @flow

import * as React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import colors from './Colors.css';
import styles from './Text.css';
import typography from './Typography.css';

const SIZE_SCALE: { [size: ?string]: number } = {
  sm: 1,
  md: 2,
  lg: 3,
};

type Props = {|
  align?: 'left' | 'right' | 'center' | 'justify',
  children?: React.Node,
  color?:
    | 'green'
    | 'pine'
    | 'olive'
    | 'blue'
    | 'navy'
    | 'midnight'
    | 'purple'
    | 'orchid'
    | 'eggplant'
    | 'maroon'
    | 'watermelon'
    | 'orange'
    | 'darkGray'
    | 'gray'
    | 'lightGray'
    | 'red'
    | 'white',
  inline?: boolean,
  italic?: boolean,
  overflow?: 'normal' | 'breakWord',
  size?: 'sm' | 'md' | 'lg',
  leading?: 'tall' | 'short',
  truncate?: boolean,
  weight?: 'bold' | 'normal',
  __dangerouslyIncreaseLineHeight?: boolean,
|};

function MenuButtonExample() {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef();

  return (
    <Box>
      <Box display="inlineBlock" ref={anchorRef}>
        <Button
          accessibilityExpanded={!!open}
          accessibilityHaspopup
          color="white"
          iconEnd="arrow-down"
          inline
          onClick={() => setOpen(!open)}
          text="Menu"
        />
      </Box>

      {open && (
        <Layer>
          <Flyout
            anchor={anchorRef.current}
            idealDirection="down"
            onDismiss={() => setOpen(false)}
            positionRelativeToAnchor={false}
            size="md"
          >
            <Box direction="column" display="flex" padding={2}>
              <Box padding={2}>
                <Text weight="bold">Option 1</Text>
              </Box>
              <Box padding={2}>
                <Text weight="bold">Option 2</Text>
              </Box>
            </Box>
          </Flyout>
        </Layer>
      )}
    </Box>
  );
}

export default function Text({
  align = 'left',
  children,
  color = 'darkGray',
  inline = false,
  italic = false,
  overflow = 'breakWord',
  size = 'lg',
  leading,
  truncate = false,
  weight = 'normal',
  __dangerouslyIncreaseLineHeight = false,
}: Props) {
  const scale = SIZE_SCALE[size];

  const cs = cx(
    styles.Text,
    styles[`fontSize${scale}`],
    color === 'blue' && colors.blue,
    color === 'darkGray' && colors.darkGray,
    color === 'eggplant' && colors.eggplant,
    color === 'gray' && colors.gray,
    color === 'green' && colors.green,
    color === 'lightGray' && colors.lightGray,
    color === 'maroon' && colors.maroon,
    color === 'midnight' && colors.midnight,
    color === 'navy' && colors.navy,
    color === 'olive' && colors.olive,
    color === 'orange' && colors.orange,
    color === 'orchid' && colors.orchid,
    color === 'pine' && colors.pine,
    color === 'purple' && colors.purple,
    color === 'red' && colors.red,
    color === 'watermelon' && colors.watermelon,
    color === 'white' && colors.white,
    leading === 'short' && typography.leadingShort,
    (leading === 'tall' || __dangerouslyIncreaseLineHeight) &&
      typography.leadingTall,
    align === 'center' && typography.alignCenter,
    align === 'justify' && typography.alignJustify,
    align === 'left' && typography.alignLeft,
    align === 'right' && typography.alignRight,
    overflow === 'breakWord' && typography.breakWord,
    italic && typography.fontStyleItalic,
    weight === 'bold' && typography.fontWeightBold,
    weight === 'normal' && typography.fontWeightNormal,
    truncate && typography.truncate
  );
  const Tag = inline ? 'span' : 'div';

  return (
    <Tag
      className={cs}
      {...(truncate && typeof children === 'string'
        ? { title: children }
        : null)}
    >
      {children}
    </Tag>
  );
}

Text.propTypes = {
  __dangerouslyIncreaseLineHeight: PropTypes.bool,
  align: PropTypes.oneOf(['left', 'right', 'center', 'justify']),
  children: PropTypes.node,
  color: PropTypes.oneOf([
    'green',
    'pine',
    'olive',
    'blue',
    'navy',
    'midnight',
    'purple',
    'orchid',
    'eggplant',
    'maroon',
    'watermelon',
    'orange',
    'darkGray',
    'gray',
    'lightGray',
    'red',
    'white',
  ]),
  inline: PropTypes.bool,
  italic: PropTypes.bool,
  leading: PropTypes.oneOf(['tall', 'short']),
  overflow: PropTypes.oneOf(['normal', 'breakWord']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  truncate: PropTypes.bool,
  weight: PropTypes.oneOf(['bold', 'normal']),
};
