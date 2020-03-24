// @flow
import * as React from 'react';
import Avatar from './Avatar.js';
import Box from './Box.js';
import Icon from './Icon.js';
import typography from './Typography.css';

type Props = {|
  collaborators: Array<{|
    name: string,
    src?: string,
  |}>,
  count?: string,
  icon?: 'add',
|};

export default function AvatarPair({ collaborators, icon, count }: Props) {
  const items = [
    ...collaborators.map(({ name, src }, index) => (
      <Avatar key={`${name}-${index}`} src={src} name={name} />
    )),
    ...(count
      ? [
          <Box
            key="count"
            width="100%"
            height="100%"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <svg
              width="100%"
              viewBox="-50 -50 100 100"
              version="1.1"
              preserveAspectRatio="xMidYMid meet"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>{count}</title>
              <text
                fontSize="40px"
                fill="#111"
                dominantBaseline="central"
                textAnchor="middle"
                className={[
                  typography.antialiased,
                  typography.sansSerif,
                  typography.fontWeightBold,
                ].join(' ')}
              >
                {count}
              </text>
            </svg>
          </Box>,
        ]
      : []),
    ...(icon
      ? [
          <Box
            key="icon"
            width="100%"
            height="100%"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Icon
              accessibilityLabel=""
              icon={icon}
              size="40%"
              color="darkGray"
            />
          </Box>,
        ]
      : []),
  ];

  return (
    <Box position="relative">
      <Box dangerouslySetInlineStyle={{ __style: { paddingBottom: '100%' } }} />
      {items.map((item, index) => (
        <Box
          color="lightGray"
          key={index}
          rounding="circle"
          position="absolute"
          height="100%"
          width="100%"
          dangerouslySetInlineStyle={{
            __style: {
              boxShadow: '#fff 0px 0px 0px 2px',
              left: index === 0 ? 0 : `calc(${index * 60}%`,
              top: 0,
            },
          }}
        >
          {item}
        </Box>
      ))}
    </Box>
  );
}
