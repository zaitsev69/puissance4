import localFont from "next/font/local";
import "./globals.css";

export const metadata = {
  title: "Puissance4",
  description: "School project from MyDigital School",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
