import Svg, { Path } from 'react-native-svg';
import * as React from "react"

const CustomDiscoverIcon = (props: any) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={22}
    height={22}
    fill="none"
    {...props}
  >
    <Path
      stroke="#5A5D4D"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m21 21-4.826-4.826m0 0a8.889 8.889 0 1 0-12.57-12.57 8.889 8.889 0 0 0 12.57 12.57Z"
    />
  </Svg>
)
export default CustomDiscoverIcon