import Video from "../components/Video";
import Navbar from "../components/Navbar";
import MovieInfo from "../components/MovieInfo";
import { video } from "@/DummyData/videosData";
import MovieCard from "@/components/MovieCard";
import { useReadContracts } from "wagmi";
import { ABI, contractAddress } from "@/utils/contractDetails";
import { useParams } from "react-router-dom";
import "../utils/loader.css"

const TrailerPlayer = () => {
  const { id } = useParams();

  const { data, isPending, error } = useReadContracts({
    contracts: [
      {
        abi: ABI,
        address: contractAddress,
        args: [id],
        functionName: "getTrailer",
      },
      {
        abi: ABI,
        address: contractAddress,
        args: [id],
        functionName: "getPoster",
      },
      {
        abi: ABI,
        address: contractAddress,
        functionName: "getAllPosters",
        args: [],
      }
    ]
  })

  if (isPending) {
    return <div className="flex w-screen h-screen justify-center items-center">
      <div className="loader"></div>
    </div>
  }
  if (error) {
    return <div>error...</div>
  }
  else {
    return (
      <div className="w-full h-full pb-10">
        <Navbar />
        <div className="flex flex-col gap-y-12  justify-center items-center">
          <div className="flex flex-col w-full relative items-center bg-[#292929] h-[180vh]">
            <img src={`https://turquoise-certain-fox-148.mypinata.cloud/ipfs/${(data as any[])[1].result.ipfsHash.replace("ipfs://", "")}`} className="w-full absolute blur-3xl h-[90vh]" />
            <div className="flex pt-10 gap-y-6 flex-col absolute top-0 w-full justify-center items-center">
              <div className="flex gap-x-2 text-white justify-center items-center">
                <span className="font-hanalei text-4xl">{(data as any[])[1].result.name}</span>
                <span className="font-hanalei text-4xl text-[#1EFF00]">Trailer</span>
                <div className="border border-[#1EFF00] rounded-full px-3 py-1">
                  <span className="font-hanalei text-xl">Owner:</span>
                  <span className="font-hanalei text-xl">0x567A027B2f96bbf8D47c133e13A54862D565bcd6</span>
                </div>
              </div>
              <Video link={`https://turquoise-certain-fox-148.mypinata.cloud/ipfs/${(data as any[])[0].result.replace("ipfs://", "")}`} />
              <div className="w-full justify-center items-center flex bottom-[0] font-hanalei">
                <MovieInfo
                  title={(data as any[])[1].result.name}
                  owner="0x567a027b2f96b8fbd47c133e13a5482d565b6dc6"
                  amount={(data as any[])[1].result.price.toString()}
                  imdbRating="8.8/10"
                  description={(data as any[])[1].result.description}
                  posterUrl={`https://turquoise-certain-fox-148.mypinata.cloud/ipfs/${(data as any[])[1].result.ipfsHash.replace("ipfs://", "")}`}
                  id = {id}
                />
              </div>
            </div>
          </div>
          <div className="px-10 w-10/12 max-w-[1600px] flex flex-col gap-y-2">
            <div className="flex justify-between text-xl">
              <h2 className="font-hanalei text-3xl text-[#1EFF00]">Movies to Rent</h2>
            </div>
            <div className="flex w-full gap-5 px-10">
              {
                (data as any[])[2].result.map((video: video | any, index : number) => {
                  return (
                    <MovieCard key={index} video={video} />
                  )
                })
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default TrailerPlayer;