"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="bg-gray-100 py-4 px-6 flex items-center justify-between shadow">
      <div className="flex items-center gap-2">
        <img src="logo.png" alt="logo" className="w-10 h-10" />
        <h1 className="text-xl font-semibold text-black">
          ระบบบริหารจัดการที่จอดคณะวิศวกรรมศาสตร์
        </h1>
      </div>
      <div className="text-sm flex items-center gap-4">
        <span
          className="mr-4 cursor-pointer text-blue-500"
          onClick={() => router.push("/management")}
        >
          รายชื่อ
        </span>
        <span
          className="mr-4 cursor-pointer text-blue-500"
          onClick={() => router.push("/register-car")}
        >
          ลงทะเบียนรถ
        </span>
        <span
          className="mr-4 cursor-pointer text-blue-500"
          onClick={() => router.push("/parking-history")}
        >
          ประวัติการจอดรถ
        </span>
        <div className="relative">
          <button
            className="flex items-center gap-2 cursor-pointer"
            onClick={toggleDropdown}
          >
            <span role="img" aria-label="User Icon" className="text-2xl">
              👤
            </span>
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg">
              <span
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                onClick={() => router.push("/change-password")}
              >
                เปลี่ยนรหัสผ่าน
              </span>
              <span
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                onClick={() => router.push("/register-admin")}
              >
                เพิ่มแอดมิน
              </span>
              <span
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  localStorage.removeItem("token");
                  router.push("/login");
                }}
              >
                ออกจากระบบ
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}