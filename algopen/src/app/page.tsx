'use client'
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    redirect('/visualiser');
  },[])
  return (
    <div>
      <h1>landing</h1>
    </div>
  );
}
