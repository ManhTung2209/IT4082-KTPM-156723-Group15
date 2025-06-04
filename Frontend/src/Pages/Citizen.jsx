import React, { useEffect, useState } from "react";
import "./Page.css";
import LeftBar from "../components/NavBar/LeftBar";
import HeaderBar from "../components/NavBar/HeaderBar";
import CitizenDetailEditModal from "../components/Citizen/CitizenDetailEditModal";
import CitizenTable from "../components/Citizen/CitizenTable";

const PAGE_SIZE = 8;

const Citizen = () => {
  const [citizens, setCitizens] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // State cho modal
  const [selectedCitizen, setSelectedCitizen] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchCitizens = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:8000/HouseHold_Resident/citizens/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch citizens");
        }

        const data = await response.json();
        console.log(data);
        // Map API data to match the expected table structure
        const mappedCitizens = data.map((citizen) => ({
          id: citizen.citizen_id,
          name: citizen.full_name,
          household: citizen.household,
          gender: citizen.gender === "Male" ? "Nam" : "Nữ",
          birthYear: new Date(citizen.birth_date).getFullYear(),
          hometown: citizen.origin_place,
          cccd: citizen.id_card_number,
          cccdIssueDate: citizen.id_card_issue_date,
          cccdIssuePlace: citizen.id_card_issue_place,
          status: citizen.status === "active" ? "Sinh sống" : citizen.status,
        }));

        setCitizens(mappedCitizens);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCitizens();
  }, []);

  const filteredCitizens = citizens.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.status.toLowerCase().includes(search.toLowerCase()) ||
      c.birthYear.toString().includes(search) ||
      c.household.toString().includes(search) ||
      c.hometown.toLowerCase().includes(search.toLowerCase()) ||
      c.status.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    setPage(1);
  }, [search]);

  const totalPages = Math.ceil(filteredCitizens.length / PAGE_SIZE);
  const pagedCitizens = filteredCitizens.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

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
              <CitizenTable
                citizens={pagedCitizens}
                onRowClick={handleRowClick}
                page={page}
                pageSize={PAGE_SIZE}
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
      <CitizenDetailEditModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        citizen={selectedCitizen}
      />
    </div>
  );
};

export default Citizen;
