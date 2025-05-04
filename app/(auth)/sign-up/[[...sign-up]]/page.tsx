import { SignUp, ClerkLoaded, ClerkLoading } from "@clerk/nextjs";
import { Loader } from "lucide-react";
import React from "react";

const Signup = () => {
  return (
    <div className="bg-gradient-to-r h-screen w-screen from-black to-blue-950 flex items-center justify-center">
      <ClerkLoaded>
        <SignUp path="/sign-up" />
        <ClerkLoading>
          <Loader className="animate-spin text-muted-foreground" />
        </ClerkLoading>
      </ClerkLoaded>
    </div>
  );
};

export default Signup;
