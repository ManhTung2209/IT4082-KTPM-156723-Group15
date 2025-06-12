import React, { useState, useEffect } from "react";
import LeftBar from "../components/NavBar/LeftBar";
import HeaderBar from "../components/NavBar/HeaderBar";
import ChargeDetailEditModal from "../components/Charge/ChargeDetailEditModal";
import ChargeTable from "../components/Charge/ChargeTable";
import "./Page.css";

const PAGE_SIZE = 10;

const Charge = () => {
  const [charge, setCharge] = useState([]);
  const [households, setHouseholds] = useState([]);
  const [collections, setCollections] = useState([]);
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

  const fetchHouseholds = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error("No token found");
      const res = await fetch("http://localhost:8000/HouseHold_Resident/households/", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setHouseholds(data);
        } else {
          console.error("Invalid households response:", data);
          setHouseholds([]);
        }
      } else {
        throw new Error("Failed to fetch households");
      }
    } catch (error) {
      console.error("Error fetching households:", error);
      alert("Lỗi tải danh sách hộ dân: " + error.message);
      setHouseholds([]);
    }
  };

  const fetchCollections = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error("No token found");
      const res = await fetch("http://localhost:8000/collections/all/", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.data)) {
          console.log("Fetched collections:", data.data);
          setCollections(data.data);
        } else {
          console.error("Invalid collections response:", data);
          setCollections([]);
        }
      } else {
        throw new Error("Failed to fetch collections");
      }
    } catch (error) {
      console.error("Error fetching collections:", error);
      alert("Lỗi tải danh sách khoản thu: " + error.message);
      setCollections([]);
    }
  };

  const fetchCharges = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error("No token found");
      const res = await fetch("http://localhost:8000/contributions/list/", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          // Enrich contributions with owner_name, type, and UI-compatible fields
          const enrichedData = data.map(contribution => {
            const household = households.find(h => h.household_id === contribution.household_id);
            const collection = collections.find(c => c.code === contribution.collection_code);
            return {
              id: contribution.id,
              householdNumber: contribution.household,
              owner: household ? household.owner_name : "N/A",
              feeName: contribution.collection_code,
              Type: collection ? collection.type : "N/A",
              amount: contribution.amount,
              paidAt: contribution.payment_date,
              is_reconciled: contribution.is_reconciled,
            };
          });
          setCharge(enrichedData);
        } else {
          console.error("Invalid contributions response:", data);
          setCharge([]);
        }
      } else {
        throw new Error("Failed to fetch contributions");
      }
    } catch (error) {
      console.error("Error fetching charges:", error);
      alert("Lỗi tải danh sách khoản thu: " + error.message);
      setCharge([]);
    }
  };

  //Autofill money (mandatory fee)
  useEffect(() => {
  if (!form.feeName) {
    setForm(f => ({ ...f, amount: "" }));
    return;
  }
  
  const collection = collections.find(c => c.code === form.feeName);
  if (collection && collection.type === "Bắt buộc") {
    setForm(f => ({ ...f, amount: collection.amount.toString() }));
  }
}, [form.feeName, collections]);
  

  useEffect(() => {
    fetchHouseholds();
    fetchCollections();
  }, []);

  useEffect(() => {
    if (households.length > 0 && collections.length > 0) {
      fetchCharges();
    }
  }, [households, collections]);

  useEffect(() => {
  if (!form.householdNumber) {
    setForm(f => ({ ...f, owner: "" }));
    return;
  }
  const household = households.find(
    h => String(h.household_id) === String(form.householdNumber)
  );
  if (household) {
    setForm(f => ({ ...f, owner: household.owner_name }));
  } else {
    setForm(f => ({ ...f, owner: "" }));
  }
  // eslint-disable-next-line
}, [form.householdNumber, households]);

  const handleRowClick = (charge) => {
    setSelectedCharge(charge);
    setModalOpen(true);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = async () => {
    if (!form.householdNumber || !form.owner || !form.feeName || !form.amount || !form.paidAt) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert("Vui lòng đăng nhập lại!");
        return;
      }
      const household = households.find(h => h.household_id === parseInt(form.householdNumber, 10));
      if (!household || household.owner_name !== form.owner) {
        alert("Mã hộ dân hoặc chủ hộ không hợp lệ!");
        return;
      }
      const res = await fetch("http://localhost:8000/contributions/create/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          household: parseInt(form.householdNumber, 10),
          code: form.feeName,
          amount: parseFloat(form.amount),
          payment_date: form.paidAt,
        }),
      });
      if (res.ok) {
        alert("Tạo phiếu nộp phí thành công!");
        setShowForm(false);
        setForm({
          householdNumber: "",
          owner: "",
          feeName: "",
          amount: "",
          paidAt: "",
        });
        fetchCharges();
      } else {
        const data = await res.json();
        alert(data.detail || "Tạo phiếu nộp phí thất bại!");
      }
    } catch (error) {
      alert("Lỗi: " + error.message);
      console.error("Error creating contribution:", error);
    }
  };

  // Filter records with null checks
  const filteredRecords = charge.filter(r => {
    const household = r.householdNumber ? r.householdNumber.toString() : "";
    const owner = r.owner ? r.owner.toLowerCase() : "";
    const feeName = r.feeName ? r.feeName.toLowerCase() : "";
    const paidAt = r.paidAt ? r.paidAt : "";
    const type = r.Type ? r.Type.toLowerCase() : "";
    return (
      household.includes(search) ||
      owner.includes(search.toLowerCase()) ||
      feeName.includes(search.toLowerCase()) ||
      paidAt.includes(search) ||
      type.includes(search.toLowerCase())
    );
  });

  // Calculate total pages
  const totalPages = Math.ceil(filteredRecords.length / PAGE_SIZE);
  // Get current page data
  const pagedRecords = filteredRecords.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  // Reset to page 1 when charge changes
  useEffect(() => {
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
        <button
          onClick={() => setShowForm(true)}
          style={{ marginBottom: 16, background: "#1890ff" }}
        >
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
              readOnly
            />
            <input
              name="feeName"
              placeholder="Tên khoản thu (e.g., KT002)"
              value={form.feeName}
              onChange={handleChange}
            />
            <input
              name="amount"
              placeholder="Số tiền"
              type="number"
              value={form.amount}
              onChange={handleChange}
              readOnly={collections.find(c => c.code === form.feeName)?.type === "Bắt buộc"}
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
            page={page}
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
              disabled={page === totalPages}
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