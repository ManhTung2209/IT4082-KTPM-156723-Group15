import React, { useEffect, useState } from "react";
import LeftBar from "../components/NavBar/LeftBar";
import HeaderBar from "../components/NavBar/HeaderBar";
import HouseholdInfoModal from "../components/Household/HouseholdInfoModal"; 
import "./Page.css";

// Giả lập dữ liệu hộ dân
const mockHouseholds = [
  {
    id: 1,
    householdNumber: 502,
    owner: "Nguyễn Văn A",
    address: "Tòa A, phòng 502",
    memberCount: 4,
    status: "Đang ở"
  },
  {
    id: 2,
    householdNumber: 503,
    owner: "Lê Văn C",
    address: "Tòa B, phòng 503",
    memberCount: 3,
    status: "Tạm trú"
  },
  {
    id: 3,
    householdNumber: 504,
    owner: "Phạm Thị D",
    address: "Tòa C, phòng 504",
    memberCount: 2,
    status: "Tạm vắng"
  },
];

const PAGE_SIZE = 8;

const Household = () => {
  const [households, setHouseholds] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedHousehold, setSelectedHousehold] = useState(null);

  useEffect(() => {
    setHouseholds(mockHouseholds);
  }, []);

  const filteredHouseholds = households.filter(
    h =>
      h.owner.toLowerCase().includes(search.toLowerCase()) ||
      h.address.toLowerCase().includes(search.toLowerCase()) ||
      h.householdNumber.toString().includes(search)
  );

  useEffect(() => {
    setPage(1);
  }, [search]);

  const totalPages = Math.ceil(filteredHouseholds.length / PAGE_SIZE);
  const pagedHouseholds = filteredHouseholds.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

   const handleRowClick = (household) => {
    setSelectedHousehold(household);
    setModalOpen(true);
  };

  return (
    <div>
      <LeftBar activeMenu="household" />
      <HeaderBar title="Hộ dân" />
      <div className="content-container">
        <h2 className="content-title">Danh sách hộ dân</h2>
        <div className="content-search">
          <input
            type="text"
            placeholder="Tìm kiếm chủ hộ, địa chỉ hoặc số phòng..."
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
                <th>Số hộ khẩu</th>
                <th>Chủ hộ</th>
                <th>Địa chỉ</th>
                <th>Số thành viên</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {pagedHouseholds.length === 0 ? (
                <tr>
                  <td colSpan={6} className="content-table-empty">
                    Không có dữ liệu
                  </td>
                </tr>
              ) : (
                pagedHouseholds.map((h, idx) => (
                  <tr
                    key={h.id}
                    className="household-row"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleRowClick(h)}
                  >
                    <td>{(page - 1) * PAGE_SIZE + idx + 1}</td>
                    <td>{h.householdNumber}</td>
                    <td>{h.owner}</td>
                    <td>{h.address}</td>
                    <td>{h.memberCount}</td>
                    <td>{h.status}</td>
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
      {/* Hiển thị modal thông tin hộ dân */}
      <HouseholdInfoModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        household={selectedHousehold}
      />
    </div>
  );
};

export default Household;