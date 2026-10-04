import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { login } from "../redux/slices/authSlice";

function LoginPage() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, error } = useSelector(
        (state) => state.auth
    );

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });


    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        const result = await dispatch(login(formData));

        console.log("login",result);

        if (login.fulfilled.match(result)) {
            navigate("/dashboard");
        }

    };


    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">

            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow">

                <h1 className="text-2xl font-bold text-center mb-6">
                    Inventory Management System
                </h1>

                <form onSubmit={handleSubmit}>

                    <div className="mb-4">

                        <label className="block mb-2 font-medium">
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            className="w-full border rounded px-3 py-2"
                            required
                        />

                    </div>


                    <div className="mb-4">

                        <label className="block mb-2 font-medium">
                            Password
                        </label>

                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            className="w-full border rounded px-3 py-2"
                            required
                        />

                    </div>


                    {error && (
                        <p className="text-red-500 mb-4">
                            {typeof error === "string"
                                ? error
                                : "Login failed"}
                        </p>
                    )}


                    <button
                        type="submit"
                        // disabled={loading}
                        className="w-full bg-black text-white py-2 rounded"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>

                </form>

            </div>

        </div>
    );
}

export default LoginPage;