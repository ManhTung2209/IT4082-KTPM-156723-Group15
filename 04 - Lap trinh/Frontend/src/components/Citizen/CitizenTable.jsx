import React from "react";

const statusDisplayMap = {
  sinh_song: "Sinh sống",
  tam_tru: "Tạm trú",
  tam_vang: "Tạm vắng",
  "Sinh sống": "Sinh sống",
  "Tạm trú": "Tạm trú",
  "Tạm vắng": "Tạm vắng",
};

const CitizenTable = ({ citizens, onRowClick }) => (
  <table className="content-table">
    <thead>
      <tr>
        <th>Họ tên</th>
        <th>Giới tính</th>
        <th>Năm sinh</th>
        <th>Quê quán</th>
        <th>Trạng thái</th>
      </tr>
    </thead>
    <tbody>
      {citizens.length === 0 ? (
        <tr>
          <td colSpan={5} style={{ textAlign: "center" }}>Không có cư dân nào</td>
        </tr>
      ) : (
        citizens.map(c => (
          <tr
            key={c.id}
            style={
              statusDisplayMap[c.status] === "Tạm vắng"
                ? { color: "red", cursor: "pointer" }
                : statusDisplayMap[c.status] === "Tạm trú"
                ? { color: "green", cursor: "pointer" }
                : { cursor: "pointer" }
            }
            onClick={() => {
              console.log("Citizen row clicked:", c);
              onRowClick && onRowClick(c);
            }}
          >
            <td>{c.name}</td>
            <td>{c.gender}</td>
            <td>{c.birthYear}</td>
            <td>{c.hometown}</td>
            <td>{statusDisplayMap[c.status] || c.status}</td>
          </tr>
        ))
      )}
    </tbody>
  </table>
);

export default CitizenTable;