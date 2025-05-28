import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Input from "../../components/Inputs/Input";
import { validateEmail } from "../../utilis/helper";
import axiosInstance from '../../utilis/axiosInstance';
import { API_PATHS } from '../../utilis/apiPaths';
import { UserContext } from '../../context/userContext';
import SpinnerLoader from '../../components/Loader/SpinnerLoader';

const Login = ({ setCurrentPage }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { updateUser } = useContext(UserContext);
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password) {
      setError("Please enter a password.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });
      const { token } = response.data;
      if (token) {
        localStorage.setItem("token", token);
        updateUser(response.data);
        navigate("/dashboard");
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again.")
      }
    } finally {
      setLoading(false);
    }
  };
  return <div className="w-[99vw] md:w-[33vw] p-7 flex flex-col justify-center ">
    <h3 className='text-lg font-semibold text-black'>Welcome Back</h3>
    <p className='text-xs text-slate-700 mt-[5px] mb-6'>
      Please enter your details to log in
    </p>

    <form onSubmit={handleLogin}>
      <Input
        value={email} onChange={({ target }) => setEmail(target.value)} label="Email Address" placeholder="shashi@gmail.com" type="text" />
      <Input
        value={password} onChange={({ target }) => setPassword(target.value)} label="Password" type="password" />

      {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}
      <button type='submit' className='btn-primary flex items-center justify-center min-h-[38px]' disabled={loading}>
        {loading ? (
          <div className="flex items-center gap-2">
            <SpinnerLoader />
            <span>Logging in...</span>
          </div>
        ) : (
          "Login"
        )}
      </button>
      <p className='text-[13px] text-slate-800 mt-3'>
        Don't have an account?{" "}
        <button className='font-medium text-primary underline cursor-pointer'
          onClick={() => {
            setCurrentPage("signup")
          }}>SignUp</button>
      </p>
    </form>
  </div>
}

export default Login
