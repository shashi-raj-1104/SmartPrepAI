import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from "../../components/Inputs/Input";
import ProfilePhotoSelector from "../../components/Inputs/ProfilePhotoSelector";
import { UserContext } from '../../context/userContext';
import axiosInstance from '../../utilis/axiosInstance';
import { API_PATHS } from '../../utilis/apiPaths';
import uploadImage from '../../utilis/uploadImage';
import SpinnerLoader from '../../components/Loader/SpinnerLoader';

const SignUp = ({ setCurrentPage }) => {
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    // TODO: Add validation + signup logic
    if (!fullName || !email || !password) {
      setError("Please fill out all fields.");
      return;
    }
    setError(null);

    console.log({ profilePic, fullName, email, password });
    // You might navigate or call an API here
    setError("");
    setLoading(true);
    try {
      let profileImageUrl = "";
      if (profilePic) {
        const imgUplaodRes = await uploadImage(profilePic);
        profileImageUrl = imgUplaodRes.imageUrl || "";
      }

      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name: fullName,
        email,
        password,
        profileImageUrl,
      });

      const token = response.data;
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

  return (
    <div className="w-[99vw] md:w-[33vw] p-7 flex flex-col justify-center">
      <h3 className='text-lg font-semibold text-black'>Create an Account</h3>
      <p className='text-xs text-slate-700 mt-[5px] mb-6'>
        Join us today by entering your details below.
      </p>
      <form onSubmit={handleSignup}>
        <ProfilePhotoSelector
          image={profilePic}
          setImage={setProfilePic}
          preview={preview}
          setPreview={setPreview}
        />

        <div className="mt-4">
          <Input
            value={fullName}
            onChange={({ target }) => setFullName(target.value)}
            label="Full Name"
            placeholder="Shashi"
            type="text"
          />
          <Input
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            label="Email Address"
            placeholder="shashi@gmail.com"
            type="text"
          />
          <Input
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            label="Password"
            placeholder="min 8 characters"
            type="password"
          />
        </div>

        {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}

        <button
          type='submit'
          disabled={loading}
          className='mt-4 w-full bg-orange-300 hover:bg-orange-600 text-white py-2 rounded text-sm font-semibold flex justify-center items-center min-h-[38px]'
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <SpinnerLoader />
              <span>Signing up...</span>
            </div>
          ) : (
            "Sign Up"
          )}

        </button>

        <p className='text-[13px] text-slate-800 mt-3'>
          Already have an account?{" "}
          <button
            type="button"
            className='font-medium text-primary underline cursor-pointer'
            onClick={() => setCurrentPage("login")}
          >
            Login
          </button>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
