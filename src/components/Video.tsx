const Video = ({ link }: { link: any }) => {
  return (
    <div className="flex justify-center items-center w-full">
      <video src={link} className="w-full max-w-[1440px] aspect-video" controls></video>
    </div>
  );
};

export default Video;
