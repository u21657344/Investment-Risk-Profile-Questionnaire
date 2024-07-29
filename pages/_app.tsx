// pages/_app.tsx
import "../styles/globals.css"; // Adjust path if necessary
import Navbar from "../components/Navbar"; // Adjust import path if necessary

function MyApp({ Component, pageProps }: any) {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        {" "}
        {/* Adjust padding as needed */}
        <Component {...pageProps} />
      </main>
    </>
  );
}

export default MyApp;
