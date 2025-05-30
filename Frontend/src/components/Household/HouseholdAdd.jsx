import React, { useState } from "react";

const HouseholdAdd = ({ defaultHousehold }) => {
  const [household, setHousehold] = useState({
    id: "",
    household: "",
    owner: "",
    person: defaultHousehold || "",
    status: "Đang ở",
  });

  const handleChange = (e) => {
    setHousehold({ ...household, [e.target.owner]: e.target.value });
  };

  const handleAdd = () => {
    // Gọi API thêm cư dân ở đây
    alert("Đã thêm cư dân mới!");
  };

  return (
    <div>
      <h2>Thêm cư dân mới</h2>
      <div className="citizen-info-edit">
        <div>
          <label>Họ tên: </label>
          <input name="name" value={citizen.name} onChange={handleChange} />
        </div>
        <div>
          <label>Tuổi: </label>
          <input name="age" value={citizen.age} onChange={handleChange} />
        </div>
        <div>
          <label>Địa chỉ: </label>
          <input name="address" value={citizen.address} onChange={handleChange} />
        </div>
        <div>
          <label>Căn hộ: </label>
          <input name="household" value={citizen.household} onChange={handleChange} />
        </div>
      </div>
      <button style={{ marginTop: 20 }} onClick={handleAdd}>
        Thêm cư dân
      </button>
      <h3 style={{ marginTop: 24 }}>Xem trước thông tin:</h3>
      <CitizenInfo citizen={citizen} />
    </div>
  );
};

export default HouseholdAdd;