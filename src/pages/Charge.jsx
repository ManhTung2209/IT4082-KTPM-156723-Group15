import React, { useState,useEffect } from "react";
import LeftBar from "../components/NavBar/LeftBar";
import HeaderBar from "../components/NavBar/HeaderBar";
import "./Page.css";

// Giả lập dữ liệu các lần nộp tiền
const mockChargeRecords = [
  {
    id: 1,
    householdNumber: 502,
    owner: "Nguyễn Văn A",
    feeName: "Phí vệ sinh",
    amount: 50000,
    paidAt: "2024-05-01",
  },
  {
    id: 2,
    householdNumber: 503,
    owner: "Lê Văn C",
    feeName: "Phí bảo trì",
    amount: 100000,
    paidAt: "2024-05-02",
  },
];

const PAGE_SIZE = 10;

const Charge = () => {
  const [records, setRecords] = useState(mockChargeRecords);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    householdNumber: "",
    owner: "",
    feeName: "",
    amount: "",
    paidAt: "",
  });

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const handleChange = e => {
    if (!form.householdNumber || !form.owner || !form.feeName || !form.amount || !form.paidAt){
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = () => {
    if (!form.householdNumber || !form.owner || !form.feeName || !form.amount || !form.paidAt){
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }
    setRecords([
      ...records,
      {
        ...form,
        id: records.length + 1,
      },
    ]);
    setShowForm(false);
    setForm({
      householdNumber: "",
      owner: "",
      feeName: "",
      amount: "",
      paidAt: "",
    });
  };

  // Lọc theo từ khóa tìm kiếm
  const filteredRecords = records.filter(r =>
    r.householdNumber.toString().includes(search) ||
    r.owner.toLowerCase().includes(search.toLowerCase()) ||
    r.feeName.toLowerCase().includes(search.toLowerCase()) ||
    (r.paidAt && r.paidAt.includes(search))
  );
  
  
  // Tính tổng số trang
const totalPages = Math.ceil(filteredRecords.length / PAGE_SIZE);
  // Lấy dữ liệu trang hiện tại
  const pagedRecords = filteredRecords.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  // Reset về trang 1 khi thêm mới hoặc records thay đổi
  React.useEffect(() => {
    setPage(1);
  }, [records]);

  return (
    <div>
      <LeftBar activeMenu="charge" />
      <HeaderBar title="Thu Phí" />
      <div className="content-container">
        <h2 className="content-title">Thống kê các lần nộp tiền</h2>
        <div className="content-search">
          <input
            type="text"
            placeholder="Tìm kiếm "
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="content-search-input"
          />
        </div>
        <button onClick={() => setShowForm(true)} style={{ marginBottom: 16 }}>
          Ghi nhận lần nộp mới
        </button>
        {showForm && (
          <div style={{ marginBottom: 24, border: "1px solid #ccc", padding: 17 }}>
            <h3>Ghi nhận lần nộp mới</h3>
            <input
              name="householdNumber"
              placeholder="Mã hộ dân"
              value={form.householdNumber}
              onChange={handleChange}
            />
            <input
              name="owner"
              placeholder="Chủ hộ"
              value={form.owner}
              onChange={handleChange}
            />
            <input
              name="feeName"
              placeholder="Tên khoản thu"
              value={form.feeName}
              onChange={handleChange}
            />
            <input
              name="amount"
              placeholder="Số tiền"
              type="number"
              value={form.amount}
              onChange={handleChange}
            />
            <input
              name="paidAt"
              placeholder="Ngày nộp"
              type="date"
              value={form.paidAt}
              onChange={handleChange}
            />
            <button onClick={handleAdd}>Lưu</button>
            <button onClick={() => setShowForm(false)} style={{ marginLeft: 8 }}>
              Hủy
            </button>
          </div>
        )}
        <div className="content">
        <table className="content-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Mã hộ dân</th>
              <th>Chủ hộ</th>
              <th>Tên khoản thu</th>
              <th>Số tiền</th>
              <th>Ngày nộp</th>
            </tr>
          </thead>
          <tbody>
          {pagedRecords.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ textAlign: "center" }}>Không có dữ liệu</td>
            </tr>
          ) : (
            pagedRecords.map((r, idx) => (
              <tr key={r.id}>
                <td>{(page - 1) * PAGE_SIZE + idx + 1}</td>
                <td>{r.householdNumber}</td>
                <td>{r.owner}</td>
                <td>{r.feeName}</td>
                <td>{Number(r.amount).toLocaleString()} đ</td>
                <td>{r.paidAt}</td>
              </tr>
            ))
          )}
        </tbody>
        </table>
        <div className="content-pagination">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="pagination-btn"
        >
          Trang trước
        </button>
        <span className="pagination-info">
          Trang {page} / {totalPages || 1}
        </span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages || totalPages === 0}
          className="pagination-btn"
        >
          Trang sau
        </button>
      </div>
      </div>
      </div>
    </div>
  );
};

export default Charge;