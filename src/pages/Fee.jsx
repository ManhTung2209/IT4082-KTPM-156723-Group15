import React, { useEffect, useState } from "react";
import LeftBar from "../components/NavBar/LeftBar";
import HeaderBar from "../components/NavBar/HeaderBar";
import "./Fee.css";
import FeeAddModal from "../components/Fee/FeeAddModal";
import FeeDetailEditModal from "../components/Fee/FeeDetailEditModal";
import FeeTable from "../components/Fee/FeeTable";
import FeeHouseholdTable from "../components/Fee/FeeHouseholdTable";

// Giả lập dữ liệu hộ dân và trạng thái nộp phí
const mockHouseholds = [
  { id: 1, householdNumber: 502, owner: "Nguyễn Văn A", tollPaid: true, feePaid: false },
  { id: 2, householdNumber: 503, owner: "Lê Văn C", tollPaid: false, feePaid: true },
  { id: 3, householdNumber: 504, owner: "Phạm Thị D", tollPaid: false, feePaid: false },
];

//Giả lập dữ liệu khoản thu
const mockFee = [
  {
    idFee: 1,
    feeName: "Phí gửi ô tô t5/2025",
    feeType: "Bắt buộc",
    amount: 500000 + " VNĐ",
    feeDate: "15/05/2025",
    feeEndDate: "31/05/2025",
    description: "",
    check: "Chi tiết"
  },
  {
    idFee: 2,
    feeName: "Phí gửi xe máy",
    feeType: "Bắt buộc",
    amount: 100000 + " VNĐ",
    feeDate: "15/05/2025",
    feeEndDate: "31/05/2025",
    description: "Thu theo tháng",
    check: "Chi tiết"
  },
  {
    idFee: 3,
    feeName: "Trung thu",
    feeType: "Tự nguyện",
    amount:  + " VNĐ",
    feeDate: "14/06/2025",
    feeEndDate: "30/06/2025",
    description: "Tùy tâm",
    check: "Chi tiết"
  },
  // ...các phần tử còn lại, bổ sung tương tự...
];

const PAGE_SIZE = 8;

const Fee = () => {
  const [fee, setFee] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedHouseholdFee, setSelectedHouseholdFee] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all"); // "all", "paid", "unpaid"
  //State cho Modal
  const [selectedFee, setSelectedFee] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);

  useEffect(() => {
    setFee(mockFee);
  },[]);

  // const handleAddFee = (newFee) => {
  //   setFee(prev => {
  //   // Lấy số lớn nhất hiện tại
  //     const lastId = prev.length
  //       ? Math.max(...prev.map(f => Number(f.idFee.replace("KT", ""))))
  //       : 0;
  //     const nextId = "KT" + String(lastId + 1).padStart(3, "0");
  //     return [
  //       ...prev,
  //       { ...newFee, idFee: nextId },
  //     ];
  //   });
  // };

  const filteredFee = fee.filter(
    f =>
      f.feeName.toLowerCase().includes(search.toLowerCase()) ||
      f.feeType.toLowerCase().includes(search.toLowerCase()) ||
      f.description.toLowerCase().includes(search.toLowerCase()) ||
      f.amount.toString().includes(search)
  );

  useEffect(() => {
    setPage(1);
  }, [search]);

  const totalPages = Math.ceil(filteredFee.length / PAGE_SIZE);
  const pagedFee = filteredFee.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  // Khi click vào khoản thu, chuyển sang bảng hộ dân nộp khoản thu đó
  const handleRowClick = (fee) => {
    setSelectedHouseholdFee(fee);
    setSelectedFee(null);
  };

  // /*Hàm mở modal khi click vào 1 dòng khoản thu bất kỳ*/
  // const handleRowClick = (fee) => {
  //   setSelectedFee(fee);
  //   setModalOpen(true);
  //   setIsEditMode(true);
  // };

  //Hàm mở modal khi click vào xem chi tiết
  const handleEditFee = (fee) => {
    setSelectedFee(fee);
    setSelectedHouseholdFee(null);
    setModalOpen(true);
    setIsEditMode(true);
  };

  // Lọc danh sách hộ dân theo loại phí
  // const getHouseholdsForFee = (fee) => {
  //   if (!fee) return [];
  //   // Ví dụ: nếu fee.type === "fee" thì lấy trường feePaid, nếu "toll" thì lấy tollPaid
  //   return mockHouseholds.map(h => ({
  //     ...h,
  //     // Có thể xử lý thêm nếu cần
  //   }));
  // };
  const getHouseholdsForFee = (fee) => {
    if (!fee) return [];
    // Ví dụ: nếu fee.type === "fee" thì lấy trường feePaid, nếu "toll" thì lấy tollPaid
    return mockHouseholds.filter(h => {
      if (filterStatus === "paid") return h.feePaid; // Chỉ hiển thị hộ dân đã nộp
      if (filterStatus === "unpaid") return !h.feePaid; // Chỉ hiển thị hộ dân chưa nộp
      return true;
      // Có thể xử lý thêm nếu cần
    });
  };

  return (
    <div>
      <LeftBar activeMenu="fee" />
      <HeaderBar title="Khoản Thu" />
      <div className="content-container">
        <h2 className="content-title">Quản lý khoản thu</h2>
        <div className="content-search">
          <input
            type="text"
            placeholder="Tìm kiếm theo mã hoặc tên khoản thu..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="content-search-input"
          />
        </div>
        <button
          className="add-btn"
          style={{ padding: "8px 16px", background: "#1890ff", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer" }}
          onClick={() => setAddModalOpen(true)}
        > + Thêm khoản thu
        </button>
        <div className="content">
          {!selectedHouseholdFee ? (
            <>
              <FeeTable
                fee={pagedFee}
                onRowClick={handleRowClick}
                onDetailClick={handleEditFee}
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
                Danh sách hộ dân nộp: {selectedHouseholdFee.feeName}
              </h2>
              <div className="filterhousehold-btn">
                <label htmlFor="filter-select" style={{marginRight: "8px"}}>Lọc:</label>
                  <select
                    id = "filter-select"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="filter-select"
                  >
                    <option value="all">Tất cả</option>
                    <option value="paid">Đã nộp</option>
                    <option value="unpaid">Chưa nộp</option>
                  </select>
              </div>
              <FeeHouseholdTable
                households={getHouseholdsForFee(selectedHouseholdFee)}
                type={selectedHouseholdFee.type}
                onBack={() => setSelectedHouseholdFee(null)}
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
      {/*Modal hiển thị thông tin khoản thu */}
      <FeeDetailEditModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        fee={selectedFee}
        editMode={isEditMode}
      />
      {/*Modal thêm khoản thu */}
      <FeeAddModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
      />
    </div>
  );
};

export default Fee;