import React from 'react';
import { SvgXml } from 'react-native-svg';

const bookLineSvg = `
<svg width="402" height="143" viewBox="0 0 402 143" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M201 71.5H1M201 71.5H401" stroke="#181818" stroke-width="0.5" stroke-opacity="0.1"/>
  <path d="M151 71.5L201 71.5" stroke="#181818"/>
</svg>
`;

export function BookLine() {
  return <SvgXml xml={bookLineSvg} width="100%" height="100%" />;
}