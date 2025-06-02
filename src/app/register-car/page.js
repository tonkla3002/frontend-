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
    otherDepartment: "", // สำหรับเก็บค่าหน่วยงาน "อื่นๆ"
    brand: "",
    model: "",
    color: "",
    startDate: "",
    endDate: "",
  });

  const [showDateFields, setShowDateFields] = useState(false); // สถานะสำหรับควบคุมการแสดงช่องวันที่

  const departments = [
    "สำนักงานเลขานุการ",
    "ภาควิศวกรรมไฟฟ้าและคอมพิวเตอร์",
    "วิศวกรรมเครื่องกล",
    "ภาควิศวกรรมอุตสาหการ",
    "ภาควิศวกรรมโยธา",
    "อื่นๆ",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCheckboxChange = () => {
    setShowDateFields(!showDateFields); // สลับสถานะเมื่อคลิก Checkbox
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      firstname: formData.firstName,
      lastname: formData.lastName,
      department: formData.department === "อื่นๆ" ? formData.otherDepartment : formData.department,
      license: formData.license,
      brand: formData.brand,
      model: formData.model,
      color: formData.color,
      startDate: formData.startDate || null, // หากไม่มีค่า ให้ส่งเป็น null
      endDate: formData.endDate || null, // หากไม่มีค่า ให้ส่งเป็น null
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
        <h2 className="text-2xl font-bold text-center mb-8">ลงทะเบียนรถ</h2>
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
              value={formData.department}
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

          {/* แสดง Textbox เมื่อเลือก "อื่นๆ" */}
          {formData.department === "อื่นๆ" && (
            <div className="grid grid-cols-1 gap-4">
              <input
                type="text"
                name="otherDepartment"
                placeholder="กรอกชื่อหน่วยงาน"
                onChange={handleChange}
                className="border p-2 rounded"
              />
            </div>
          )}

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

          {/* Checkbox สำหรับควบคุมการแสดงช่องวันที่ */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="toggleDateFields"
              checked={showDateFields}
              onChange={handleCheckboxChange}
              className="cursor-pointer"
            />
            <label htmlFor="toggleDateFields" className="cursor-pointer">
              กำหนดวันที่เริ่มต้นและสิ้นสุด
            </label>
          </div>

          {/* ช่องกรอกวันที่ */}
          {showDateFields && (
            <div className="flex items-center justify-center gap-4">
              <div className="flex items-center gap-2">
                <span>วันที่เริ่มต้น:</span>
                <input
                  type="date"
                  name="startDate"
                  onChange={handleChange}
                  className="border p-2 rounded"
                />
              </div>
              <div className="flex items-center gap-2">
                <span>วันที่สิ้นสุด:</span>
                <input
                  type="date"
                  name="endDate"
                  onChange={handleChange}
                  className="border p-2 rounded"
                />
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded justify-center hover:bg-green-700 transition-all items-center flex mx-auto font-semibold"
            >
              Add
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
