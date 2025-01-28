import { ABI, contractAddress } from "../utils/contractDetails";
import { useAccount, useReadContracts } from "wagmi";
import "../utils/loader.css"
import "../utils/trouble.css"
import Navbar from "./Navbar";
import { UserMovieCard } from "./MovieCard";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useEffect } from "react";

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

    useEffect(() => {console.log(data)}, [data])

    if(!address) {
        return <div className="flex flex-col h-screen w-screen justify-center items-center gap-y-10">
          <div className="text-red-500 text-2xl">Please Connect Your Wallet First</div>
          <div><ConnectButton/></div>
        </div>
    }

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
        return <div className="w-full justify-center items-center flex flex-col">
            <div className="w-full">
                <Navbar />  
            </div>
            <div className="w-10/12 flex flex-col gap-y-7">
                <div className="flex flex-col w-full gap-y-4">
                    <h1 className="text-5xl text-white font-hanalei">Your Movies</h1>
                    <div className="flex gap-x-3">
                        <input
                            type="text"
                            placeholder="TRUE MAN SHOW..."
                            className="rounded text-center text-xl text-black placeholder:text-black happy-monkey-regular outline-none border-none p-1 opacity-60 w-7/12"
                        />
                        <button className="font-hanalei text-2xl bg-[#1EFF00] px-3 rounded">
                            SEARCH
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-3 w-full gap-5 mt-5">
                    {(data as any[])[0].result.filter((item: any) => {
                        const id = item.movieId;
                        return (data as any[])[1].result.find((movieId: any) => { console.log(movieId, id); return movieId === id});
                    }).map((item: any, index: number) => {
                        console.log(item)
                        return <UserMovieCard
                                key={index}
                                video={{
                                    movieId: item.movieId.toString(),
                                    name: item.name,
                                    description: item.description,
                                    ipfsHash: item.ipfsHash,
                                    price: item.price.toString(),
                                  }}
                            />
                    })}
                </div>
            </div>
        </div>
    }
}

export default Testing;