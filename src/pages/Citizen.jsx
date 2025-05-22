import React, { useEffect, useState } from "react";
import "./Page.css";
import LeftBar from "../components/NavBar/LeftBar";
import HeaderBar from "../components/NavBar/HeaderBar";
import CitizenInfoModal from "../components/Citizen/CitizenInfoModal";

// Giả lập dữ liệu cư dân
const mockCitizens = [
  { id: 1, name: "Nguyễn Văn A", household: 502, status: "Sinh sống" },
  { id: 2, name: "Trần Thị B", household: 502, status: "Tạm trú" },
  { id: 3, name: "Lê Văn C", household: 503, status: "Tạm vắng" },
  { id: 4, name: "Phạm Văn D", household: 504, status: "Sinh sống" },
  { id: 5, name: "Hoàng Thị E", household: 506, status: "Tạm trú" },
  { id: 6, name: "Đỗ Văn F", household: 508, status: "Tạm trú" },
  { id: 7, name: "Ngô Thị G", household: 502, status: "Tạm vắng" },
  { id: 8, name: "Bùi Văn H", household: 502, status: "Sinh sống" },
  { id: 9, name: "Lý Thị I", household: 502, status: "Sinh sống" },
  { id: 10, name: "Trịnh Văn K", household: 502, status: "Tạm trú" },
  { id: 11, name: "Phan Thị L", household: 502, status: "Tạm vắng" },
  { id: 12, name: "Vũ Văn M", household: 502, status: "Sinh sống" },
];

const PAGE_SIZE = 8;

const Citizen = () => {
  const [citizens, setCitizens] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // State cho modal
  const [selectedCitizen, setSelectedCitizen] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    setCitizens(mockCitizens);
  }, []);

  const filteredCitizens = citizens.filter(
    c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.status.toLowerCase().includes(search.toLowerCase()) ||
      c.household.toString().includes(search)
  );

  useEffect(() => {
    setPage(1);
  }, [search]);

  const totalPages = Math.ceil(filteredCitizens.length / PAGE_SIZE);
  const pagedCitizens = filteredCitizens.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  // Hàm mở modal khi click vào dòng
  const handleRowClick = (citizen) => {
    setSelectedCitizen(citizen);
    setModalOpen(true);
  };

  return (
    <div>
      <LeftBar activeMenu="citizen" />
      <HeaderBar title="Cư dân" />
      <div className="content-container">
        <h2 className="content-title">Danh sách cư dân</h2>
        <div className="content-search">
          <input
            type="text"
            placeholder="Tìm kiếm tên hoặc địa chỉ..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="content-search-input"
          />
        </div>
        <div className="content">
          <table className="content-table">
            <thead>
              <tr>
                <th>STT</th>
                <th>Họ tên</th>
                <th>Căn hộ</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {pagedCitizens.length === 0 ? (
                <tr>
                  <td colSpan={4} className="content-table-empty">
                    Không có dữ liệu
                  </td>
                </tr>
              ) : (
                pagedCitizens.map((c, idx) => (
                  <tr
                    key={c.id}
                    className="citizen-row"
                    onClick={() => handleRowClick(c)}
                    style={{ cursor: "pointer" }}
                  >
                    <td>{(page - 1) * PAGE_SIZE + idx + 1}</td>
                    <td>{c.name}</td>
                    <td>{c.household}</td>
                    <td>{c.status}</td>
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
      {/* Modal hiển thị thông tin cư dân */}
      <CitizenInfoModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        citizen={selectedCitizen}
      />
    </div>
  );
};

export default Citizen;