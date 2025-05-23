import React, { useEffect, useState } from "react";
import "./Page.css";
import LeftBar from "../components/NavBar/LeftBar";
import HeaderBar from "../components/NavBar/HeaderBar";
import CitizenDetailEditModal from "../components/Citizen/CitizenDetailEditModal";
import CitizenAddModal from "../components/Citizen/CitizenAddModal"; // Thêm dòng này

// Giả lập dữ liệu cư dân
const mockCitizens = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    household: 502,
    gender: "Nam",
    birthYear: 1990,
    hometown: "Hà Nội",
    cccd: "012345678901",
    cccdIssueDate: "2015-01-01",
    cccdIssuePlace: "Cục Cảnh sát QLHC",
    status: "Sinh sống"
  },
  {
    id: 2,
    name: "Trần Thị B",
    household: 502,
    gender: "Nữ",
    birthYear: 1992,
    hometown: "Hải Phòng",
    cccd: "012345678902",
    cccdIssueDate: "2016-02-02",
    cccdIssuePlace: "Cục Cảnh sát QLHC",
    status: "Tạm trú"
  },
  {
    id: 3,
    name: "Lê Văn C",
    household: 503,
    gender: "Nam",
    birthYear: 1988,
    hometown: "Nam Định",
    cccd: "012345678903",
    cccdIssueDate: "2017-03-03",
    cccdIssuePlace: "Cục Cảnh sát QLHC",
    status: "Tạm vắng"
  },
  // ...các phần tử còn lại, bổ sung tương tự...
];

const PAGE_SIZE = 8;

const Citizen = () => {
  const [citizens, setCitizens] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // State cho modal
  const [selectedCitizen, setSelectedCitizen] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [addModalOpen, setAddModalOpen] = useState(false);


  useEffect(() => {
    setCitizens(mockCitizens);
  }, []);

  const handleAddCitizen = (newCitizen) => {
    setCitizens(prev => [
      ...prev,
      { ...newCitizen, id: prev.length ? prev[prev.length - 1].id + 1 : 1 },
    ]);
  };

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
<button
            className="add-btn"
            style={{ padding: "8px 16px", background: "#1890ff", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer" }}
            onClick={() => setAddModalOpen(true)}
          >
            + Thêm cư dân
          </button>

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
      <CitizenDetailEditModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        citizen={selectedCitizen}
      />
      <CitizenAddModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        // Gọi hàm thêm cư dân khi submit (nếu bạn muốn truyền callback)
        // onAdd={handleAddCitizen}
      />
    </div>
  );
};

export default Citizen;