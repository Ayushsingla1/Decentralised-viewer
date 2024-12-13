import React from "react";
import { useNavigate } from "react-router-dom";

interface MovieInfoProps {
  title: string;
  owner: string;
  amount: string;
  imdbRating: string;
  description: string;
  posterUrl: string;
  id : string
}

const MovieInfo: React.FC<MovieInfoProps> = ({
  title,
  owner,
  amount,
  imdbRating,
  description,
  posterUrl,
  id
}) => {
  console.log(id)
  const navigate = useNavigate();
  return (
    <div className="flex flex-col md:flex-row p-6 w-10/12 max-w-[1440px] rounded-lg shadow-lg">
      <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
        <img
          src={posterUrl}
          alt={`${title} poster`}
          className="w-full h-auto max-w-[240px] border-2 border-green-500 rounded-lg"
        />
      </div>
      
      <div className="flex flex-col text-white">
        <h2 className="text-2xl font-bold mb-4 text-green-500">
          About the Movie
        </h2>

        <div className="mb-2">
          <span className="font-bold text-green-500">Movie:</span> {title}
        </div>

        <div className="mb-2">
          <span className="font-bold text-green-500">Owner:</span> {owner}
        </div>

        <div className="mb-2">
          <span className="font-bold text-green-500">Amount:</span> {amount}
        </div>

        <div className="mb-4">
          <span className="font-bold text-green-500">IMDB:</span> {imdbRating}
        </div>

        <div className="mb-2">
          <span className="font-bold text-green-500">Description:</span>
          <p className="text-white leading-snug">{description}</p>
        </div>
        <div className="mt-5"><button onClick={() => navigate(`/player/${id}`)} className="text-white bg-green-500 py-2 px-2 rounded-md">Watch Now</button></div>
      </div>
    </div>
  );
};

export default MovieInfo;
