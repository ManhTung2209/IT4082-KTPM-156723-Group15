import React from "react";

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
              c.status === "Tạm vắng"
                ? { color: "red", cursor: "pointer" }
                : c.status === "Tạm trú"
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
            <td>{c.status}</td>
          </tr>
        ))
      )}
    </tbody>
  </table>
);

export default CitizenTable;