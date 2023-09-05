import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { Toaster } from "react-hot-toast";

import "../styles/globals.css";
import Sidebar from "../components/sidebar";
import { cn } from "../lib/utils";

function MyApp({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter();

  return (
    <div className="max-w-[1920px] w-full h-full mx-auto flex">
      {!pathname.includes("/login") && <Sidebar />}
      <main
        className={cn(
          "h-full flex-1",
          !pathname.includes("/login") && "p-10 pl-[360px]"
        )}
      >
        <Component {...pageProps} />
      </main>
      <Toaster />
    </div>
  );
}

export default MyApp;
