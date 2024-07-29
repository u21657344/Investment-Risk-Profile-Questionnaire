import React, { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const FAISLetterForm = ({ onSubmit }: { onSubmit: (data: any) => void }) => {
  const sigCanvas1 = useRef<SignatureCanvas>(null);
  const sigCanvas2 = useRef<SignatureCanvas>(null);
  const sigCanvas3 = useRef<SignatureCanvas>(null);

  const formik = useFormik({
    initialValues: {
      fullName: "",
      idNumber: "",
      signature1: "",
      signature2: "",
      signature3: "",
    },
    validationSchema: Yup.object({
      fullName: Yup.string().required("Full name is required"),
      idNumber: Yup.string().required("ID number is required"),
      signature1: Yup.string().test(
        "signature1",
        "Signature 1 is required",
        function () {
          const isSignatureEmpty = sigCanvas1.current?.isEmpty();
          return !isSignatureEmpty || this.createError({ message: "Signature 1 is required" });
        }
      ),
      signature2: Yup.string().test(
        "signature2",
        "Signature 2 is required",
        function () {
          const isSignatureEmpty = sigCanvas2.current?.isEmpty();
          return !isSignatureEmpty || this.createError({ message: "Signature 2 is required" });
        }
      ),
      signature3: Yup.string().test(
        "signature3",
        "Signature 3 is required",
        function () {
          const isSignatureEmpty = sigCanvas3.current?.isEmpty();
          return !isSignatureEmpty || this.createError({ message: "Signature 3 is required" });
        }
      ),
    }),
    onSubmit: (values) => {
      const signature1 = sigCanvas1.current?.getTrimmedCanvas().toDataURL("image/png");
      const signature2 = sigCanvas2.current?.getTrimmedCanvas().toDataURL("image/png");
      const signature3 = sigCanvas3.current?.getTrimmedCanvas().toDataURL("image/png");

      const submissionData = {
        ...values,
        signature1,
        signature2,
        signature3,
      };

      onSubmit(submissionData);
    },
  });

  const handleClear = () => {
    formik.resetForm();
    sigCanvas1.current?.clear();
    sigCanvas2.current?.clear();
    sigCanvas3.current?.clear();
  };

  return (
    <form onSubmit={formik.handleSubmit} className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 rounded-lg shadow-lg max-w-3xl mx-auto text-white">
      <div className="mb-4">
        <label className="block text-white">Full Name</label>
        <input
          type="text"
          name="fullName"
          value={formik.values.fullName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={`block w-full p-2 border rounded mt-1 ${
            formik.touched.fullName && formik.errors.fullName ? "border-red-500" : "border-gray-300"
          } text-black`}
        />
        {formik.touched.fullName && formik.errors.fullName ? (
          <div className="text-red-500 text-sm mt-1">{formik.errors.fullName}</div>
        ) : null}
      </div>
      <div className="mb-4">
        <label className="block text-white">ID Number</label>
        <input
          type="text"
          name="idNumber"
          value={formik.values.idNumber}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={`block w-full p-2 border rounded mt-1 ${
            formik.touched.idNumber && formik.errors.idNumber ? "border-red-500" : "border-gray-300"
          } text-black`}
        />
        {formik.touched.idNumber && formik.errors.idNumber ? (
          <div className="text-red-500 text-sm mt-1">{formik.errors.idNumber}</div>
        ) : null}
      </div>

      <div className="mb-4">
        <label className="block text-white">Signature 1</label>
        <SignatureCanvas
          ref={sigCanvas1}
          penColor="black"
          canvasProps={{ className: "sigCanvas bg-white w-full h-24 border border-gray-300" }}
        />
        {formik.touched.signature1 && formik.errors.signature1 ? (
          <div className="text-red-500 text-sm mt-1">{formik.errors.signature1}</div>
        ) : null}
      </div>
      <div className="mb-4">
        <label className="block text-white">Signature 2</label>
        <SignatureCanvas
          ref={sigCanvas2}
          penColor="black"
          canvasProps={{ className: "sigCanvas bg-white w-full h-24 border border-gray-300" }}
        />
        {formik.touched.signature2 && formik.errors.signature2 ? (
          <div className="text-red-500 text-sm mt-1">{formik.errors.signature2}</div>
        ) : null}
      </div>
      <div className="mb-4">
        <label className="block text-white">Signature 3</label>
        <SignatureCanvas
          ref={sigCanvas3}
          penColor="black"
          canvasProps={{ className: "sigCanvas bg-white w-full h-24 border border-gray-300" }}
        />
        {formik.touched.signature3 && formik.errors.signature3 ? (
          <div className="text-red-500 text-sm mt-1">{formik.errors.signature3}</div>
        ) : null}
      </div>
      <div className="flex justify-between">
        <button type="submit" className="p-2 rounded-md bg-blue-500 text-white hover:bg-blue-600">
          Submit
        </button>
        <button type="button" onClick={handleClear} className="p-2 rounded-md bg-red-500 text-white hover:bg-red-600">
          Clear
        </button>
      </div>
    </form>
  );
};

export default FAISLetterForm;
