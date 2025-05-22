import type { Metadata } from "next";
import './index.css'
import { Inter } from "next/font/google";


export const metadata: Metadata = {
  title: "AlgoPen",
  description: "A website for visualizing and understanding algorithms and data structures through interactive, intuitive visuals and step-by-step explanations. Perfect for students.",
};

const inter = Inter({
	subsets: ['latin'], 
});

export default function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props
  return (
    <html lang="en" className={inter.className}>
      <body>
        {children}
      </body>
    </html>
  )
}