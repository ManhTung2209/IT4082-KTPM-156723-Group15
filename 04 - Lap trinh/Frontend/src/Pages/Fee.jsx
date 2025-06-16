import React, { useEffect, useState } from "react";
import LeftBar from "../components/NavBar/LeftBar";
import HeaderBar from "../components/NavBar/HeaderBar";
import "./Fee.css";
import FeeAddModal from "../components/Fee/FeeAddModal";
import FeeDetailEditModal from "../components/Fee/FeeDetailEditModal";
import FeeTable from "../components/Fee/FeeTable";
import FeeHouseholdTable from "../components/Fee/FeeHouseholdTable";
import HouseholdInfoModal from   "../components/Household/HouseholdInfoModal";

const PAGE_SIZE = 8;

const Fee = () => {
  const isAccountant = localStorage.getItem("role") === "accountant";
  const [fee, setFee] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [modalHousehold, setModalHousehold] = useState(null);
  const [selectedHousehold, setSelectedHousehold] = useState(null);
  const [selectedHouseholdFee, setSelectedHouseholdFee] = useState(null);
  const [householdForFee, setHouseholdForFee] = useState([]);
  const [loadingHouseholds, setLoadingHouseholds] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all"); // "all", "paid", "unpaid"
  //State cho Modal

  const [selectedFee, setSelectedFee] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);

  const fetchFees = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch("http://127.0.0.1:8000/collections/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data =await res.json();
        setFee(data);
      } else {
        setFee([]);
      }
    } catch (errors) {
      setFee([]);
    }
  };

  useEffect(() => {
    fetchFees();
  },[]);

  const filteredFee = fee.filter(
    f =>
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.type.toLowerCase().includes(search.toLowerCase()) ||
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

  const fetchHouseholds = async (feeCode) => {
    setLoadingHouseholds(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:8000/contributions/status-check/?code=${feeCode}`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      if (res.ok) {
        let data = await res.json();
        if (filterStatus === "paid") {
          data = data.filter(h => h.status === 'ĐÃ NỘP');
        } else if (filterStatus === "unpaid") {
          data = data.filter(h => h.status === 'CHƯA NỘP');
        }
        setHouseholdForFee(data);
      } else {
        setHouseholdForFee([]);
      }
    } catch (error) {
      console.error("Error fetching households:", error);
      setHouseholdForFee([]);
    }
    setLoadingHouseholds(false);
  };

  const handleRowClick = async (fee) => {
    setSelectedHouseholdFee(fee);
    setSelectedFee(null);
    await fetchHouseholds(fee.code);
  };

  //Theo dõi thay đổi của filterStatus
  useEffect(() => {
    if (selectedHouseholdFee) {
      fetchHouseholds(selectedHouseholdFee.code);
    }
  }, [filterStatus]);

  //Hàm mở modal khi click vào xem chi tiết
  const handleEditFee = (fee) => {
    setSelectedFee(fee);
    setSelectedHouseholdFee(null);
    setModalOpen(true);
    setIsEditMode(true);
  };

  const handleClickHousehold = (household) => {
    setModalHousehold(true);
    setSelectedHousehold(household);
  }

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
            placeholder="Tìm kiếm..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="content-search-input"
          />
        </div>
        { isAccountant && (
          <button
          className="add-btn"
          style={{ padding: "8px 16px", background: "#1890ff", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer" }}
          onClick={() => setAddModalOpen(true)}
        > + Thêm khoản thu
        </button>
        )}
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
              {selectedHouseholdFee && selectedHouseholdFee.type === "Bắt buộc" && (
              <div className="filterhousehold-btn">
                <label htmlFor="filter-select" style={{marginRight: "8px"}}>Lọc:</label>
                <select
                  id="filter-select"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">Tất cả</option>
                  <option value="paid">Đã nộp</option>
                  <option value="unpaid">Chưa nộp</option>
                </select>
              </div>
              )}
              <FeeHouseholdTable
                households={householdForFee}
                type={selectedHouseholdFee.status}
                onBack={() => setSelectedHouseholdFee(null)}
                onDetailClick={handleClickHousehold}
              />
              {loadingHouseholds}
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
        onSuccess = {fetchFees}
      />
      <HouseholdInfoModal
        open={modalHousehold}
        onClose={() => setModalHousehold(null)}
        household={selectedHousehold}
      />
    </div>
  );
};

export default Fee;