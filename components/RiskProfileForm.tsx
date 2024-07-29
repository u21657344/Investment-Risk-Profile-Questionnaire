import React, { useState, useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import { useFormik } from "formik";
import * as Yup from "yup";

// Define a type for form data
type FormData = {
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

type FormFieldKey = keyof FormData;

const RiskProfileForm = ({
  onSubmit,
}: {
  onSubmit: (data: FormData) => void;
}) => {
  const [derivedProfileDescription, setDerivedProfileDescription] = useState<string | null>(null);
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

  const formik = useFormik({
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
      preparedOn: Yup.date().required("The date field is required, click the calendar icon on the right to select the date"),
      investmentTerm: Yup.string().required("Your desired investment term is required"),
      requiredRisk: Yup.string().required("Your required risk is required"),
      riskTolerance: Yup.string().required("Your risk tolerance is required"),
      riskCapacity: Yup.string().required("Your risk capacity is required"),
      agree: Yup.boolean().oneOf([true], "You must accept the terms"),
      date: Yup.date().required("The date field is required, click the calendar icon to select the date"),
      signature: Yup.string().test(
        "signature",
        "Signature is required",
        function () {
          const isSignatureEmpty = sigCanvasRef.current?.isEmpty();
          return !isSignatureEmpty || this.createError({ message: "Signature is required" });
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

  const calculateTotalScore = (data: FormData) => {
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
          Client determine the client's investment risk profile to guide
          them in the selection of suitable investment solutions.
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
              value={formik.values[field.name as FormFieldKey] as string | number | readonly string[] | undefined} // Explicitly cast to string | number | readonly string[] | undefined
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`p-2 rounded-md bg-gray-100 text-gray-800 ${
                formik.touched[field.name as FormFieldKey] && formik.errors[field.name as FormFieldKey]
                  ? "border border-red-500"
                  : ""
              }`}
            />
            {formik.touched[field.name as FormFieldKey] && formik.errors[field.name as FormFieldKey] ? (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors[field.name as FormFieldKey]}
              </div>
            ) : null}
          </label>
        ))}

        {[
          {
            label: "Investment Term",
            name: "investmentTerm",
            options: [
              { label: "Select", value: "" },
              { label: "0 - 2 years", value: "a" },
              { label: "2 - 3 years", value: "b" },
              { label: "3 - 5 years", value: "c" },
              { label: "5 - 7 years", value: "d" },
              { label: "7 - 10 years", value: "e" },
            ],
          },
          {
            label: "Required Risk",
            name: "requiredRisk",
            options: [
              { label: "Select", value: "" },
              { label: "Very Low", value: "a" },
              { label: "Low", value: "b" },
              { label: "Medium", value: "c" },
            ],
          },
          {
            label: "Risk Tolerance",
            name: "riskTolerance",
            options: [
              { label: "Select", value: "" },
              { label: "Low", value: "a" },
              { label: "Moderate", value: "b" },
              { label: "High", value: "c" },
            ],
          },
          {
            label: "Risk Capacity",
            name: "riskCapacity",
            options: [
              { label: "Select", value: "" },
              { label: "Low", value: "a" },
              { label: "Moderate", value: "b" },
              { label: "High", value: "c" },
            ],
          },
        ].map((select) => (
          <label key={select.name} className="flex flex-col text-gray-800 mb-2">
            <span className="mb-1">{select.label}</span>
            <select
              name={select.name}
              value={formik.values[select.name as FormFieldKey] as string | number | readonly string[] | undefined} // Explicitly cast to string | number | readonly string[] | undefined
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`p-2 rounded-md bg-gray-100 text-gray-800 ${
                formik.touched[select.name as FormFieldKey] && formik.errors[select.name as FormFieldKey]
                  ? "border border-red-500"
                  : ""
              }`}
            >
              {select.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {formik.touched[select.name as FormFieldKey] && formik.errors[select.name as FormFieldKey] ? (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors[select.name as FormFieldKey]}
              </div>
            ) : null}
          </label>
        ))}

        <label className="flex items-center text-gray-800 mb-2">
          <input
            type="checkbox"
            name="agree"
            checked={formik.values.agree}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="mr-2"
          />
          <span>
            I confirm that the Financial Adviser explained the risk categories
            to me
          </span>
        </label>
        {formik.touched.agree && formik.errors.agree ? (
          <div className="text-red-500 text-sm mt-1">{formik.errors.agree}</div>
        ) : null}

        <div className="text-gray-800 mb-2">
          <span className="block mb-1">Signature</span>
          <SignatureCanvas
            ref={sigCanvasRef}
            penColor="black"
            canvasProps={{
              width: 720,
              height: 200,
              className: "bg-white border border-gray-300 rounded-md",
            }}
          />
          {formik.touched.signature && formik.errors.signature ? (
            <div className="text-red-500 text-sm mt-1">
              {formik.errors.signature}
            </div>
          ) : null}
        </div>

        {/* Buttons */}
        <button
          type="submit"
          className="p-2 rounded-md bg-blue-500 text-white hover:bg-blue-600"
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
        <div className="bg-gray-100 p-4 mt-4 rounded-md text-gray-800">
          <h3 className="text-lg font-semibold mb-2">
            Derived Risk Profile Description
          </h3>
          <p>{derivedProfileDescription}</p>
        </div>
      )}
    </form>
  );
};

export default RiskProfileForm;
