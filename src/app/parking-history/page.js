"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/navbar";

export default function ParkingManagementPage() {
  const router = useRouter();

  const departments = [
    "วิศวกรรมโยธา",
    "วิศวกรรมเครื่องกล",
    "วิศวกรรมไฟฟ้า",
    "วิศวกรรมคอมพิวเตอร์",
    "วิศวกรรมอุตสาหการ",
  ];

  const [filters, setFilters] = useState({
    department: "",
    name: "",
    license: "",
    brand: "",
    model: "",
    color: "",
    dateFrom: "",
    dateTo: "",
  });

  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const fetchData = () => {
    fetch("http://localhost:8000/data_park")
      .then((res) => res.json())
      .then((res) => {
        setData(res);
        setFilteredData(res);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    e.preventDefault();

    const filtered = data.filter((item) => {
      const nameMatch =
        item.firstname.toLowerCase().includes(filters.name.toLowerCase()) ||
        item.lastname.toLowerCase().includes(filters.name.toLowerCase());

      return (
        (!filters.department || item.department === filters.department) &&
        nameMatch &&
        item.license.toLowerCase().includes(filters.license.toLowerCase()) &&
        item.brand.toLowerCase().includes(filters.brand.toLowerCase()) &&
        item.model.toLowerCase().includes(filters.model.toLowerCase()) &&
        item.color.toLowerCase().includes(filters.color.toLowerCase()) &&
        (!filters.dateFrom ||
          new Date(item.start) >= new Date(filters.dateFrom)) &&
        (!filters.dateTo || new Date(item.end) <= new Date(filters.dateTo))
      );
    });

    setFilteredData(filtered);
  };

  const handleDelete = async (id_park) => {
    const confirmDelete = confirm("คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลนี้?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:8000/data_car/${id_park}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("ลบข้อมูลไม่สำเร็จ");

      alert("ลบข้อมูลเรียบร้อยแล้ว");
      fetchData(); // โหลดข้อมูลใหม่หลังลบ
    } catch (error) {
      console.error(error);
      alert("เกิดข้อผิดพลาดในการลบข้อมูล");
    }
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />

      <div className="p-6">
        <form onSubmit={handleSearch} className="space-y-3">
          <div className="flex flex-wrap gap-4">
            <select
              name="department"
              onChange={handleChange}
              className="border p-2 rounded bg-white"
              value={filters.department}
            >
              <option value="">ทั้งหมด</option>
              {departments.map((dept, idx) => (
                <option key={idx} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            <input
              type="text"
              name="name"
              placeholder="ชื่อหรือนามสกุล"
              onChange={handleChange}
              className="border px-2 py-1 rounded"
            />
            <input
              type="text"
              name="license"
              placeholder="เลขทะเบียน"
              onChange={handleChange}
              className="border px-2 py-1 rounded"
            />
            <input
              type="text"
              name="brand"
              placeholder="ยี่ห้อรถ"
              onChange={handleChange}
              className="border px-2 py-1 rounded"
            />
            <input
              type="text"
              name="model"
              placeholder="รุ่นรถ"
              onChange={handleChange}
              className="border px-2 py-1 rounded"
            />
            <input
              type="text"
              name="color"
              placeholder="สีรถ"
              onChange={handleChange}
              className="border px-2 py-1 rounded"
            />
          </div>
          <div className="flex flex-wrap gap-4">
            <input
              type="date"
              name="dateFrom"
              onChange={handleChange}
              className="border px-2 py-1 rounded"
            />
            <input
              type="date"
              name="dateTo"
              onChange={handleChange}
              className="border px-2 py-1 rounded"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              ค้นหา
            </button>
          </div>
        </form>

        <div className="mt-6 ">
          <table className="w-full table-auto border text-sm text-center">
            <thead>
              <tr className="bg-gray-200 ">
                <th className="border px-2 py-1">ทะเบียนรถ</th>
                <th className="border px-2 py-1">ยี่ห้อรถ</th>
                <th className="border px-2 py-1">รุ่นรถ</th>
                <th className="border px-2 py-1">สีรถ</th>
                <th className="border px-2 py-1">วันที่เข้าจอด</th>
                <th className="border px-2 py-1">วันที่ออก</th>
                <th className="border px-2 py-1">แก้ไข</th>
                <th className="border px-2 py-1">ลบ</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                  <tr key={index}>
                    <td className="border px-2 py-1">{item.license}</td>
                    <td className="border px-2 py-1">{item.brand}</td>
                    <td className="border px-2 py-1">{item.model}</td>
                    <td className="border px-2 py-1">{item.color}</td>
                    <td className="border px-2 py-1">
                      {new Date(item.start).toLocaleDateString("th-TH")}
                    </td>
                    <td className="border px-2 py-1 text">
                      {item.end ? (
                        new Date(item.end).toLocaleDateString("th-TH") // แสดงวันที่หากมีค่า
                      ) : (
                        <span className="text-yellow-600">กำลังจอด</span> // แสดงข้อความ "กำลังจอด" เป็นสีเหลือง
                      )}
                    </td>
                    <td className="border px-2 py-1 text-blue-500 cursor-pointer">
                      ✏️
                    </td>
                    <td
                      className="border px-2 py-1 text-red-500 cursor-pointer"
                      onClick={() => handleDelete(item.id_park)}
                    >
                      🗑️
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-4">
                    ไม่พบข้อมูลที่ตรงกัน
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
