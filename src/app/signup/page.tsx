"use client";
import React, { useState } from "react";
import Link from "next/link";
import { IGenericReponse, ISignupCredential, IToaster } from "@/types";

import InputField from "@/components/common/InputField";
import Button from "@/components/common/Button";
import { makeApiCall } from "@/utils/makeApiCall";
import { useRouter } from "next/navigation";

import { convertTimeToMinutes } from "@/utils/convertTimeToMinutes";
const Signup = () => {
  const router = useRouter();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [validation, setValidation] = useState({
    email: "",
    name: "",
    password: "",
  });

  const [signupCreds, setSignupCreds] = useState<ISignupCredential>({
    name: "",
    password: "",
    email: "",
    bufferTime: 0,
    dayAvailabilityStart: "",
    dayAvailabilityEnd: "",
    timeAvailabilityStart: "00:00",
    timeAvailabilityEnd: "00:00",
  });
  const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value.trim();
    setSignupCreds((oldValue) => ({
      ...oldValue,
      name: newValue,
    }));
    if (!newValue) {
      setValidation((oldVal) => ({
        ...oldVal,
        name: "Name cannot be empty",
      }));
    } else {
      setValidation((oldVal) => ({ ...oldVal, name: "" }));
    }
  };
  const handleChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value.trim();

    setSignupCreds((oldValue) => ({
      ...oldValue,
      email: newValue,
    }));
    if (!newValue) {
      setValidation((oldVal) => ({
        ...oldVal,
        email: "Email cannot be empty",
      }));
    } else if (!emailRegex.test(newValue)) {
      setValidation((oldVal) => ({ ...oldVal, email: "Email is Invalid" }));
    } else {
      setValidation((oldVal) => ({ ...oldVal, email: "" }));
    }
  };

  const handleChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setSignupCreds((oldValue) => ({
      ...oldValue,
      password: newValue,
    }));
    if (!newValue) {
      setValidation((oldVal) => ({
        ...oldVal,
        password: "Password cannot be empty",
      }));
    } else {
      setValidation((oldVal) => ({ ...oldVal, password: "" }));
    }
  };

  const handleSignup = async () => {
    try {
      const startTime = convertTimeToMinutes(signupCreds.timeAvailabilityStart);
      const endTime = convertTimeToMinutes(signupCreds.timeAvailabilityEnd);
      setError("");
      if (startTime > endTime) {
        setError("End Time cannot be greater than Start Time");
        return;
      }
      setIsLoading(true);
      const signupPayload = {
        ...signupCreds,
        timeAvailabilityStart: startTime,
        timeAvailabilityEnd: endTime,
      };
      const response = await makeApiCall<IGenericReponse<null>>({
        endpoint: "signup",
        method: "POST",
        data: signupPayload,
      });
      if (response.type === "Success") {
        router.push("/availability");
      }
    } catch (e) {
      setError(e as string);
    }
    setIsLoading(false);
  };
  return (
    <div className="h-screen p-2 md:p-4 grid grid-col-1 md:grid-cols-2">
      <div className="hidden md:block"></div>
      <div className="flex justify-center items-center">
        <div
          className="flex flex-col bg-[#5c7481ab] dark:bg-[#f4f5f6ab] shadow-lg p-5 rounded-lg
        min-w-[305px] w-full max-w-[350px]"
        >
          <div>
            <div className="text-center dark:text-white text-black font-medium text-2xl py-2 mb-4">
              <span>Signup Page</span>
            </div>
            <div className="flex flex-col gap-2 mb-6">
              <div>
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium dark:text-white text-black"
                >
                  Name
                </label>
                <InputField
                  label="Name"
                  type="text"
                  id="name"
                  error={validation.name}
                  value={signupCreds.name}
                  onChange={handleChangeName}
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium dark:text-white text-black"
                >
                  Email
                </label>
                <InputField
                  label="Email"
                  type="text"
                  id="email"
                  error={validation.email}
                  value={signupCreds.email}
                  onChange={handleChangeEmail}
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium dark:text-white text-black"
                >
                  Password
                </label>
                <InputField
                  label="Password"
                  type="password"
                  id="password"
                  error={validation.password}
                  value={signupCreds.password}
                  onChange={handleChangePassword}
                />
              </div>
            </div>
            <div className="text-center mb-2">
              <Button
                label="Signup"
                onClick={handleSignup}
                loading={isLoading}
                disabled={!Object.values(signupCreds).some((value) => !value)}
              />
            </div>
            {error && (
              <div className="bg-white bg-opacity-50 text-xs text-black text-center mb-1 p-1">
                {error}
              </div>
            )}
            <div className="text-xs flex justify-end items-center gap-1">
              <span>Already have an account?</span>
              <Link href={"/login"}>
                <span className="border-b border-b-transparent hover:text-blue-600 hover:cursor-pointer pb-0.5 hover:border-b-blue-600 font-medium">
                  sign in
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Signup;
