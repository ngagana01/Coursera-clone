import React from "react";

const Videolayer = ({ videoId, title }: any) => {
  return (
    <div className="w-full aspect-video rounded-lg overflow-hidden shadow-lg">
      <iframe
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        src={`https://www.youtube.com/embed/${videoId}`}
        className="w-full h-full"
      ></iframe>
    </div>
  );
};

export default Videolayer;
