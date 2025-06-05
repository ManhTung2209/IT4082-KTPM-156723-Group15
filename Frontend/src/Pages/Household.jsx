import React, { useEffect, useState } from "react";
import LeftBar from "../components/NavBar/LeftBar";
import HeaderBar from "../components/NavBar/HeaderBar";
import HouseholdInfoModal from "../components/Household/HouseholdInfoModal";
import "./Page.css";

const PAGE_SIZE = 8;

const Household = () => {
  const [households, setHouseholds] = useState([]);
  const [citizens, setCitizens] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedHousehold, setSelectedHousehold] = useState(null);

  // Fetch households and citizens from API
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");

        // Fetch households
        const resHouseholds = await fetch(
          "http://localhost:8000/HouseHold_Resident/households/",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!resHouseholds.ok) throw new Error("Failed to fetch households");
        const dataHouseholds = await resHouseholds.json();
        console.log(dataHouseholds);
        // Chuẩn hóa dữ liệu households
        const mappedHouseholds = dataHouseholds.map((h) => ({
          id: h.household_id,
          householdNumber: h.household_id,
          owner: h.owner_name,
          status: h.status || "",
          room_number: h.room_number || "",
          block_name: h.block_name || "",
        }));
        setHouseholds(mappedHouseholds);

        // Fetch citizens
        const resCitizens = await fetch(
          "http://localhost:8000/HouseHold_Resident/citizens/",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!resCitizens.ok) throw new Error("Failed to fetch citizens");
        const dataCitizens = await resCitizens.json();
        const mappedCitizens = dataCitizens.map((citizen) => ({
          id: citizen.citizen_id,
          name: citizen.full_name,
          household: citizen.household,
          gender: citizen.gender === "male" ? "Nam" : "Nữ",
          birthYear: new Date(citizen.birth_date).getFullYear(),
          hometown: citizen.origin_place,
          cccd: citizen.id_card_number,
          cccdIssueDate: citizen.id_card_issue_date,
          cccdIssuePlace: citizen.id_card_issue_place,
          status:
            citizen.status === "sinh_song"
              ? "Sinh sống"
              : citizen.status === "tam_tru"
              ? "Tạm trú"
              : citizen.status === "tam_vang"
              ? "Tạm vắng"
              : citizen.status,
        }));
        setCitizens(mappedCitizens);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredHouseholds = households.filter(
    (h) =>
      h.owner.toLowerCase().includes(search.toLowerCase()) ||
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
            placeholder="Tìm kiếm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="content-search-input"
          />
        </div>
        <div className="content">
          {isLoading ? (
            <div>Loading...</div>
          ) : error ? (
            <div>Error: {error}</div>
          ) : (
            <>
              <table className="content-table">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Số phòng</th>
                    <th>Tên tòa</th>
                    <th>Số dân cư đang cư trú</th>
                  </tr>
                </thead>
                <tbody>
                  {pagedHouseholds.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="content-table-empty">
                        Không có dữ liệu
                      </td>
                    </tr>
                  ) : (
                    pagedHouseholds.map((h, idx) => {
                      const livingCount = citizens.filter(
                        (c) =>
                          String(c.household) === String(h.householdNumber) &&
                          (c.status === "Sinh sống" || c.status === "Tạm trú")
                      ).length;

                      return (
                        <tr
                          key={h.id}
                          className="household-row"
                          style={{ cursor: "pointer" }}
                          onClick={() => handleRowClick(h)}
                        >
                          <td>{(page - 1) * PAGE_SIZE + idx + 1}</td>
                          <td>{h.room_number}</td>
                          <td>{h.block_name}</td>
                          <td>{livingCount}</td>
                        </tr>
                      );
                    })
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
            </>
          )}
        </div>
      </div>
      <HouseholdInfoModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        household={selectedHousehold}
      />
    </div>
  );
};

export default Household;
