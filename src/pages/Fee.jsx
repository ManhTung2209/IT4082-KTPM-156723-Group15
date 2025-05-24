import React, { useEffect, useState } from "react";
import LeftBar from "../components/NavBar/LeftBar";
import HeaderBar from "../components/NavBar/HeaderBar";
import FeeTable from "../components/Fee/FeeTable";
import FeeHouseholdTable from "../components/Fee/FeeHouseholdTable";

// Giả lập dữ liệu khoản thu
const mockFees = [
  {
    id: 1,
    name: "Phí bảo trì",
    amount: 100000,
    time: "2024-01",
    type: "toll"
  },
  {
    id: 2,
    name: "Phí vệ sinh",
    amount: 50000,
    time: "2024-02",
    type: "fee"
  },
];

// Giả lập dữ liệu hộ dân và trạng thái nộp phí
const mockHouseholds = [
  { id: 1, householdNumber: 502, owner: "Nguyễn Văn A", tollPaid: true, feePaid: false },
  { id: 2, householdNumber: 503, owner: "Lê Văn C", tollPaid: false, feePaid: true },
  { id: 3, householdNumber: 504, owner: "Phạm Thị D", tollPaid: false, feePaid: false },
];

const PAGE_SIZE = 8;

const Fee = () => {
  const [fees, setFees] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // State cho khoản thu đang chọn
  const [selectedFee, setSelectedFee] = useState(null);

  useEffect(() => {
    setFees(mockFees);
  }, []);

  const filteredFees = fees.filter(
    f =>
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.type.toLowerCase().includes(search.toLowerCase()) ||
      f.time.includes(search) ||
      f.amount.toString().includes(search)
  );

  useEffect(() => {
    setPage(1);
  }, [search]);

  const totalPages = Math.ceil(filteredFees.length / PAGE_SIZE);
  const pagedFees = filteredFees.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  // Khi click vào khoản thu, chuyển sang bảng hộ dân nộp khoản thu đó
  const handleRowClick = (fee) => {
    setSelectedFee(fee);
  };

  // Lọc danh sách hộ dân theo loại phí
  const getHouseholdsForFee = (fee) => {
    if (!fee) return [];
    // Ví dụ: nếu fee.type === "fee" thì lấy trường feePaid, nếu "toll" thì lấy tollPaid
    return mockHouseholds.map(h => ({
      ...h,
      // Có thể xử lý thêm nếu cần
    }));
  };

  return (
    <div>
      <LeftBar activeMenu="fee" />
      <HeaderBar title="Khoản Thu" />
      <div className="content-container">
        <h2 className="content-title">Danh sách khoản thu</h2>
        <div className="content-search">
          <input
            type="text"
            placeholder="Tìm kiếm"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="content-search-input"
          />
        </div>
        <div className="content">
          {!selectedFee ? (
            <>
              <FeeTable
                fees={pagedFees}
                onRowClick={handleRowClick}
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
            </>
          ) : (
             <>
              <h2 className="content-title">
                Danh sách hộ dân nộp: {selectedFee.name}
              </h2>
              <FeeHouseholdTable
                households={getHouseholdsForFee(selectedFee)}
                type={selectedFee.type}
                onBack={() => setSelectedFee(null)}
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Fee;