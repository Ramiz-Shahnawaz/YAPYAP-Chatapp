import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    handleGoogleSignIn,
    handleEmailSignUp,
    handleEmailLogin,
} from "../config/auth";
import { db } from '../config/firebase';
import { doc, serverTimestamp, setDoc } from "firebase/firestore";

const Login = () => {
    const [state, setstate] = useState("Sign Up");
    const [formdata, setformdata] = useState({
        email: "",
        password: "",
    });
    const [loading, setloading] = useState(false);
    const [error, seterror] = useState("");
    const navigate = useNavigate();

    const handlechange = (e) => {
        setformdata({ ...formdata, [e.target.name]: e.target.value });
    };

    const handlesubmit = async (e) => {
        e.preventDefault();
        setloading(true);
        seterror("");

        try {
            if (state == "Sign Up") {
                const usercredentials = await handleEmailSignUp(formdata.email, formdata.password);

                await setDoc(doc(db, "users", usercredentials.user.uid), {
                    email: formdata.email,
                    createdAt: serverTimestamp(),
                });
            } else {
                await handleEmailLogin(formdata.email, formdata.password);
            }
            navigate("/chat");
        } catch (error) {
            console.error(error);
        } finally {
            setloading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            setloading(true);
            const result = await handleGoogleSignIn();

            await setDoc(doc(db, "users", result.user.uid), {
                name: result.user.displayName || "user",
                email: result.user.email,
                profilePic: result.user.photoURL || " ",
                createdAt: serverTimestamp(),
            });
            navigate("/chat");
        } catch (error) {
            console.error(error);
        } finally {
            setloading(false);
        }
    };

    return (
        <form
            onSubmit={handlesubmit}
            className="min-h-screen flex flex-col items-center bg-background"
        >
            <div className="w-full max-w-md flex flex-col items-center mt-8 sm:mt-0">
                <img
                    className="mb-[-20px] sm:mb-[-50px] w-48 sm:w-64"
                    src="logo.png"
                    alt=""
                />
                <p className="text-2xl text-black font-semibold">Welcome to YAPYAP</p>
            </div>
            <div className="flex flex-col gap-3 items-start p-6 sm:p-8  w-full max-w-md rounded-xl text-black text-sm shadow-lg">
                <p className="font-semibold text-2xl w-full">
                    {state === "Sign Up" ? "Create Account" : "Login"}
                </p>

                {error && <p className="text-red-500 w-full text-center">{error}</p>}

                <div className="w-full">
                    <label>Email</label>
                    <input
                        className="border border-zinc-300 rounded w-full p-2 mt-1"
                        name="email"
                        type="email"
                        value={formdata.email}
                        onChange={handlechange}
                    />
                </div>

                <div className="w-full">
                    <label>password</label>
                    <input
                        className="border border-zinc-300 rounded w-full p-2 mt-1"
                        name="password"
                        type="password"
                        value={formdata.password}
                        onChange={handlechange}
                        minLength="6"
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className=" bg-accent text-white w-full  mt-1 py-2 rounded-md text-base hover:opacity-80 transition-opacity"
                >
                    {loading
                        ? "Processing..."
                        : state === "Sign Up"
                            ? "Create Account"
                            : "Login"}
                </button>

                <div className="w-full flex flex-col items-center ">
                    <p className=" text-gray-800 text-base">or</p>
                    <button
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className="bg-white text-black flex items-center justify-center gap-2 w-full py-2 px-4 rounded-md text-base border border-gray-300 hover:bg-gray-100 transition"
                        type="button"
                    >
                        {" "}
                        <img className="w-[25px]" src="google.png" alt="" />
                        Continue With Google
                    </button>
                </div>
                {state === "Sign Up" ? (
                    <p onClick={() => setstate("Login")}>
                        Already have an account?{" "}
                        <span className="text-text underline cursor-pointer">
                            Login here
                        </span>
                    </p>
                ) : (
                    <p onClick={() => setstate("Sign Up")}>
                        Create a new account?{" "}
                        <span className="text-text underline cursor-pointer">
                            Click here
                        </span>
                    </p>
                )}
            </div>
        </form>
    );
};

export default Login;
