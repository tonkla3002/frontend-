"use client";

import { useState, useEffect } from "react";
import Navbar from "../components/navbar";

export default function ChangePasswordPage() {
  const [username, setUsername] = useState(""); // เก็บ username
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  // ดึง username จาก localStorage เมื่อ component โหลด
  useEffect(() => {
    const storedUsername = localStorage.getItem("username"); // สมมติว่า username ถูกเก็บไว้ใน localStorage
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage("❌ รหัสผ่านใหม่ไม่ตรงกัน");
      return;
    }

    try {
      const token = localStorage.getItem("token"); // ดึง token จาก localStorage
      const res = await fetch("http://localhost:8000/admin/changePassword", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username, // ส่ง username ไปพร้อมกับคำขอ
          password: newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage(`❌ ${data.message || "เปลี่ยนรหัสผ่านไม่สำเร็จ"}`);
      } else {
        setMessage("✅ เปลี่ยนรหัสผ่านสำเร็จ");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ เกิดข้อผิดพลาด");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="flex items-center justify-center px-4 min-h-[calc(100vh-64px)]">
        <form
          onSubmit={handleSubmit}
          className="bg-white text-black shadow-md rounded-2xl p-8 w-full max-w-md"
        >
          <h1 className="text-2xl font-bold mb-6 text-center">เปลี่ยนรหัสผ่าน</h1>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">รหัสผ่านปัจจุบัน</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">รหัสผ่านใหม่</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">ยืนยันรหัสผ่านใหม่</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 mt-6 rounded-lg transition"
          >
            ยืนยันการเปลี่ยนรหัสผ่าน
          </button>

          {message && (
            <p className="mt-4 text-center text-sm">{message}</p>
          )}
        </form>
      </div>
    </div>
  );
}
