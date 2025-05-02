import React, { useState } from "react";
import { contractAddress, ABI } from "@/utils/contractDetails";
import { useWalletClient } from "wagmi";
import "../utils/loader.css"
import { useNavigate } from "react-router-dom";
import {toast} from "react-toastify"
import { encodeFunctionData } from "viem";

type MovieCheckoutProps = {
  title: string;
  gas: number;
  owner: string;
  description: string;
  buyers: number;
  id: number
};

const MovieCheckout: React.FC<MovieCheckoutProps> = ({
  title,
  gas,
  owner,
  description,
  buyers,
  id
}) => {

  console.log(title , gas , owner , description , buyers , id)

  const [isSuccess , setIsSuccess] = useState(false);
  const [isPending , setIsPending] = useState(false);
  const [isError , setIsError] = useState(false);
  const {data : walletClient} = useWalletClient();

  const navigate = useNavigate();
  
  const handleBuy = async (e: any) => {
    e.preventDefault();

    setIsPending(true);
    console.log("calling it")

    const data = encodeFunctionData({
      abi : ABI,
      functionName : "purchaseMovie",
      args : [id]
    })

    const [account] =await walletClient?.getAddresses()!;

    const tx = {
      to : contractAddress,
      data,
      account,
      value : 400000000000000000n,
      gas : 400000000n
    }

    const hash = await walletClient?.sendTransaction(tx);

    // const success = await walletClient.sen

    console.log(hash);

    if(hash !== undefined){
      setIsPending(false);
      setIsSuccess(true);
    }
    else{
      setIsError(true);
    }
  };

  if (isSuccess) {
    toast.success("Movie Purchased Successfully");
    navigate("/");
  }
  if (isError) {
    return <div>ERROR...</div>;
  }
  if (isPending) {
    return (
      <div className="flex-col">
        <div className="place-self-center loader"></div>
        <div className="text-2xl text-white font-hanalei py-5">
          payment in progress ....
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md p-6 font-hanalei rounded-xl bg-[#C2C2C2] hover:bg-[#d6d6d6] hover:scale-105 transition-all ease-in-out text-white space-y-4">
      <h1 className="text-4xl blackStroke">MOVIE CHECKOUT</h1>
      <h2 className="text-3xl blackStroke">{title}</h2>
      <p className="text-[#1EFF00] text-3xl blackStroke">{gas} Gwei</p>

      <div className="text-left flex flex-col gap-y-3">
        <p>
          <span className="text-white text-3xl blackStroke">OWNER:</span> <br />
          <span className="blackStroke text-lg">{owner}</span>
        </p>

        <p>
          <span className="text-white blackStroke text-3xl">DESCRIPTION:</span>
          <br />
          <span className="blackStroke text-lg font-bold">
            {description.trim().slice(0, 300)}
          </span>
        </p>

        <p className="text-3xl">
          <span className="text-white blackStroke">NO OF BUYERS:</span>{" "}
          <span className="blackStroke">{buyers.toLocaleString()}</span>
        </p>
      </div>

      <button
        className="bg-green-600 w-full blackStroke hover:bg-green-500 px-4 py-2 rounded-full text-white text-2xl font-bold"
        disabled={isPending}
        onClick={handleBuy}
      >
        {isPending ? "Transaction in process..." : "Buy Now"}
      </button>
    </div>
  );
};

export default MovieCheckout;
