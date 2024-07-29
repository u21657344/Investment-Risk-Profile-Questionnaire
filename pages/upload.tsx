import React, { useState } from "react";
import FAISLetterForm from "../components/FAISLetterForm";

const UploadPage = () => {
  const [status, setStatus] = useState<{
    success: boolean;
    missingFields: string[];
  }>({
    success: false,
    missingFields: [],
  });

  const handleFAISSubmit = (data: any) => {
    console.log("FAIS Form Data:", data);
    setStatus({
      success: true,
      missingFields: [],
    });
  };

  return (
    <main className="flex min-h-screen flex-col bg-black-200">
      <div className="pt-20 pb-8 px-4">
        <h2 className="text-4xl font-semibold mb-8 text-center text-white">
          Submit Your FAIS Letter
        </h2>
        <p className="text-1xl font-semibold mb-8 text-center text-gray-400">
          Please fill out the form below
        </p>
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-screen text-center">
          <FAISLetterForm onSubmit={handleFAISSubmit} />
          <div className="mt-8">
            {status.success && (
              <div className="p-4 bg-green-500 text-white border border-green-200 rounded-md">
                <p className="font-semibold">Form submitted successfully!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default UploadPage;
