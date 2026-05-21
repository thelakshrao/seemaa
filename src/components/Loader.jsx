import React from "react";
import loaderGif from "../img/logo.gif";

const Loader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <img
        src={loaderGif}
        alt="Loading..."
        className="w-50 h-50"
      />
    </div>
  );
};

export default Loader;
