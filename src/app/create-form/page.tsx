"use client";

import React, { useState, useRef, useEffect } from "react";
import Input from "@/components/shared/TextInput";
import "@/app/globals.css";

import Switch from "@mui/material/Switch";
import { FormControlLabel } from "@mui/material";
import { Trash2, Copy, X, CheckSquare } from "lucide-react";
import { toast } from "react-toastify";
import Loader from "@/components/shared/Loader";
import { usePathname } from "next/navigation";
import { ToastContainer } from "react-toastify";
import { setCookie } from "cookies-next";
import dotenv from "dotenv";
export interface IQuestion {
  title: string;
  type: string;
  options: string[];
}

dotenv.config();
function FormGenerator() {
  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const [formDetails, setFormDetails] = useState({
    title: "",
    description: "",
  });
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [formId, setFormId] = useState(0);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const adjustTextareaHeight = (textarea: any) => {
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const handleFormDetails = (
    e:
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormDetails((prevDetails) => {
      return { ...prevDetails, [name]: value };
    });
  };
  // Add your question

  const addQuestion = (
    title: string,
    type: string,
    options: string[] = ["Option"]
  ) => {
    setQuestions([...questions, { title, type, options }]);
  };

  //Add option to your question
  const addOptionToQuestion = (questionIndex: number, newOption: string) => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions[questionIndex].options.push(newOption);
      return updatedQuestions;
    });
  };

  //Change type of your question
  const changeTypeOfQuestion = (
    questionIndex: number,
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions[questionIndex].type = event.target.value;
      return updatedQuestions;
    });
  };

  const handleOptionsChange = (
    questionIndex: number,
    optionIndex: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions[questionIndex].options[optionIndex] = event.target.value;
      return updatedQuestions;
    });
  };

  const handleQuestionChange = (
    questionIndex: number,

    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions[questionIndex].title = event.target.value;
      return updatedQuestions;
    });
  };

  const filterOptions = (questionIndex: number, optionIndex: number) => {
    setQuestions((prevQuestions) => {
      let updatedQuestions = [...prevQuestions];
      const filteredOptions = updatedQuestions[questionIndex].options.filter(
        (option, index) => index != optionIndex
      );
      updatedQuestions[questionIndex].options = filteredOptions;
      return updatedQuestions;
    });
  };

  const sendForm = async () => {
    const formData = {
      questions,
      formDetails,
    };
    try {
      setIsLoading(true);

      const response = await fetch("/api/send-form", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.message);
      }

      const adminEmail = resData.email;

      setCookie("adminEmail", adminEmail);
      setCookie("formId", resData.form.id);

      setAdminEmail(adminEmail);
      setFormId(resData.form.id);

      openModal();

      toast.success(`${resData.message}`);
    } catch (error: any) {
      toast.error(`${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // const handleOptionChange = (event) => {
  //   const selectedValue = event.target.value;
  //   setSelectedOption(selectedValue);
  // };

  return (
    <div className=" min-h-screen bg-gray-200">
      <header className="bg-white py-6 ">
        <nav className="max-w-3xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl  text-center font-semibold ">
            Create Your Form
          </h1>

          <button
            onClick={() => sendForm()}
            className="bg-indigo-800 px-4 py-2 text-lg rounded text-white"
          >
            {isLoading ? <Loader width="w-4" height="h-4" /> : "Send"}
          </button>
          {isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div className="bg-indigo-800 relative text-white p-6 rounded shadow-lg w-1/2">
                <button
                  className="absolute top-0 w-[40px]  h-[40px] z-50 right-2 cursor-pointer "
                  onClick={closeModal}
                >
                  <X />
                </button>
                <p className="mb-4">
                  This is a modal content. Copy the link below to share the
                  google form
                </p>
                <p>{`${window.location.href.replace(
                  pathname,
                  ""
                )}/fill-form/${adminEmail}/${formId}`}</p>
              </div>
            </div>
          )}
        </nav>
      </header>

      <div className="max-w-3xl mx-auto  rounded p-10  my-4 bg-white shadow-md w-full relative">
        <div className="bg-blue-600 z-20 absolute top-0 left-0 rounded-t w-full h-[10px]"></div>
        <div className="bg-indigo-800 z-10 absolute top-0 left-[0px] rounded-b rounded-t w-[10px] h-full"></div>

        <div className="border-b-[1px] my-2">
          <Input
            className="text-3xl w-full outline-0"
            placeholder="Enter your form title here ... "
            type="text"
            name="title"
            handleChange={(e) => handleFormDetails(e)}
          />
        </div>
        <div className="border-b-[2px] border-b-indigo-800 my-2">
          {/* <Input
            className="text-sm outline-none"
            placeholder="Form Description"
            type="text"
            name="description"
            handleChange={(e) => handleFormDetails(e)}
          /> */}
          <textarea
            className="text-sm outline-none w-full"
            placeholder="Form Description"
            name="description"
            value={formDetails.description}
            onChange={(e) => handleFormDetails(e)}
            onKeyDown={(e) => adjustTextareaHeight(e.target)}
            rows={1}
          />
        </div>
        <div className="absolute left-[100%] h-full mx-2 top-0 flex items-center">
          <button
            onClick={() => addQuestion("", "radio")}
            className="bg-white w-[50px] h-[50px] rounded-full   text-center     text-4xl   p-0"
          >
            +
          </button>
        </div>
      </div>
      {questions.length ? (
        <>
          {questions.map((question, questionIndex) => (
            <div
              className="w-full p-8 my-4   mx-auto bg-white max-w-3xl rounded shadow-md"
              key={questionIndex}
            >
              <div className="flex flex-row w-full">
                <div className="basis-2/3 mr-6">
                  <Input
                    className="border-2 w-full border-transparent p-2 transition rounded focus:border-b-indigo-800 focus:outline-none"
                    placeholder="Enter your question here...."
                    value={question.title}
                    type={"text"}
                    handleChange={(e) => handleQuestionChange(questionIndex, e)}
                  />
                </div>
                <select
                  id="inputType"
                  className="appearance-none border cursor-pointer focus:outline-none basis-1/3 border-gray-400 p-2 rounded"
                  onChange={(e) => changeTypeOfQuestion(questionIndex, e)}
                  defaultValue={"radio"}
                >
                  <option className="text-bold option" value="radio">
                    Radio
                  </option>
                  <option value="text">Text</option>
                  <option value="checkbox">Checkbox</option>
                  <option value="dropdown">Dropdown</option>
                </select>
              </div>
              {question.options.map((option, index) => (
                <div key={index} className="flex my-4 items-center ">
                  {question.type === "text" ? (
                    <Input
                      className="border-2 mx-2 w-full border-transparent p-2 transition rounded focus:border-b-indigo-800 focus:outline-none"
                      type="text"
                      placeholder="Enter your short answer here.."
                    />
                  ) : question.type === "dropdown" ? (
                    <>
                      <p>{index + 1}. </p>
                      <Input
                        className="border-2 mx-2 w-full border-transparent p-2 transition rounded focus:border-b-indigo-800 focus:outline-none"
                        type="text"
                        handleChange={(e) =>
                          handleOptionsChange(questionIndex, index, e)
                        }
                        placeholder={`${option} ${index + 1}`}
                      />
                    </>
                  ) : (
                    <>
                      <Input
                        className="text-gray-500"
                        type={question.type}
                        value={option}
                        name={question.title}
                        placeholder=""
                      />
                      <Input
                        className="border-2 mx-2 w-full border-transparent p-2 transition rounded focus:border-b-indigo-800 focus:outline-none"
                        type="text"
                        placeholder={`${option} ${index + 1}`}
                        handleChange={(e) =>
                          handleOptionsChange(questionIndex, index, e)
                        }
                      />
                    </>
                  )}

                  {question.type === "text" ? null : (
                    <button
                      onClick={() => filterOptions(questionIndex, index)}
                      className="bg-transparent p-0 text-2xl"
                    >
                      <X />
                    </button>
                  )}
                </div>
              ))}
              {question.type === "text" ? null : (
                <div className="my-2">
                  <button
                    onClick={() => addOptionToQuestion(questionIndex, "Option")}
                    className="text-blue-500"
                  >
                    Add Option
                  </button>
                </div>
              )}

              <hr />
              <div className="flex items-center my-2">
                <div className="flex basis-1/2 justify-between">
                  <button>
                    <Copy />
                  </button>
                  <button>
                    <Trash2 />{" "}
                  </button>
                  <div className="border-l-[1px] border-gray-500 mx-4"></div>
                  <FormControlLabel
                    required
                    control={<Switch />}
                    label="Required"
                  />
                </div>
              </div>
            </div>
          ))}
        </>
      ) : null}
    </div>
  );
}

export default FormGenerator;
