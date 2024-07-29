import Link from "next/link";
import RiskProfileForm from "../components/RiskProfileForm";
import { useState } from "react";

// Update status type to reflect what you expect from the form
const HomePage = () => {
  const [status, setStatus] = useState<{
    success: boolean;
    missingFields: string[];
  }>({
    success: false,
    missingFields: [],
  });

  // Adjust the handler to accept FormData
  const handleUploadSuccess = (data: FormData) => {
    console.log("Form data:", data);

    // Example of deriving status from form data
    setStatus({
      success: !!data, // Example success condition
      missingFields: [], // Example placeholder; you should adjust this
    });
  };



  return (
    <main className="flex min-h-screen flex-col bg-black-200">
      <div className="pt-20 pb-8 px-4">
        <h2 className="text-4xl font-semibold mb-8 text-center text-white">
        Find out your Investment risk profile
        </h2>
        <p className="text-1xl font-semibold mb-8 text-center text-gray"> Complete the questions below
        </p>
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-screen text-center">
          <RiskProfileForm onSubmit={handleUploadSuccess} />
         
         
        </div>
      </div>
    </main>
  );
};

export default HomePage;
