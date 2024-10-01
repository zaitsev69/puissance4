import React from "react";

function Header() {
  return (
    <div className="bg-[#B0D3F3] flex justify-between items-center p-4">
      <div className="flex space-x-10 uppercase font-bold">
        <div>Level:</div>
        <div>Score:</div>
      </div>
      <button className="bg-white border border-black text-black px-4 py-2 rounded shadow-md uppercase hover:bg-blue-300">
        Restart
      </button>
    </div>
  );
}

export default Header;
