'use client'

import { useState } from 'react'
import { FaUser, FaLock } from 'react-icons/fa'
import Navbar from '../components/navbar'
import { useRouter } from 'next/navigation'

export default function AddAdminPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      alert('รหัสผ่านไม่ตรงกัน')
      return
    }

    try {
      // ดึง username ของผู้ที่ล็อกอินจาก localStorage
      const loggedInUsername = localStorage.getItem('username')

      if (!loggedInUsername) {
        alert('ไม่พบข้อมูลผู้ใช้งานที่ล็อกอิน')
        return
      }

      const res = await fetch('http://localhost:8000/admin/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username, // username ของแอดมินใหม่
          password,
          created_by: loggedInUsername, // ส่ง username ของผู้ที่ล็อกอินไปด้วย
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        alert(data.message || 'เกิดข้อผิดพลาด')
        return
      }

      alert('สร้างแอดมินสำเร็จ')
      setUsername('')
      setPassword('')
      setConfirmPassword('')
    } catch (err) {
      console.error(err)
      alert('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้')
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="flex flex-1 items-center justify-center">
        <div className="bg-red-700 p-8 rounded-xl shadow-md w-full max-w-sm">
          <h1 className="text-2xl text-white font-semibold text-center mb-6">
            New Admin
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2 rounded-full bg-red-600 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-white"
              />
              <FaUser className="absolute top-1/2 left-4 transform -translate-y-1/2 text-white" />
            </div>

            {/* Password Input */}
            <div className="relative">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2 rounded-full bg-red-600 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-white"
              />
              <FaLock className="absolute top-1/2 left-4 transform -translate-y-1/2 text-white" />
            </div>

            {/* Confirm Password Input */}
            <div className="relative">
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2 rounded-full bg-red-600 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-white"
              />
              <FaLock className="absolute top-1/2 left-4 transform -translate-y-1/2 text-white" />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-white text-red-700 font-semibold py-2 rounded-full hover:bg-gray-100 transition"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
