import React from "react";

const FeeTable = ({ fees, onRowClick }) => (
  <table className="content-table">
    <thead>
      <tr>
        <th>STT</th>
        <th>Tên khoản thu</th>
        <th>Số tiền</th>
        <th>Thời gian</th>
      </tr>
    </thead>
    <tbody>
      {fees.length === 0 ? (
        <tr>
          <td colSpan={4} style={{ textAlign: "center" }}>Không có khoản thu nào</td>
        </tr>
      ) : (
        fees.map((fee, idx) => (
          <tr
            key={fee.id}
            style={{ cursor: "pointer" }}
            onClick={() => onRowClick && onRowClick(fee)}
          >
            <td>{idx + 1}</td>
            <td>{fee.name}</td>
            <td>{fee.amount.toLocaleString()} đ</td>
            <td>{fee.time}</td>
          </tr>
        ))
      )}
    </tbody>
  </table>
);

export default FeeTable;