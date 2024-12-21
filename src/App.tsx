import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Payment from "./pages/Payment";
import NotFound from "./pages/NotFound";
import Player from "./pages/Player";
import AdminHome from "./pages/AdminHome";
import TrailerPlayer from "./pages/TrailerPlayer";
import LandingPage from "./pages/LandingPage";
import MovieUpload from "./pages/MovieUpload";
import Testing from "./components/UserMovies";

function App() {
  return (
    <div className="min-h-screen w-full bg-[#3b3b3b]">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/player/:id" element={<Player />} />
        <Route path="/trailerPlayer/:id" element={<TrailerPlayer />} />
        <Route path="/payment/:id" element={<Payment />} />
        <Route path="/AdminHome" element={<AdminHome />} />
        <Route path="/addmovie" element={<MovieUpload />} />
        <Route path = "/userMovies" element = {<Testing/>}/>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
