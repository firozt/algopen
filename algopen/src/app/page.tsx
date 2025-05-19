'use client'
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { ROUTEMAPPINGS } from "../utils/constants";


export default function Home() {
  useEffect(() => {
    redirect(`/${ROUTEMAPPINGS.GraphVisualiser}`);
  },[])
  return (
    <div>
      <h1>loading</h1>
    </div>
  );
}
