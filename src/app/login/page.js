'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FaUser, FaLock } from 'react-icons/fa'

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('http://localhost:8000/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })

      const text = await res.text()
      let data

      try {
        data = JSON.parse(text)
      } catch (parseErr) {
        throw new Error(`Invalid JSON response: ${text}`)
      }

      if (!res.ok) {
        alert(data.message || 'เข้าสู่ระบบล้มเหลว')
        return
      }

      if (!data.token) {
        alert('ไม่พบ token จากเซิร์ฟเวอร์')
        return
      }

      // เก็บ token และ username ลงใน localStorage
      localStorage.setItem('token', data.token)
      localStorage.setItem('username', username) // เก็บ username

      router.push('/management')  // ← เปลี่ยนจาก /dashboard เป็น /management

    } catch (err) {
      console.error('Login Error:', err)
      alert('เกิดข้อผิดพลาดขณะเข้าสู่ระบบ: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="bg-red-700 p-8 rounded-xl shadow-md w-full max-w-sm">
        <h1 className="text-2xl text-white font-semibold text-center mb-6">Login</h1>
        <form onSubmit={handleLogin} className="space-y-4">
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
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-red-700 font-semibold py-2 rounded-full hover:bg-gray-100 transition"
          >
            {loading ? 'กำลังเข้าสู่ระบบ...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}
