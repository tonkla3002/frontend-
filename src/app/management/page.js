"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/navbar";

export default function ParkingManagementPage() {
  const router = useRouter();

  const departments = [
    "สำนักงานเลขานุการ",
    "ภาควิศวกรรมไฟฟ้าและคอมพิวเตอร์",
    "วิศวกรรมเครื่องกล",
    "ภาควิศวกรรมอุตสาหการ",
    "ภาควิศวกรรมโยธา",
    "อื่นๆ",
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

  const [data, setData] = useState([]); // ข้อมูลทั้งหมด
  const [filteredData, setFilteredData] = useState([]); // ข้อมูลที่กรองแล้ว
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" }); // การตั้งค่าการเรียงลำดับ
  const [editingItem, setEditingItem] = useState(null); // เก็บข้อมูลรายการที่กำลังแก้ไข
  const [startDate, setStartDate] = useState(""); // วันที่เริ่มต้น
  const [endDate, setEndDate] = useState(""); // วันที่สิ้นสุด

  const fetchData = () => {
    fetch("http://localhost:8000/data_car")
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
          new Date(item.start_at) >= new Date(filters.dateFrom)) &&
        (!filters.dateTo || new Date(item.end_at) <= new Date(filters.dateTo))
      );
    });

    setFilteredData(filtered);
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    const sortedData = [...filteredData].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === "asc" ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === "asc" ? 1 : -1;
      }
      return 0;
    });

    setFilteredData(sortedData);
    setSortConfig({ key, direction });
  };

  // เพิ่มฟังก์ชันลบข้อมูล
  const handleDelete = async (id) => {
    const confirmDelete = confirm("คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลนี้?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:8000/data_car/${id}`, {
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

  const handleEditClick = (item) => {
    setEditingItem(item); // เปิด Popup พร้อมข้อมูลรายการที่เลือก
    setStartDate(item.startDate || ""); // ตั้งค่าเริ่มต้นของ startDate
    setEndDate(item.endDate || ""); // ตั้งค่าเริ่มต้นของ endDate
  };

  const handleSave = async () => {
    try {
      // ส่งข้อมูลไปยัง Backend
      const res = await fetch(`http://localhost:8000/data_car`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            id: editingItem.id_person, // ส่ง id_person
          startDate: startDate, // ส่ง startDate
          endDate: endDate, // ส่ง endDate
        }),
      });

      if (!res.ok) {
        throw new Error("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
      }

      alert("บันทึกข้อมูลเรียบร้อยแล้ว");
      setEditingItem(null); // ปิด Popup หลังบันทึกสำเร็จ
      console.log(editingItem.id_person, startDate, endDate);
    } catch (error) {
      console.error(error);
      alert("เกิดข้อผิดพลาด: " + error.message);
    }
  };

  const closeModal = () => {
    setEditingItem(null); // ปิด Popup
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
            <div className="flex items-center gap-2">
              <span>วันที่เริ่มต้น:</span>
              <input
                type="date"
                name="dateFrom"
                onChange={handleChange}
                className="border px-2 py-1 rounded"
              />
            </div>
            <div className="flex items-center gap-2">
              <span>วันที่สิ้นสุด:</span>
              <input
                type="date"
                name="dateTo"
                onChange={handleChange}
                className="border px-2 py-1 rounded"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              ค้นหา
            </button>
          </div>
        </form>

        <div className="mt-6">
          <table className="w-full table-auto border text-sm text-center">
            <thead>
              <tr className="bg-gray-200">
                <th
                  className="border px-2 py-1 cursor-pointer"
                  onClick={() => handleSort("firstname")}
                >
                  ชื่อ {sortConfig.key === "firstname" && (sortConfig.direction === "asc" ? "▲" : "▼")}
                </th>
                <th
                  className="border px-2 py-1 cursor-pointer"
                  onClick={() => handleSort("lastname")}
                >
                  นามสกุล {sortConfig.key === "lastname" && (sortConfig.direction === "asc" ? "▲" : "▼")}
                </th>
                <th
                  className="border px-2 py-1 cursor-pointer"
                  onClick={() => handleSort("department")}
                >
                  หน่วยงาน {sortConfig.key === "department" && (sortConfig.direction === "asc" ? "▲" : "▼")}
                </th>
                <th
                  className="border px-2 py-1 cursor-pointer"
                  onClick={() => handleSort("license")}
                >
                  เลขทะเบียน {sortConfig.key === "license" && (sortConfig.direction === "asc" ? "▲" : "▼")}
                </th>
                <th
                  className="border px-2 py-1 cursor-pointer"
                  onClick={() => handleSort("start_at")}
                >
                  วันที่เริ่มจอด {sortConfig.key === "start_at" && (sortConfig.direction === "asc" ? "▲" : "▼")}
                </th>
                <th
                  className="border px-2 py-1 cursor-pointer"
                  onClick={() => handleSort("end_at")}
                >
                  วันที่สิ้นสุด {sortConfig.key === "end_at" && (sortConfig.direction === "asc" ? "▲" : "▼")}
                </th>
                <th className="border px-2 py-1">แก้ไข</th>
                <th className="border px-2 py-1">ลบ</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                  <tr key={index}>
                    <td className="border px-2 py-1">
                      {item.firstname}
                    </td>
                    <td className="border px-2 py-1">
                      {item.lastname}
                    </td>
                    <td className="border px-2 py-1">{item.department}</td>
                    <td className="border px-2 py-1 relative group">
                      {item.license}
                      <div className="absolute left-0 bottom-full mb-1 hidden group-hover:block bg-gray-700 text-white text-xs rounded px-2 py-1">
                        <p>
                          ยี่ห้อรถ: {item.brand}
                        </p>
                        <p>รุ่นรถ: {item.model}</p>
                        <p>สีรถ: {item.color}</p>
                      </div>
                    </td>
                    <td className="border px-2 py-1">
                      {new Date(item.start_at).toLocaleDateString("th-TH")}
                    </td>
                    <td className="border px-2 py-1">
                      {item.end_at
                        ? new Date(item.end_at).toLocaleDateString("th-TH")
                        : "-"}
                    </td>
                    <td className="border px-2 py-1 text-blue-500 cursor-pointer">
                      <span
                        onClick={() => handleEditClick(item)}
                        className="cursor-pointer"
                      >
                        ✏️
                      </span>
                    </td>
                    <td
                      className="border px-2 py-1 text-red-500 cursor-pointer"
                      onClick={() => handleDelete(item.id_person)}
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

        {/* Popup สำหรับแก้ไข */}
        {editingItem && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            {/* Popup */}
            <div className="relative bg-white p-6 rounded-lg shadow-lg w-96">
              {/* ปุ่มปิด */}
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                onClick={closeModal}
              >
                ✖
              </button>

              <h2 className="text-lg font-semibold mb-4">แก้ไขข้อมูล</h2>
              <div className="space-y-2">
                <p>เจ้าของ: {editingItem.name}</p>
                <p>หน่วยงาน: {editingItem.department}</p>
                <p>เลขทะเบียน: {editingItem.license}</p>
                <div>
                  <label className="block text-sm font-medium mb-1">วันที่เริ่มต้น:</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="border px-2 py-1 rounded w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">วันที่สิ้นสุด:</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="border px-2 py-1 rounded w-full"
                  />
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  onClick={handleSave}
                  className="bg-yellow-500 text-white px-4 py-2 rounded"
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
