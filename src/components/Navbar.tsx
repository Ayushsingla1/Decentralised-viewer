import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Link } from "react-router-dom";
import { useAccount, useReadContract } from "wagmi";
import { ABI, contractAddress } from "@/utils/contractDetails";
import { useNavigate } from "react-router-dom";

const Navbar = () => {

  const navigate = useNavigate()
  const { address } = useAccount();

  const { data, isPending, error }: { data: undefined | boolean, isPending: any, error: any } = useReadContract({
    abi: ABI,
    address: contractAddress,
    functionName: "checkAdmin",
    args: [],
    account: address
  })

  console.log(data)

  // if (!data) {
  //   navigate('/home')
  // }

  if (isPending) {
    return <div>...loading</div>
  }
  if (error) {
    return <div>error...</div>
  }

  if (!isPending) {
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
              data === true ? (<Link to='/AdminHome'><li>AdminPage</li></Link>) : (<></>)
              
            }
            <Link to='/player'><li>Player</li></Link>
          </ul>
          <ConnectButton
            chainStatus="icon"
            showBalance={false}
            accountStatus="address"
          />
        </div>
      </div>
    );
  // }
}
};

export default Navbar;
