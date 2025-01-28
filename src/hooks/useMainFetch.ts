import {useQuery} from "react-query";
import {myFetch} from "../utils/myFetch.ts";


interface ArgTypes {
    key: string;
    endpoint: string;
    generateData?: any;
}

const useMainFetch = (
    {
        key,
        endpoint,
        generateData = (val: any) => val
    }: ArgTypes) => {
    return useQuery(
        key,
        () => myFetch({endpoint}).then(data => generateData(data)),
    )
};

export default useMainFetch;