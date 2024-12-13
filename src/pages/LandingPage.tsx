import React from "react";
import Footer from "@/components/Footer";
import MovieCard from "@/components/MovieCard";
import Navbar from "@/components/Navbar";
import image from "../assets/Group 1.png";
import { useAccount, useReadContract } from "wagmi";
import { ABI, contractAddress } from "@/utils/contractDetails";
import "../utils/loader.css";
import Chatbox from "@/components/Chatbot";

const LandingPage = () => {
  const { address } = useAccount();

  const { data, isPending, error } = useReadContract({
    abi: ABI,
    address: contractAddress,
    functionName: "getAllPosters",
    account : address
  });

  console.log("Data from contract:", data);
  console.log("Error:", error);
  console.log("Is Pending:", isPending);

  if (isPending) {
    return (
      <div className="flex w-screen h-screen justify-center items-center">
        <div className="loader"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center mt-20">Error: {error.message}</div>;
  }

  return (
    <div className="w-full flex flex-col">
      <Navbar />
      <div className="flex flex-col gap-y-10 w-full justify-center items-center text-center">
        {/* Hero Section */}
        <div className="w-full flex justify-center items-center relative">
          <img className="w-full max-w-[1840px] h-[59vh]" src={image} alt="" />
          <div className="absolute bottom-[-20px] z-20 flex-col flex gap-y-1 left-[50%] translate-x-[-50%]">
            <h1 className="font-hanalei text-6xl flex justify-center items-center gap-x-3 text-white">
              WELCOME TO <span className="text-[#1ff000]">WEB3TV</span>
            </h1>
            <p className="text-white happy-monkey-regular text-2xl">
              Buy Movies and TV Shows in a decentralized way
            </p>
            <div className="flex justify-center gap-x-2">
              <button className="font-hanalei text-3xl bg-[#616161] text-[#1EFF00] px-3 py-1 rounded">
                Get Started
              </button>
            </div>
          </div>
          <div className="absolute bottom-[-12px] z-10 left-[50%] rounded-full translate-x-[-50%] w-[280px] blur-[80px] h-[70px] bg-pink-500"></div>
        </div>

        {/* Movies Section */}
        <div className="px-10 w-10/12 max-w-[1600px] flex flex-col gap-y-2">
          <div className="flex justify-between text-xl">
            <h2 className="font-hanalei text-3xl text-[#1EFF00]">MOVIES TO RENT</h2>
            <button className="font-hanalei text-2xl bg-[#1EFF00] py-1 px-3 rounded">
              MORE
            </button>
          </div>
          <div className="flex w-full gap-5 mt-5">
            {data?.map((poster, index) => (
              <MovieCard
                key={index}
                video={{
                  movieId: poster.movieId.toString(),
                  name: poster.name,
                  description: poster.description,
                  ipfsHash: poster.ipfsHash,
                  price: poster.price.toString(),
                }}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="mb-10">
        <Chatbox/>
      </div>
      <Footer />
    </div>
  );
};

export default LandingPage;
