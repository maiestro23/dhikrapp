import Svg, { Path } from 'react-native-svg';
import * as React from "react"

const CustomProfileIcon = (props: any) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={22}
    fill="none"
    {...props}
  >
    <Path
      stroke="#5A5D4D"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10 11.778c2.905 0 5.26-2.413 5.26-5.389C15.26 3.413 12.904 1 10 1S4.74 3.413 4.74 6.39c0 2.975 2.355 5.388 5.26 5.388Zm0 0c2.387 0 4.676.972 6.364 2.701A9.338 9.338 0 0 1 19 21m-9-9.222a8.892 8.892 0 0 0-6.364 2.701A9.338 9.338 0 0 0 1 21"
    />
  </Svg>
)
export default CustomProfileIcon