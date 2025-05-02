import MovieCheckout from "../components/MovieCheckoutCard";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useParams } from "react-router-dom";
import "../utils/loader.css"
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const Payment = () => {

  const { id } = useParams();
  const { address } = useAccount();

  console.log(address)

  const {data , isPending} = useQuery({
    queryFn : async() => {return (await axios.get('http://localhost:3001/api/v1/getAllPosters')).data},
    queryKey : ["Fetching Poster"]
  })

  console.log(data)

  
  if(!address) {
    return <div className="flex flex-col h-screen w-screen justify-center items-center gap-y-10">
      <div className="text-red-500 text-2xl">Please Connect Your Wallet First</div>
      <div><ConnectButton/></div>
    </div>
  }
  
  if (isPending) {
    return <div className="flex w-screen h-screen justify-center items-center">
      <div className="loader"></div>
    </div>
  }

  return (
    <div className="flex flex-col">
      <Navbar />
      <div className=" relative w-full flex">
        <img src={`https://turquoise-certain-fox-148.mypinata.cloud/ipfs/${(data as any[])[parseInt(id ? (id) : ("0"))][3]}`} className="w-full blur-3xl h-[80vh]" />
        <div className="absolute h-[80vh] w-full flex">
          <div className="w-3/5 h-full flex justify-center items-center">
            <img src={`https://turquoise-certain-fox-148.mypinata.cloud/ipfs/${(data as any[])[parseInt(id ? (id) : ("0"))][3]}`} alt="" className="object-cover rounded-xl h-full w-11/12 m-auto" />
          </div>
          <div className="w-2/5 flex justify-center items-center h-full">
            <div className="h-full flex items-center justify-center">
              <MovieCheckout
                title={data === undefined || id === undefined ? ("") : (data[parseInt(id)][1])}
                gas={parseInt((data as any[])[parseInt(id ? (id) : ("0"))][4])}
                owner="0x7F6038653A0358Ad2835cE4DF002ba15db052395"
                description={data === undefined || id === undefined ? ("") : data[parseInt(id)][2]}
                buyers={123}
                id={id === undefined ? (0) : (parseInt(id))}
              />
            </div>
          </div>
        </div>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
};

export default Payment;
