import { useNavigate } from "react-router-dom";
const MovieCard = ({ video }: any) => {
  console.log(video)

  const navigate = useNavigate();

  return (
    <div className="hover:scale-105 image-container transition-all ease-in-out w-full">
      <img
        src={`https://maroon-fashionable-warbler-188.mypinata.cloud/ipfs/${video.ipfsHash.replace("ipfs://", "")}?pinataGatewayToken=gVQfpvbN3IXW52kARQuLO50y78ginsP31oSkPQT78K23fingxRmnt7u0tHk2lnFk`}
        className='w-full transition-all ease-in-out h-[321px] object-cover rounded-lg'
        alt=""
      />
      <div className="hover-text w-full">
        <div className='font-hanalei gap-y-1 text-lg flex flex-col justify-center items-center w-full'>
          <div className='text-2xl'>{video.name}</div>
          <div className='text-[#1EFF00]'>{parseInt(video.price)} Gwei</div>
          <div className='text-sm'>{video.description.slice(0, 100) + "..."}</div>
          <div className='happy-monkey-regular text-xl w-full flex flex-col gap-y-1'>
            <button className='bg-white hover:bg-gray-300 active:bg-gray-50 px-3 py-1 text-black rounded-lg' onClick={() => navigate(`/payment/${parseInt(video.movieId)}`)}>Buy</button>
            <button className='bg-white hover:bg-gray-300 active:bg-gray-50 px-3 py-1 text-black rounded-lg' onClick={() => navigate(`/trailerPlayer/${parseInt(video.movieId)}`)}>Trailer</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
