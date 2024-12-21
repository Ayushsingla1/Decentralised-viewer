import { ABI, contractAddress } from "../utils/contractDetails";
import { useAccount, useReadContracts } from "wagmi";
import "../utils/loader.css"
import "../utils/trouble.css"

const Testing = () => {

    const { address } = useAccount();

    const { data, isPending, error } = useReadContracts({
        contracts: [
            {
                abi: ABI,
                address: contractAddress,
                functionName: "getAllPosters",
                args: []
            },
            {
                abi: ABI,
                address: contractAddress,
                functionName: "getUserMovies",
                args: [address],
            },
        ]
    })

    if(error) {
        return <div className="flex w-screen h-screen justify-center items-center">
            <div className="trouble">We are in trouble</div>
        </div>
    }
    if (isPending) {
        return <div className="flex w-screen h-screen justify-center items-center">
            <div className="loader"></div>
        </div>
    }
    else {
        return <div>
            {(data as any[])[0].result.filter((item: any) => {
                const id = item.movieId;
                return (data as any[])[1].result.find((movieId: any) => movieId === id);
            }).map((item: any, index: number) => {
                return <div key={index}>
                    <div className="text-white">{item.name}</div>
                </div>
            })}
        </div>
    }
}

export default Testing;