import React, { useState,useEffect } from "react";
import LeftBar from "../components/NavBar/LeftBar";
import HeaderBar from "../components/NavBar/HeaderBar";
import ChargeDetailEditModal from "../components/Charge/ChargeDetailEditModal";
import ChargeTable from "../components/Charge/ChargeTable";
import "./Page.css";

// Giả lập dữ liệu các lần nộp tiền
const mockChargeRecords = [
  {
    id: 1,
    householdNumber: 502,
    owner: "Nguyễn Văn A",
    feeName: "Phí vệ sinh",
    Type: "Bắt buộc",
    amount: 50000,
    paidAt: "2024-05-01",
  },
  {
    id: 2,
    householdNumber: 503,
    owner: "Lê Văn C",
    feeName: "Phí bảo trì",
    Type: "Bắt buộc",
    amount: 100000,
    paidAt: "2024-05-02",
  },
];

const PAGE_SIZE = 10;

const Charge = () => {
  const [charge, setCharge] = useState(mockChargeRecords);
  const [selectedCharge, setSelectedCharge] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
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

  // Hàm mở modal khi click vào dòng
  const handleRowClick = (charge) => {
    setSelectedCharge(charge);
    setModalOpen(true);
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = () => {
    if (!form.householdNumber || !form.owner || !form.feeName || !form.amount || !form.paidAt){
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }
    setCharge([
      ...charge,
      {
        ...form,
        id: charge.length + 1,
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
  
  useEffect(() => {
    setCharge(mockChargeRecords);
  }, []);

  // Lọc theo từ khóa tìm kiếm
  const filteredRecords = charge.filter(r =>
    r.householdNumber.toString().includes(search) ||
    r.owner.toLowerCase().includes(search.toLowerCase()) ||
    r.feeName.toLowerCase().includes(search.toLowerCase()) ||
    r.paidAt && r.paidAt.includes(search)
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
  }, [charge]);

  return (
    <div>
      <LeftBar activeMenu="charge" />
      <HeaderBar title="Thu Phí" />
      <div className="content-container">
        <h2 className="content-title">Quản lý thu phí</h2>
        <div className="content-search">
          <input
            type="text"
            placeholder="Tìm kiếm..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="content-search-input"
          />
        </div>
        <button onClick={() => setShowForm(true)} style={{ marginBottom: 16, background:"#1890ff" }}>
          + Tạo phiếu nộp mới
        </button>
        {showForm && (
          <div style={{ marginBottom: 24, border: "1px solid #ccc", padding: 17 }}>
            <h3>Phiếu nộp phí</h3>
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
          <ChargeTable
            charge={pagedRecords}
            onRowClick={handleRowClick}
            page = {page}
            page_size={PAGE_SIZE}
          />
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
      <ChargeDetailEditModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        charge={selectedCharge}
      />
    </div>
  );
};

export default Charge;