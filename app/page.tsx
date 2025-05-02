import Navbar from "@/sections/Navbar/Navbar";
import Image from "next/image";

export default function Home() {
  return (
    <div className="h-screen w-screen p-7 bg-gradient-to-r from-black to-blue-950">
      <Navbar />
      <div className="flex items-center justify-evenly gap-12 mt-40">
        <h1 className="text-7xl font-extrabold text-slate-300 w-[600px] leading-tight">
          Welcome to our AI powered finance tracker{" "}
        </h1>

        {/* <div className="relative w-[400px] h-[700px]">
          <Image src="/Hero.jpg" alt="finance" fill className="object-cover" />
        </div> */}
      </div>
    </div>
  );
}
