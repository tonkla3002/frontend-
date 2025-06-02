"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/navbar";

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    license: "",
    department: "",
    brand: "",
    model: "",
    color: "",
    isDateRange: false,
    startDate: "",
    endDate: "",
  });

  const departments = [
    "วิศวกรรมโยธา",
    "วิศวกรรมเครื่องกล",
    "วิศวกรรมไฟฟ้า",
    "วิศวกรรมคอมพิวเตอร์",
    "วิศวกรรมอุตสาหการ",
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ตรวจสอบวันที่ถ้าเลือกกำหนดช่วงเวลา
    if (formData.isDateRange) {
      if (!formData.startDate || !formData.endDate) {
        alert("กรุณาเลือกวันที่เริ่มต้นและวันที่สิ้นสุด");
        return;
      }
    }

    const payload = {
      firstname: formData.firstName,
      lastname: formData.lastName,
      department: formData.department,
      license: formData.license,
      brand: formData.brand,
      model: formData.model,
      color: formData.color,
      startDate: formData.isDateRange ? formData.startDate : null,
      endDate: formData.isDateRange ? formData.endDate : null,
    };

    try {
      const res = await fetch("http://localhost:8000/data_car", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Failed to submit data: ${res.status} - ${errText}`);
      }

      alert("บันทึกข้อมูลเรียบร้อยแล้ว");
      router.push("/management");
    } catch (error) {
      console.error(error);
      alert("เกิดข้อผิดพลาดในการส่งข้อมูล");
    }
  };

  return (
    <div className="min-h-screen bg-white text-black">
        <Navbar />

      <main className="p-10">
        <h2 className="text-2xl font-bold text-center mb-8">ลงทะเบียน</h2>
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="firstName"
              placeholder="ชื่อ"
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <input
              type="text"
              name="lastName"
              placeholder="นามสกุล"
              onChange={handleChange}
              className="border p-2 rounded"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="license"
              placeholder="เลขทะเบียน"
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <select
              name="department"
              onChange={handleChange}
              className="border p-2 rounded bg-white"
              defaultValue=""
            >
              <option value="" disabled>
                เลือกหน่วยงาน
              </option>
              {departments.map((dept, idx) => (
                <option key={idx} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              name="brand"
              placeholder="ยี่ห้อรถ"
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <input
              type="text"
              name="model"
              placeholder="รุ่นรถ"
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <input
              type="text"
              name="color"
              placeholder="สีรถ"
              onChange={handleChange}
              className="border p-2 rounded"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isDateRange"
              onChange={handleChange}
              checked={formData.isDateRange}
            />
            <label htmlFor="isDateRange">กำหนดวัน เริ่มต้น-สิ้นสุด</label>
          </div>

          {formData.isDateRange && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="date"
                name="startDate"
                onChange={handleChange}
                className="border p-2 rounded"
              />
              <input
                type="date"
                name="endDate"
                onChange={handleChange}
                className="border p-2 rounded"
              />
            </div>
          )}

          <div>
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded"
            >
              Add
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
