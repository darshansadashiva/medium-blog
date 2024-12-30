import { ChangeEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SignupInput } from "darshansadashiva.medium-common";
import axios from "axios";
import { BACKEND_URL } from "../config";

export const Auth = ({ type }: { type: "signup" | "signin" }) => {
  const navigate = useNavigate()
  const [postInputs, setPostInputs] = useState<SignupInput>({
    name: "",
    username: "",
    password: "",
  });

  async function sendRequest () {
    try{
      const response = await axios.post(`${BACKEND_URL}/api/v1/user/${type==="signin" ? "signin" : "signup"}`, postInputs)
      const jwt = response.data
      localStorage.setItem("token", jwt)
      navigate("/blogs")
    }catch(e){
      alert("Error while signing up")
    }
  }

  return (
    <div className="flex justify-center h-screen flex-col">
      {/* {JSON.stringify(postInputs)} */}
      <div className="flex justify-center">
        <div>
          <div className="px-11">
            <div className="text-2xl font-extrabold">Create an account</div>
            <div className="text-slate-400">
              Already have one ? {" "}
              <Link className="underline" to = {type === "signup" ? "/signin" : "/signup"}>
                {type === "signup" ? "signin" : "signup"}
              </Link>
            </div>
          </div>
          <div className="pt-5">
            {type === "signup" ? <LabeledInput
              label="Name"
              placeholder="Enter your name"
              onchange={(e) => {
                setPostInputs({
                  ...postInputs,
                  name: e.target.value,
                });
              }}
            /> : null}
            <LabeledInput
              label="Email"
              placeholder="user@gmail.com"
              onchange={(e) => {
                setPostInputs({
                  ...postInputs,
                  username: e.target.value,
                });
              }}
            />
            <LabeledInput
              label="Password"
              type={"password"}
              placeholder="Enter your password"
              onchange={(e) => {
                setPostInputs({
                  ...postInputs,
                  password: e.target.value,
                });
              }}
            />
          </div>
          <button
            onClick={sendRequest}
            type="button"
            className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-md text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 w-full mt-4"> {type === "signup" ? "Sign up" : "Sign in"} </button>
        </div>
      </div>
    </div>
  );
};

interface LabeledInputType {
  label: string;
  placeholder: string;
  onchange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}

const LabeledInput = ({
  label,
  placeholder,
  onchange,
  type,
}: LabeledInputType) => {
  return (
    <div>
      <label className="block mb-2 text-sm font-semibold text-black pt-3">
        {label}
      </label>
      <input
        type={type || "text"}
        id="first_name"
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        placeholder={placeholder}
        onChange={onchange}
        required
      />
    </div>
  );
};
