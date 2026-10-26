import React from "react";
import Home from "./pages/Home";
import { Toaster } from "sonner";

export default function App() {
  return (
    <>
      <Toaster position="top-right" richColors />
      <Home />
    </>
  );
}
