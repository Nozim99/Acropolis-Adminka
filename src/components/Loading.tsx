import {IconLoading} from "./Icons.tsx";

const Loading = () => (
    <div className={"fixed inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-[2px]"}>
        <IconLoading/>
    </div>
)

export default Loading