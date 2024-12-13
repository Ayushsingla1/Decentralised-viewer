const Footer = () => {
  return (
    <footer className="relative bg-[#1a1a1a] text-white py-6 overflow-hidden mt-10">

      <div className="absolute inset-0 -z-10">
        <div className="w-48 h-48 bg-gradient-to-br from-[#1EFF00] to-[#FF00FF] opacity-30 blur-xl rounded-full absolute top-6 left-20"></div>
        <div className="w-40 h-40 bg-gradient-to-bl from-[#FF00FF] to-[#1EFF00] opacity-20 blur-lg rounded-full absolute bottom-4 right-20"></div>
        <div className="w-32 h-32 bg-gradient-to-tr from-[#1EFF00] to-[#00FFFF] opacity-25 blur-xl rounded-full absolute top-10 right-1/4"></div>
      </div>

      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between  items-start gap-6 w-full">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-hanalei text-[#1EFF00]">WEB3TV</h1>
            <p className="text-gray-400 max-w-sm">
              Decentralizing entertainment, one screen at a time. Buy and own your favorite movies and shows on-chain.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-y-2 text-sm gap-x-6">
            <a href="#" className="hover:text-[#1EFF00] transition">About Us</a>
            <a href="#" className="hover:text-[#1EFF00] transition">Movies</a>
          </div>
        </div>
        <div className="my-6 border-t border-gray-700"></div>
        <div className="flex flex-col md:flex-row justify-between items-center text-sm gap-4">
          <p className="text-gray-500">
            © {new Date().getFullYear()} WEB3TV. All Rights Reserved.
          </p>
          <div className="flex gap-3">
            <a href="#" className="hover:text-[#1EFF00] transition">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>

  );
};

export default Footer;
