import React from "react";

const FeeHouseholdTable = ({ households, type = "fee", config, onBack }) => {
  const columnTitle = "Trạng thái";
  const field =
    config?.field ||
    (type === "toll"
      ? "tollPaid"
      : type === "water"
      ? "waterPaid"
      : type === "electric"
      ? "electricPaid"
      : "feePaid");

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
          </tr>
        </thead>
        <tbody>
          {households.length === 0 ? (
            <tr>
              <td colSpan={4} style={{ textAlign: "center" }}>Không có dữ liệu</td>
            </tr>
          ) : (
            households.map((h, idx) => (
              <tr
                key={h.id}
                style={{
                  color: h[field] ? "green" : "red",
                  fontWeight: 600,
                  cursor: "default"
                }}
              >
                <td>{idx + 1}</td>
                <td>{h.householdNumber}</td>
                <td>{h.owner}</td>
                <td>{h[field] ? "Đã nộp" : "Chưa nộp"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default FeeHouseholdTable;