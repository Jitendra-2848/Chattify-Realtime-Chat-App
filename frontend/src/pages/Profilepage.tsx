import React, { useEffect, useRef, useState } from "react";
import { CiCamera, CiUser } from "react-icons/ci";
import { MdOutlineMailOutline, MdSwipeRight } from "react-icons/md";
import { useAuthStore } from "../store/authStore";
import { CheckmarkIcon } from "react-hot-toast";

const Profilepage = () => {
  const { update_profile, AuthUser, isprofileupdating } = useAuthStore();
  const [pic_temp, setPicTemp] = useState<string | ArrayBuffer | null>(null);
  const [name, setName] = useState("");
  const [editing, setediting] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = reader.result as string;
      update_profile({ profile_pic: base64 });
      setPicTemp(base64);
    };
    reader.onerror = () => console.error("Image upload failed");
  };
  const changename = async () => {
    try {
      update_profile({ username: name });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (AuthUser?.username) {
      setName(AuthUser.username);
    }
    if (AuthUser?.profile_pic) {
      setPicTemp(AuthUser.profile_pic);
    }
  }, []);
  return (
    <div className="w-full h-screen bg-base-200 flex justify-center items-center">
      <div className="bg-base-100 text-base-content max-w-2xl w-[90%] sm:w-[85%] shadow-xl rounded-3xl p-6 space-y-8">
        <div className="text-center text-sm">
          <p className="text-xl font-bold text-primary">Profile</p>
          <p className="text-gray-500">Your profile information</p>

          <div className="flex justify-center mt-5">
            <div className="relative w-36 sm:w-40">
              <img
                src={
                  typeof pic_temp === "string"
                    ? pic_temp
                    : AuthUser?.profile_pic || "/default.png"
                }
                alt="Profile"
                className="object-cover border-4 border-primary w-full aspect-square rounded-full p-1"
              />
              <label
                htmlFor="profile-upload"
                className={`absolute bottom-2 right-2 p-2 rounded-full bg-primary text-white hover:bg-primary-focus text-lg cursor-pointer shadow-md transition-all ${
                  isprofileupdating
                    ? "animate-pulse pointer-events-none bg-gray-400"
                    : ""
                }`}
              >
                <CiCamera />
              </label>

              <input
                id="profile-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
                ref={fileInputRef}
              />
            </div>
          </div>

          {isprofileupdating ? (
            <p className="mt-2 text-xs animate-pulse text-gray-400">
              Uploading...
            </p>
          ) : (
            <p className="mt-2 text-xs text-gray-400">
              Click the camera icon to change profile picture.
            </p>
          )}
        </div>

        <div className="text-sm w-full sm:w-[80%] mx-auto text-start">
          <form className="space-y-3">
            <div>
              <label className="flex items-center space-x-1 font-semibold">
                <CiUser />
                <span>Full Name</span>
              </label>
              <div className="flex gap-1">
                <input
                  type="text"
                  name="name"
                  onKeyDown={(e) => {
                    if (e.key == "Enter") {
                      e.preventDefault();
                      changename();
                      setediting(false);
                    }
                  }}
                  placeholder={AuthUser?.username}
                  onChange={(e) => {
                    setName(e.target.value);
                    setediting(true);
                  }}
                  value={name}
                  className="w-full flex-1 rounded-md px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary bg-base-200 text-base-content"
                />
                {editing && (
                  <button
                    type="button"
                    onClick={() => {
                      setediting(false);
                      changename();
                    }}
                    className="btn rounded-md"
                  >
                    <CheckmarkIcon />
                  </button>
                )}
              </div>
            </div>

            <div>
              <label className="flex items-center space-x-1 font-semibold">
                <MdOutlineMailOutline />
                <span>Email Address</span>
              </label>
              <input
                type="email"
                name="email"
                placeholder={AuthUser?.email || "example@email.com"}
                disabled
                className="w-full rounded-md px-3 py-2 border border-gray-300 hover:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary bg-base-200 text-base-content"
              />
            </div>
          </form>
        </div>

        <div className="px-1 text-xs text-start border-t border-gray-300 pt-3">
          <p className="text-sm font-semibold mb-2 text-primary">
            Account Information
          </p>

          <div className="flex justify-between mb-1">
            <p>Member Since</p>
            <span>{AuthUser?.createdAt?.split("T")[0].split("-").reverse().join("-")}</span>
          </div>

          <div className="flex justify-between">
            <p>Account Status</p>
            <span className="text-green-600 font-semibold">Live</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profilepage;
