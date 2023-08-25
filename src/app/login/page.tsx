"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import "react-toastify/dist/ReactToastify.css";
import Loader from "@/components/shared/Loader";
import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next";
import { toast } from "react-toastify";

const Login = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    const cookie = getCookie("token");
    if (!cookie) {
      toast.error("Please login first!");
    }
  }, []);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleTogglePassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await fetch("/api/login", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const resData = await response.json();
        throw new Error(resData.message);
      }
      const data = await response.json();

      toast.success(`${data.message}`);

      router.push("/create-form");
      setIsLoading(false);
    } catch (error: any) {
      toast.error(`${error.message}`);
      setIsLoading(false);
    }

    // You can add your registration logic here
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-semibold mb-4">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4 ">
            <label className="block mb-2 text-sm font-medium">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className=" w-full p-2 border rounded "
                required
              />
              <button
                type="button"
                className="absolute top-2 right-2"
                onClick={handleTogglePassword}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            {isLoading ? <Loader width="w-4" height="h-4" /> : "Login"}
          </button>
          <div className=" my-2">
            <h3 className="text-sm text-center">
              Don't have an account? <Link href={"/sign-up"}>Signup</Link>
            </h3>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
