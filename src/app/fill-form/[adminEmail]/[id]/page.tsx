"use client";
import Loader from "@/components/shared/Loader";
import React, { useEffect, useState } from "react";
import { IFormData } from "../../../api/send-form/route";
import Input from "@/components/shared/TextInput";
import { toast } from "react-toastify";

const Form = ({ params }: { params: { adminEmail: string; id: string } }) => {
  const [data, setData] = useState<IFormData | null>(null);
  const [checkboxes, setCheckboxes] = useState<string[]>([]);
  const [selectedValues, setSelectedValues] = useState("");
  const [loading, setLoading] = useState(true);
  const [formAnswers, setFormAnswers] = useState<{
    [question: string]: string;
  } | null>();

  const adminEmail = decodeURIComponent(params.adminEmail);
  useEffect(() => {
    // Function to fetch data asynchronously
    async function fetchData() {
      try {
        const response = await fetch(
          `../../api/get-form-data/${adminEmail}/${params.id}`
        );
        const json = await response.json();
        setData(json);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    }

    fetchData(); // Call the fetchData function
  }, []);

  const handleChange = (questionTitle: string, e: any) => {
    const { value } = e.target;

    setFormAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionTitle]: value,
    }));
  };

  const handleCheckBoxChange = (questionTitle: string, e: any) => {
    const { value, checked } = e.target;

    setFormAnswers((prevAnswers) => {
      if (checked) {
        // If checked, append the value to the existing string with a separator
        return {
          ...prevAnswers,
          [questionTitle]: prevAnswers![questionTitle]
            ? `${prevAnswers![questionTitle]}, ${value}`
            : value,
        };
      } else {
        // If unchecked, remove the value from the string
        return {
          ...prevAnswers,
          [questionTitle]: prevAnswers![questionTitle]
            ?.replace(`${value}, `, "")
            .replace(`${value}`, ""),
        };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await fetch(
      `/api/send-response/${adminEmail}/${params.id}`,
      {
        body: JSON.stringify(formAnswers),
        method: "POST",
      }
    );
    const resData = await response.json();
    toast.success(`${resData.message}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <Loader width="50" height="50" />
      </div>
    );
  }

  return (
    <div className=" min-h-screen bg-gray-200 py-10">
      <div className="max-w-3xl mx-auto  rounded p-10  my-4 bg-white shadow-md w-full relative">
        <div className="bg-blue-600 z-20 absolute top-0 left-0 rounded-t w-full h-[10px]"></div>
        <div className="bg-indigo-800 z-10 absolute top-0 left-[0px] rounded-b rounded-t w-[10px] h-full"></div>

        <div className="border-b-[1px] my-2">
          <h1 className="text-4xl bold">{data?.formDetails.title}</h1>
        </div>
        <div className="border-b-[2px] border-b-indigo-800 my-2">
          <p className="text-xl">{data?.formDetails.description}</p>
        </div>

        <div>
          <h1 className="text-xl italic">
            Email is required to submit the form
          </h1>
          <input
            required
            type="email"
            id="email"
            name="email"
            placeholder="Add your email"
            className="outline-none p-4 text-md"
            onChange={(e) => handleChange(e.target.name, e)}
          />
        </div>
      </div>
      <form onSubmit={(e) => handleSubmit(e)} className="max-w-3xl mx-auto ">
        {data?.questions.map((question, questionIndex) => {
          return (
            <div
              className="w-full p-8 my-4   mx-auto bg-white w-full rounded shadow-md"
              key={questionIndex}
            >
              <div className="w-full">
                <div className=" ">
                  <h1 className="text-2xl">{question.title}</h1>
                </div>
              </div>
              <div className="my-4">
                {question.type === "text" ? (
                  <Input
                    className="border-2 mx-2 w-full border-transparent p-2 transition rounded focus:border-b-indigo-800 focus:outline-none"
                    type="text"
                    placeholder="Enter your short answer here.."
                    handleChange={(e) => handleChange(question.title, e)}
                  />
                ) : question.type === "dropdown" ? (
                  <div>
                    {question.options.map((option, index) => (
                      <p key={index}>
                        {index + 1}. {option}
                      </p>
                    ))}
                    {/* Render the select element after iterating options */}
                    <select
                      onChange={(e) => handleChange(question.title, e)}
                      className="border-2 mx-2 w-1/3 border-transparent p-2 transition rounded focus:border-b-indigo-800 focus:outline-none"
                    >
                      {question.options.map((option, index) => (
                        <option key={index} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  question.options.map((option, index) => (
                    <div key={index} className="flex items-center">
                      {question.type === "checkbox" ? (
                        <>
                          <input
                            className="text-gray-500 w-[20px] h-[20px]"
                            type="checkbox"
                            value={option}
                            name={question.title}
                            placeholder=""
                            onChange={(e) =>
                              handleCheckBoxChange(question.title, e)
                            }
                          />
                          <label className="mx-6 text-md" htmlFor="">
                            {option}
                          </label>
                        </>
                      ) : (
                        <>
                          <input
                            className="text-gray-500 w-[20px] h-[20px]"
                            type={question.type}
                            value={option}
                            name={question.title}
                            placeholder=""
                            onChange={(e) => handleChange(question.title, e)}
                          />
                          <label className="mx-6 text-md" htmlFor="">
                            {option}
                          </label>
                        </>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
        <button
          type="submit"
          className="bg-indigo-800 text-white text-xl rounded py-2 px-4"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Form;
