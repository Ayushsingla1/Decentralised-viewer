import { ConnectKitButton } from "connectkit";
import { Link } from "react-router-dom";
import { useAccount } from "wagmi";

const Navbar = () => {

  const { address } = useAccount();

  const data = address === "0x7F6038653A0358Ad2835cE4DF002ba15db052395";
  console.log(data)

  return (
    <div className="flex justify-between font-hanalei bg-[#3B3B3B] text-white p-8 ">
      <div className="text-4xl text-[#1ff000]">
        {
          data === true ? (<Link to="/home">Web3TV</Link>) : (<Link to="/">Web3TV</Link>)
        }
      </div>
      <div className="flex gap-5 px-5 items-center text-xl">
        <ul className="flex gap-10 px-10">
          <Link to='/home'><li>Home</li></Link>
          {
            data === false ? (<Link to='/usermovies'><li>Your Movies</li></Link>) : (<></>)
          }
          {
            data === true ? (<Link to='/AdminHome'><li>AdminPage</li></Link>) : (<></>)

          }
          <Link to='/player'><li>Player</li></Link>
        </ul>
        <ConnectKitButton/>
      </div>
    </div>
  );
};

export default Navbar;
