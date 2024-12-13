import MovieCheckout from "../components/MovieCheckoutCard";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAccount, useReadContract } from "wagmi";
import { contractAddress, ABI } from "@/utils/contractDetails";
import { useParams } from "react-router-dom";
import "../utils/loader.css"

interface posterData {
  movieId: number,
  name: string;
  description: string;
  ipfsHash: string;
  price: number;
}

const Payment = () => {

  const { id } = useParams();
  const { address } = useAccount();

  console.log(address)

  const { data, isPending }: { data: posterData[] | undefined, isPending: boolean | undefined, isError: any } = useReadContract({
    abi: ABI,
    address: contractAddress,
    functionName: "getAllPosters",
    args: []
  })

  console.log(data)

  if (isPending) {
    return <div className="flex w-screen h-screen justify-center items-center">
      <div className="loader"></div>
    </div>
  }

  return (
    <div className="flex flex-col">
      <Navbar />
      <div className=" relative w-full flex">
        <img src={`https://maroon-fashionable-warbler-188.mypinata.cloud/ipfs/${data[id].ipfsHash.replace("ipfs://", "")}?pinataGatewayToken=gVQfpvbN3IXW52kARQuLO50y78ginsP31oSkPQT78K23fingxRmnt7u0tHk2lnFk`} className="w-full blur-3xl h-[80vh]" />
        <div className="absolute h-[80vh] w-full flex">
          <div className="w-3/5 h-full flex justify-center items-center">
            <img src={`https://maroon-fashionable-warbler-188.mypinata.cloud/ipfs/${data[id].ipfsHash.replace("ipfs://", "")}?pinataGatewayToken=gVQfpvbN3IXW52kARQuLO50y78ginsP31oSkPQT78K23fingxRmnt7u0tHk2lnFk`} alt="" className="object-cover rounded-xl h-full w-11/12 m-auto" />
          </div>
          <div className="w-2/5 flex justify-center items-center h-full">
            <div className="h-full flex items-center justify-center">
              <MovieCheckout
                title={data === undefined || id === undefined ? ("") : (data[parseInt(id)].name)}
                gas={parseInt(data[id].price)}
                owner="0xb8B0C320ED4b7F9Fda8A2408F4C4044Bc5C8Bf41"
                description={data === undefined || id === undefined ? ("") : data[parseInt(id)].description}
                buyers={1230000}
                id={id === undefined ? (0) : (parseInt(id))}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="">
        <Footer />
      </div>
    </div>
  );
};

export default Payment;
