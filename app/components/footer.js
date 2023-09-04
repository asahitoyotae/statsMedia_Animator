import Image from "next/image";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-700 p-4 flex items-center justify-center w-screen z-20 ">
      <Image src="/faveicon.png" width={20} height={20} alt="logo" />
      <h3 className="text-2xl font-bold mx-4 text-white">Datalytics</h3>
    </footer>
  );
};

export default Footer;
