import { SignedIn } from "@clerk/nextjs";
import React from "react";

const SignIn = () => {
  return (
    <div className="text-slate-600">
      <SignedIn />
    </div>
  );
};

export default SignIn;
