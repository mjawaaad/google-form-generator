import React from "react";

interface IProps {
  formData: {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
  };
  handleChange: React.ChangeEventHandler<HTMLInputElement>;
  handleTogglePassword: () => void;
  handleSubmit: React.FormEventHandler<HTMLFormElement>;
  showPassword: Boolean;
  setShowLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

const Login = async ({
  formData,
  handleChange,
  handleSubmit,
  handleTogglePassword,
  showPassword,
  setShowLogin,
}: IProps) => {
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
            Login
          </button>
          <div className=" my-2">
            <h3 className="text-sm text-center">
              Don't have an account?{" "}
              <button onClick={() => setShowLogin((prevState) => !prevState)}>
                Signup
              </button>
            </h3>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
