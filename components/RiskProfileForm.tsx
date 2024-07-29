import React, { useState, useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import { useFormik } from "formik";
import * as Yup from "yup";

// Define your custom FormData type
export type RiskProfileFormData = {
  preparedFor: string;
  identityNumber: string;
  preparedBy: string;
  preparedOn: string;
  investmentTerm: string;
  requiredRisk: string;
  riskTolerance: string;
  riskCapacity: string;
  totalScore: string;
  scoreOutcome: string;
  agree: boolean;
  signature: string;
  date: string;
};

type FormFieldKey = keyof RiskProfileFormData;

const RiskProfileForm = ({
  onSubmit,
}: {
  onSubmit: (data: RiskProfileFormData) => void;
}) => {
  const [derivedProfileDescription, setDerivedProfileDescription] = useState<
    string | null
  >(null);
  const sigCanvasRef = useRef<SignatureCanvas>(null);

  const riskCategories = [
    {
      range: [1, 30],
      label: "Conservative",
      description:
        "Conservative Investors want stability and are more concerned with protecting their current investments than increasing the real value of their investments. A Conservative Investor is generally seeking to preserve capital and as a trade-off is usually prepared to accept lower investment terms.",
    },
    {
      range: [31, 44],
      label: "Moderately Conservative",
      description:
        "Moderately Conservative Investors are those who want to protect their capital and achieve some real increase in the value of their investments. This Investor is usually seeking a diversified investment portfolio with exposure to a broad range of investment sectors.",
    },
    {
      range: [45, 54],
      label: "Moderate",
      description:
        "Moderate Investors are long-term Investors who want reasonable but relatively stable growth. Some fluctuations are tolerable, but Moderate Investors want less risk than that attributable to a fully equity based investment.",
    },
    {
      range: [55, 70],
      label: "Moderately Aggressive",
      description:
        "Moderately Aggressive Investors are long-term Investors who want real growth in their capital. A fair amount of risk is acceptable.",
    },
    {
      range: [71, 80],
      label: "Aggressive",
      description:
        "Aggressive Investors are long-term Investors who want high capital growth. Substantial year-to-year fluctuations in value are acceptable in exchange for a potentially high long-term return. An Aggressive Investor is comfortable accepting high volatility in their capital with the risk of short to medium-term periods of negative returns. They are willing to trade higher risk for greater long-term return and have a long investment objective. This investor is usually seeking a diversified portfolio with exposure to a broad range of investment sectors.",
    },
  ];

  const formik = useFormik<RiskProfileFormData>({
    initialValues: {
      preparedFor: "",
      identityNumber: "",
      preparedBy: "",
      preparedOn: "",
      investmentTerm: "",
      requiredRisk: "",
      riskTolerance: "",
      riskCapacity: "",
      totalScore: "",
      scoreOutcome: "",
      agree: false,
      signature: "",
      date: "",
    },
    validationSchema: Yup.object({
      preparedFor: Yup.string().required("The prepared for field is required"),
      identityNumber: Yup.string().required("Your identity number is required"),
      preparedBy: Yup.string().required("The prepared by field is required"),
      preparedOn: Yup.date().required(
        "The date field is required, click the calendar icon on the right to select the date"
      ),
      investmentTerm: Yup.string().required(
        "Your desired investment term is required"
      ),
      requiredRisk: Yup.string().required("Your required risk is required"),
      riskTolerance: Yup.string().required("Your risk tolerance is required"),
      riskCapacity: Yup.string().required("Your risk capacity is required"),
      agree: Yup.boolean().oneOf([true], "You must accept the terms"),
      date: Yup.date().required(
        "The date field is required, click the calendar icon to select the date"
      ),
      signature: Yup.string().test(
        "signature",
        "Signature is required",
        function () {
          const isSignatureEmpty = sigCanvasRef.current?.isEmpty();
          return (
            !isSignatureEmpty ||
            this.createError({ message: "Signature is required" })
          );
        }
      ),
    }),
    onSubmit: (values) => {
      const score = calculateTotalScore(values);
      const scoreOutcome = determineScoreOutcome(score);

      const profileCategory = riskCategories.find(
        (category) => score >= category.range[0] && score <= category.range[1]
      );

      setDerivedProfileDescription(profileCategory?.description || "");

      const signatureData: string = sigCanvasRef.current?.isEmpty()
        ? ""
        : sigCanvasRef.current?.getTrimmedCanvas().toDataURL("image/png") || "";

      onSubmit({
        ...values,
        totalScore: score.toString(),
        scoreOutcome,
        signature: signatureData,
      });
    },
  });

  const calculateTotalScore = (data: RiskProfileFormData) => {
    let score = 0;
    switch (data.investmentTerm) {
      case "a":
        score += 2.5;
        break;
      case "b":
        score += 10;
        break;
      case "c":
        score += 20;
        break;
      case "d":
        score += 26.5;
        break;
      case "e":
        score += 42.5;
        break;
      default:
        break;
    }
    switch (data.requiredRisk) {
      case "a":
        score += 1.25;
        break;
      case "b":
        score += 2.5;
        break;
      case "c":
        score += 3.75;
        break;
      default:
        break;
    }
    switch (data.riskTolerance) {
      case "a":
        score += 1.25;
        break;
      case "b":
        score += 2.5;
        break;
      case "c":
        score += 3.75;
        break;
      default:
        break;
    }
    switch (data.riskCapacity) {
      case "a":
        score += 10;
        break;
      case "b":
        score += 20;
        break;
      case "c":
        score += 30;
        break;
      default:
        break;
    }
    return score;
  };

  const determineScoreOutcome = (score: number) => {
    if (score <= 30) return "Conservative";
    if (score <= 44) return "Moderately Conservative";
    if (score <= 54) return "Moderate";
    if (score <= 70) return "Moderately Aggressive";
    return "Aggressive";
  };

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="bg-gradient-to-r from-white to-gray-200 p-6 rounded-lg shadow-md max-w-3xl mx-auto"
    >
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
        Risk Profile Questionnaire
      </h2>

      <div className="text-center mb-4 text-gray-700">
        <p>
          The purpose of this questionnaire is to help the Financial Adviser and
          Client determine the clients investment risk profile to guide them in
          the selection of suitable investment solutions.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {[
          { label: "Prepared for", name: "preparedFor", type: "text" },
          { label: "Identity number", name: "identityNumber", type: "text" },
          { label: "Prepared by", name: "preparedBy", type: "text" },
          { label: "Prepared on", name: "preparedOn", type: "date" },
          { label: "Date", name: "date", type: "date" },
        ].map((field) => (
          <label key={field.name} className="flex flex-col text-gray-800 mb-2">
            <span className="mb-1">{field.label}</span>
            <input
              type={field.type}
              name={field.name}
              value={formik.values[field.name as FormFieldKey] as string} // Explicitly cast to string
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`p-2 rounded-md bg-gray-100 text-gray-800 ${
                formik.touched[field.name as FormFieldKey] &&
                formik.errors[field.name as FormFieldKey]
                  ? "border border-red-500"
                  : ""
              }`}
            />
            {formik.touched[field.name as FormFieldKey] &&
            formik.errors[field.name as FormFieldKey] ? (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors[field.name as FormFieldKey]}
              </div>
            ) : null}
          </label>
        ))}

        <label className="flex flex-col text-gray-800 mb-2">
          <span className="mb-1">Investment Term</span>
          <select
            name="investmentTerm"
            value={formik.values.investmentTerm}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`p-2 rounded-md bg-gray-100 text-gray-800 ${
              formik.touched.investmentTerm && formik.errors.investmentTerm
                ? "border border-red-500"
                : ""
            }`}
          >
            <option value="">Select</option>
            <option value="a">Short-term (1-3 years)</option>
            <option value="b">Medium-term (3-5 years)</option>
            <option value="c">Long-term (5-10 years)</option>
            <option value="d">Very Long-term (10+ years)</option>
            <option value="e">Other</option>
          </select>
          {formik.touched.investmentTerm && formik.errors.investmentTerm ? (
            <div className="text-red-500 text-sm mt-1">
              {formik.errors.investmentTerm}
            </div>
          ) : null}
        </label>

        {[
          { label: "Required Risk", name: "requiredRisk" },
          { label: "Risk Tolerance", name: "riskTolerance" },
          { label: "Risk Capacity", name: "riskCapacity" },
        ].map((field) => (
          <label key={field.name} className="flex flex-col text-gray-800 mb-2">
            <span className="mb-1">{field.label}</span>
            <select
              name={field.name}
              value={formik.values[field.name as FormFieldKey] as string} // Explicitly cast to string
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`p-2 rounded-md bg-gray-100 text-gray-800 ${
                formik.touched[field.name as FormFieldKey] &&
                formik.errors[field.name as FormFieldKey]
                  ? "border border-red-500"
                  : ""
              }`}
            >
              <option value="">Select</option>
              <option value="a">Low</option>
              <option value="b">Medium</option>
              <option value="c">High</option>
            </select>
            {formik.touched[field.name as FormFieldKey] &&
            formik.errors[field.name as FormFieldKey] ? (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors[field.name as FormFieldKey]}
              </div>
            ) : null}
          </label>
        ))}

        <label className="flex items-center text-gray-800 mb-4">
          <input
            type="checkbox"
            name="agree"
            checked={formik.values.agree}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`mr-2 ${
              formik.touched.agree && formik.errors.agree
                ? "border border-red-500"
                : ""
            }`}
          />
          I agree to the terms
        </label>

        <label className="flex flex-col text-gray-800 mb-4">
          <span className="mb-1">Signature</span>
          <SignatureCanvas
            ref={sigCanvasRef}
            penColor="black"
            canvasProps={{
              width: 400, // Adjust the width as needed
              height: 100, // Adjust the height as needed
              className: "bg-white border border-gray-300 rounded-md",
            }}
          />
          {formik.touched.signature && formik.errors.signature ? (
            <div className="text-red-500 text-sm mt-1">
              {formik.errors.signature}
            </div>
          ) : null}
        </label>

        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
        >
          Submit
        </button>
        <button
          type="button"
          onClick={() => {
            sigCanvasRef.current?.clear();
            formik.resetForm();
          }}
          className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 mt-2"
        >
          Clear
        </button>
      </div>
      {derivedProfileDescription && (
        <div className="mt-6 p-4 bg-gray-100 border border-gray-300 rounded-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Risk Profile Description
          </h3>
          <p className="text-gray-800">{derivedProfileDescription}</p>
        </div>
      )}
    </form>
  );
};

export default RiskProfileForm;
