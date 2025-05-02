import Video from "../components/Video";
import Navbar from "../components/Navbar";
import MovieInfo from "../components/MovieInfo";
import { video } from "@/DummyData/videosData";
import MovieCard from "@/components/MovieCard";
import { useAccount } from "wagmi";
import * as cryptojs from 'crypto-js';
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../utils/loader.css"
import { useQueries } from "@tanstack/react-query";
import axios from "axios";

const Player = () => {

  const { address } = useAccount();
  let { id } = useParams();


  const [decryptedVideoUrl, setDecryptedVideoUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const password = import.meta.env.VITE_REACT_MOVIE_PASSWORD;

  const userQueries = useQueries({
    queries : [
      {queryKey : ["Fetching Movie"] , queryFn : async() => {return (await axios.get('http://localhost:3001/api/v1/getMovie',{
        params : {id}
      })).data}},
      {queryKey : ["getPoster"] , queryFn : async() => {return (await axios.get('http://localhost:3001/api/v1/getPoster',{
        params : {id}
      })).data}},
      {queryKey : ["getAllPosters"] , queryFn : async() => {return (await axios.get('http://localhost:3001/api/v1/getAllPosters',{
        params : {id}
      })).data}},
      {queryKey : ["Owns Movies"], queryFn : async() => {return (await axios.get('http://localhost:3001/api/v1/ownsMovie',{
        params : {address,id}
      }))}}
    ]
  })

  const decryptAndFetchFile = async (ipfsHash: string, userPassword: string) => {
    try {
      setStatus("Fetching Encrypted Movie ...");
      const response = await fetch(`https://gateway.pinata.cloud/ipfs/${ipfsHash}`);

      if (!response.ok) {
        throw new Error('Failed to fetch encrypted file');
      }

      const encryptedContent = await response.text();
      const decryptedBase64 = cryptojs.AES.decrypt(
        encryptedContent,
        userPassword
      ).toString(cryptojs.enc.Utf8);
      const binaryString = atob(decryptedBase64);
      const bytes = new Uint8Array(binaryString.length);

      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const decryptedBlob = new Blob([bytes], { type: 'video/mp4' });
      const videoUrl = URL.createObjectURL(decryptedBlob);

      setDecryptedVideoUrl(videoUrl);
      setStatus("Video decrypted successfully");
      setError(null);

      return videoUrl;
    } catch (error) {
      console.error('Decryption error:', error);
      setStatus("");
      setError('Failed to decrypt video. Please check your network connection.');
      return null;
    }
  };

  useEffect(() => {

    if (!userQueries[3].isPending && !decryptedVideoUrl && userQueries && (userQueries as any[])[0]?.data.data[3]) {
      console.log("user movies is : ", userQueries[3])
      const ipfsHash = (userQueries as any[])[0].data.data[3];

      decryptAndFetchFile(ipfsHash, password);
    }
  }, [userQueries[0].isPending || userQueries[1].isPending || userQueries[2].isPending || userQueries[3].isPending, decryptedVideoUrl, userQueries]);

  if (userQueries[0].isPending || userQueries[1].isPending || userQueries[2].isPending || userQueries[3].isPending) {
    return <div className="flex w-screen h-screen justify-center items-center">
      <div className="loader"></div>
    </div>
  }

  if (userQueries[0].isError || userQueries[1].isError || userQueries[2].isError || userQueries[3].isError) {
    return (
      <div className="text-red-500 text-center text-2xl">
        {error || "An error occurred while loading the video"}
      </div>
    );
  }

  return (
    <div className="w-full h-full pb-10">
      <Navbar />
      <div className="flex flex-col gap-y-12 justify-center items-center">
        <div className="flex flex-col w-full relative items-center bg-[#292929] h-[180vh]">
          <img src={`https://turquoise-certain-fox-148.mypinata.cloud/ipfs/${(userQueries as any[])[1].data.data[3]}`} className="w-full absolute blur-3xl h-[90vh]" alt="Background Blur" />
          <div className="flex pt-10 gap-y-6 flex-col absolute top-0 w-full justify-center items-center">
            <div className="flex gap-x-2 text-white justify-center items-center">
              <span className="font-hanalei text-4xl">{(userQueries as any[])[1].data.data[1]}</span>
              <div className="border border-[#1EFF00] rounded-full px-3 py-1">
                <span className="font-hanalei text-xl">Owner:</span>
                <span className="font-hanalei text-xl">0x7F6038653A0358Ad2835cE4DF002ba15db052395</span>
              </div>
            </div>
            <div>
              {decryptedVideoUrl ? (
                <Video link={decryptedVideoUrl} />
              ) : (
                <div className="text-white">
                  {status || "Decryting Secure Video"}
                </div>
              )}
              {status && <p className="text-white mt-2">{status}</p>}
              {error && <p className="text-red-500 mt-2">{error}</p>}
            </div>

            <div className="w-full justify-center items-center flex bottom-[0] font-hanalei">
              <MovieInfo
                title={(userQueries as any[])[1].data.data[1]}
                owner="0x7F6038653A0358Ad2835cE4DF002ba15db052395"
                amount={(userQueries as any[])[1].data.data[4]}
                imdbRating="8.8/10"
                description={(userQueries as any[])[1].result.description}
                posterUrl={`https://turquoise-certain-fox-148.mypinata.cloud/ipfs/${(userQueries as any[])[1].data.data[3]}?`}
                id = {id}
              />
            </div>
          </div>
        </div>
        <div className="px-10 w-10/12 max-w-[1600px] flex flex-col gap-y-2">
          <div className="flex justify-between text-xl">
            <h2 className="font-hanalei text-3xl text-[#1EFF00]">Movies to Rent</h2>
          </div>
          <div className="flex w-full gap-5">
            {
              (userQueries as any[])[2].data.data.map((video: video | any, index: number) => {
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
};

export default Player;