import { Inter } from "next/font/google";
import { UserProvider } from "./context/UserContext";
import "./globals.css";
import ReduxProvider from "./reduxProvider";
import "./style/globals.css";

const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata({ params, data }) {
  const name = data?.meta_title;
  const description = data?.meta_description;

  return {
    title: name,
    description: description,
  };
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <UserProvider>
          <ReduxProvider>
            {children}
            <script type="text/javascript" id="hs-script-loader" async defer src="//js-na1.hs-scripts.com/45427602.js"></script>

<script type="text/javascript" id="hs-script-loader" async defer src="//js.hs-scripts.com/45427602.js"></script>
          </ReduxProvider>
        </UserProvider>
      </body>
    </html>
  );
}
