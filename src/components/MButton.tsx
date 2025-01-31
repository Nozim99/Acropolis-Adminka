import {Link} from "react-router-dom";
import {FC, ReactNode} from "react";

const MButton: FC<{ pathname: string, children: ReactNode }> = ({pathname, children}) => {
    return (
        <Link
            className={"flex text-white items-center justify-center border-[3px] rounded-[10px] border-[#D8A227] h-[64px] gap-x-[20px] w-[87%] mx-auto min-[425px]:w-[350px] md:w-[400px] md:h-[78px] lg:h-[82px] lg:w-[420px]"}
            to={pathname}
        >
            <span className={"text-[#D8A227] text-[60px] font-medium"}>+</span>
            <span className={"font-medium text-xl md:text-2xl lg:text-3xl"}>{children}</span>
        </Link>
    )
}

export default MButton;