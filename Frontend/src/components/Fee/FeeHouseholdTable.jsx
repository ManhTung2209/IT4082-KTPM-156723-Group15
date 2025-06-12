import React, {useState} from "react";

const FeeHouseholdTable = ({ households, type = "fee", config, onBack, onDetailClick }) => {
  const columnTitle = "Trạng thái";

  return (
    <div>
      <button onClick={onBack} style={{ marginBottom: 16 }}>Quay lại</button>
      <table className="content-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Mã hộ dân</th>
            <th>Chủ hộ</th>
            <th>{columnTitle}</th>
            <th>Xem</th>
          </tr>
        </thead>
        <tbody>
          {households.length === 0 ? (
            <tr>
              <td colSpan={5} style={{ textAlign: "center" }}>Không có dữ liệu</td>
            </tr>
          ) : (
            households.map((h, idx) => (
              <tr
                key={h.household_id}
                style={{
                  color: h.status === "ĐÃ NỘP" ? "green" : "red",
                  fontWeight: 600,
                  cursor: "default"
                }}
                // onClick={() => onRowClick && onRowClick(h)}
              >
                <td>{idx + 1}</td>
                <td>{h.household_id}</td>
                <td>{h.owner_name}</td>
                <td>{h.status}</td>
                <td>
                  <span style={{ color: "#1890ff", cursor: "pointer", textDecoration: "underline" }}
                    onClick={() => 
                  onDetailClick && onDetailClick(h)
                }
              >
                Thông tin hộ dân
              </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default FeeHouseholdTable;