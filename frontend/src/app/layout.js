import { Inter } from "next/font/google";
import { ReduxProvider } from "@/providers/ReduxProvider";
import { SocketProvider } from "@/providers/SocketProvider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "NextShop E-Commerce",
  description: "Your one-stop shop for all products",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReduxProvider>
          <SocketProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow container mx-auto px-4 py-8">
                {children}
              </main>
              <Footer />
            </div>
          </SocketProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
