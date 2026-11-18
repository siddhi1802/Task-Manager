import React, { useContext, useState } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import { validateEmail } from "../../utils/helper";
import ProfilePhotoSelector from "../../components/Inputs/ProfilePhotoSelector";
import Input from "../../components/Inputs/Input";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import {UserContext} from "../../context/userContext";
import uploadImage from "../../utils/uploadImage";

const SignUp = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminInviteToken, setAdminInviteToken] = useState("");

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {updateUser} = useContext(UserContext)

  //handle SignUp form submit
  const handleSignUp = async (e) => {
    e.preventDefault();

    let profileImageUrl = "";

    if (!fullName) {
      setError("Please enter full name.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Please enter the password");
      return;
    }

    setError("");
    setLoading(true);

    try{

      //Upload image if present
      if (profilePic) {
        const imgUploadRes = await uploadImage(profilePic);
        profileImageUrl = imgUploadRes.imageUrl || "";
      }

      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name: fullName,
        email,
        password,
        profileImageUrl,
        adminInviteToken,

      });

      const {token, role } = response.data;

      if(token) {
        localStorage.setItem("token", token);
        updateUser(response.data);

        //Register based on role
        if (role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/user/dashboard");
        }
      }
    } catch (error){
      setLoading(false);
        if (error.response && error.response.data.message)  {
          setError(error.response.data.message);
        } else {
          setError("Something went wrong. Please try again.");
        }
    }

    // 2. --- THE API LOGIC MOVED HERE ---
    try {
      let profileImageUrl = "";

      // Step 1: Upload image if it exists
      if (profilePic) {
        const formData = new FormData();
        formData.append("image", profilePic);

        const uploadRes = await axiosInstance.post(
          API_PATHS.IMAGE.UPLOAD_IMAGE,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        profileImageUrl = uploadRes.data.imageUrl;
      }

      // Step 2: Register the user with all data
      const registerData = {
        name: fullName,
        email,
        password,
        profileImageUrl,
        adminInviteToken, // Use the correct state variable
      };

      await axiosInstance.post(API_PATHS.AUTH.REGISTER, registerData);

      // Step 3: Handle success
      setLoading(false);
      toast.success("Account created successfully! Please log in.");
      navigate("/login"); // Redirect to login
    } catch (err) {
      // Step 4: Handle errors
      setLoading(false);
      const message =
        err.response?.data?.message || "Signup failed. Please try again.";
      setError(message);
      toast.error(message);
    }

  };

  return (
    <AuthLayout>
      <div className="lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">Create an Account</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          Join us today by entering your details below.
        </p>

        <form onSubmit={handleSignUp}>
          <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              value={fullName}
              onChange={({ target }) => setFullName(target.value)}
              label="Full Name"
              placeholder="User"
              type="text"
            />

            <Input
              value={email}
              onChange={({ target }) => setEmail(target.value)}
              label="Email Address"
              placeholder="user@gmail.com"
              type="text"
            />

            <Input
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              label="Password"
              placeholder="Min 8 characters"
              type="password"
            />

            <Input
              value={adminInviteToken}
              onChange={({ target }) => setAdminInviteToken(target.value)}
              label="Admin Invite Token"
              placeholder="6 Digit Code"
              type="text"
            />
          </div>

          {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

          {/* 4. UPDATE THE BUTTON to show loading state */}
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "CREATING ACCOUNT..." : "SIGN UP"}
          </button>

          <p className=" text-[13px] text-slate-800 mt-3">
            Already an account?{" "}
            <Link className="font-medium text-primary underline" to="/login">
              Login
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};
export default SignUp;