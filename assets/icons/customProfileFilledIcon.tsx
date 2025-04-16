import Svg, { Path } from 'react-native-svg';
import * as React from "react"

const CustomProfileFilledIcon = (props: any) => (
    <Svg
        xmlns="http://www.w3.org/2000/svg"
        width={18}
        height={20}
        fill="none"
        {...props}
    >
        <Path
            fill="#5A5D4D"
            d="M9 10.778c2.905 0 5.26-2.413 5.26-5.389C14.26 2.413 11.904 0 9 0S3.74 2.413 3.74 5.39c0 2.975 2.355 5.388 5.26 5.388Z"
        />
        <Path
            fill="#5A5D4D"
            d="M18 20a9.338 9.338 0 0 0-2.636-6.52A8.892 8.892 0 0 0 9 10.777a8.892 8.892 0 0 0-6.364 2.701A9.338 9.338 0 0 0 0 20"
        />
    </Svg>
)
export default CustomProfileFilledIcon