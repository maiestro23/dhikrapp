import Svg, { Path } from 'react-native-svg';
import * as React from "react"

const CustomQuotesIcon = (props: any) => (
  <Svg
  xmlns="http://www.w3.org/2000/svg"
  width={21}
  height={22}
  fill="none"
  {...props}
>
  <Path
    stroke="#5A5D4D"
    strokeLinejoin="round"
    d="M6.038 1.668c2.229 1.74 3.488 4.447 3.488 7.346 0 4.35-2.81 9.086-8.138 11.986L1 20.323c3.197-2.223 4.748-4.832 4.748-7.636-.097-2.61-1.357-5.026-3.392-6.766-.58-.483-.872-1.256-.872-2.03-.096-.773.194-1.546.776-2.03C3.325.799 4.973.702 6.038 1.669Zm10.474 0C18.74 3.408 20 6.115 20 9.014c0 4.35-2.81 9.086-8.139 11.986l-.484-.677c3.294-2.223 4.844-4.832 4.844-7.636-.097-2.61-1.356-5.026-3.391-6.766-.581-.483-.969-1.256-.969-2.03 0-.773.29-1.546.872-2.03.97-1.063 2.616-1.16 3.779-.193Z"
  />
</Svg>
)
export default CustomQuotesIcon