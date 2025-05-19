import type { Metadata } from "next";
import './index.css'


export const metadata: Metadata = {
  title: "AlgoPen",
  description: "A website for visualizing and understanding algorithms and data structures through interactive, intuitive visuals and step-by-step explanations. Perfect for students.",
};


export default function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props
  return (
    <html>
      <body>
        {children}
      </body>
    </html>
  )
}