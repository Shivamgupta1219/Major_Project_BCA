import React from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
export default function Loader({ text = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 gap-3">
      <AiOutlineLoading3Quarters className="text-4xl animate-spin text-blue-600" />
      <p className="text-gray-600 text-sm">{text}</p>
    </div>
  );
}
