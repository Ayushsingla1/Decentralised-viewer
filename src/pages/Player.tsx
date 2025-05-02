import Video from "../components/Video";
import Navbar from "../components/Navbar";
import MovieInfo from "../components/MovieInfo";
import MovieCard from "@/components/MovieCard";
import { useAccount } from "wagmi";
import * as cryptojs from 'crypto-js';
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../utils/loader.css";
import { useQueries } from "@tanstack/react-query";
import axios from "axios";

const Player = () => {
  const { address } = useAccount();
  let { id } = useParams();

  const [decryptedVideoUrl, setDecryptedVideoUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("Initializing...");
  const [error, setError] = useState<string | null>(null);

  const password = import.meta.env.VITE_REACT_MOVIE_PASSWORD;

  const userQueries = useQueries({
    queries: [
      {
        queryKey: ["Fetching Movie", id], 
        queryFn: async () => {
          const response = await axios.get('http://localhost:3001/api/v1/getMovie', {
            params: { id }
          });
          return response.data;
        }
      },
      {
        queryKey: ["getPoster", id],
        queryFn: async () => {
          const response = await axios.get('http://localhost:3001/api/v1/getPoster', {
            params: { id }
          });
          return response.data;
        }
      },
      {
        queryKey: ["getAllPosters", id],
        queryFn: async () => {
          const response = await axios.get('http://localhost:3001/api/v1/getAllPosters', {
            params: { id }
          });
          return response.data;
        }
      },
      {
        queryKey: ["Owns Movies", address, id],
        queryFn: async () => {
          if (!address) {
            throw new Error('Wallet not connected');
          }
          const response = await axios.get('http://localhost:3001/api/v1/ownsMovie', {
            params: { address, id }
          });
          return response.data;
        },
        enabled: !!address // Only run this query if address exists
      }
    ]
  });

  const decryptAndFetchFile = async (ipfsHash: string, userPassword: string) => {
    try {
      setStatus("Fetching Encrypted Movie...");

      console.log(ipfsHash);
      const response = await fetch(`https://gateway.pinata.cloud/ipfs/${ipfsHash}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch encrypted file: ${response.status}`);
      }

      setStatus("Decrypting Movie...");
      const encryptedContent = await response.text();
      
      const decryptedBase64 = cryptojs.AES.decrypt(
        encryptedContent,
        userPassword
      ).toString(cryptojs.enc.Utf8);
      
      if (!decryptedBase64) {
        throw new Error('Decryption failed');
      }
      
      const binaryString = atob(decryptedBase64);
      const bytes = new Uint8Array(binaryString.length);

      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      const decryptedBlob = new Blob([bytes], { type: 'video/mp4' });
      const videoUrl = URL.createObjectURL(decryptedBlob);

      setDecryptedVideoUrl(videoUrl);
      setStatus("Video ready");
      setError(null);

      return videoUrl;
    } catch (error) {
      console.error('Decryption error:', error);
      setStatus("");
      setError(`Failed to decrypt video: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return null;
    }
  };

  const movieData = userQueries[0].data;
  const posterData = userQueries[1].data;
  const allPostersData = userQueries[2].data;
  const ownsMovieData = userQueries[3].data;

  const isLoading = userQueries.some(query => query.isPending);
  
  const hasError = userQueries.some(query => query.isError);
  const errorMessages = userQueries
    .filter(query => query.isError)
    .map(query => query.error)
    .join(", ");

  useEffect(() => {
    if (!isLoading && !decryptedVideoUrl && movieData && posterData && ownsMovieData) {
      const ipfsHash = movieData[4];

      console.log("hi theer")
      console.log(ipfsHash);
      if (ipfsHash) {
        decryptAndFetchFile(ipfsHash, password);
      } else {
        setError("Video source not found or you don't own this movie");
      }
    }
  }, [isLoading, movieData, posterData, ownsMovieData, decryptedVideoUrl]);

  if (isLoading) {
    return (
      <div className="flex w-screen h-screen justify-center items-center">
        <div className="loader"></div>
        <p className="ml-4 text-white">{status}</p>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="text-red-500 text-center text-2xl p-10">
        {error || errorMessages || "An error occurred while loading the video"}
      </div>
    );
  }

  if (!movieData || !posterData || !allPostersData) {
    return (
      <div className="text-yellow-500 text-center text-2xl p-10">
        Missing required movie data
      </div>
    );
  }

  const title = posterData[1];
  const description = posterData[2];
  const posterIpfsHash = posterData[3];
  const backgroundIpfsHash = posterData[2];
  const amount = posterData[4];


  console.log(userQueries)

  return (
    <div className="w-full h-full pb-10">
      <Navbar />
      <div className="flex flex-col gap-y-12 justify-center items-center">
        <div className="flex flex-col w-full relative items-center bg-[#292929] h-[180vh]">
          <img 
            src={`https://turquoise-certain-fox-148.mypinata.cloud/ipfs/${backgroundIpfsHash}`} 
            className="w-full absolute blur-3xl h-[90vh]" 
            alt="Background Blur" 
          />
          <div className="flex pt-10 gap-y-6 flex-col absolute top-0 w-full justify-center items-center">
            <div className="flex gap-x-2 text-white justify-center items-center">
              <span className="font-hanalei text-4xl">{title}</span>
              <div className="border border-[#1EFF00] rounded-full px-3 py-1">
                <span className="font-hanalei text-xl">Owner:</span>
                <span className="font-hanalei text-xl">{address || "0x7F6038653A0358Ad2835cE4DF002ba15db052395"}</span>
              </div>
            </div>
            <div>
              {decryptedVideoUrl ? (
                <Video link={decryptedVideoUrl} />
              ) : (
                <div className="flex flex-col items-center justify-center text-white p-10 border border-gray-700 rounded w-[640px] h-[360px]">
                  {status || "Preparing Video..."}
                  {error && <p className="text-red-500 mt-2">{error}</p>}
                </div>
              )}
            </div>

            <div className="w-full justify-center items-center flex bottom-[0] font-hanalei">
              <MovieInfo
                title={title}
                owner={address || "0x7F6038653A0358Ad2835cE4DF002ba15db052395"}
                amount={amount}
                imdbRating="8.8/10"
                description={description}
                posterUrl={`https://turquoise-certain-fox-148.mypinata.cloud/ipfs/${posterIpfsHash}?`}
                id={id}
              />
            </div>
          </div>
        </div>
        <div className="px-10 w-10/12 max-w-[1600px] flex flex-col gap-y-2">
          <div className="flex justify-between text-xl">
            <h2 className="font-hanalei text-3xl text-[#1EFF00]">Movies to Rent</h2>
          </div>
          <div className="flex w-full gap-5">
            {Array.isArray(allPostersData) && allPostersData.map((video, index) => (
              <MovieCard key={index} video={video} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Player;