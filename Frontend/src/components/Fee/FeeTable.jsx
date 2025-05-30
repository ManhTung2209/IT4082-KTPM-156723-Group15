import React from "react";

const FeeTable = ({ fee, onRowClick, onDetailClick }) => (
  <table className="content-table">
    <thead>
      <tr>
        <th>STT</th>
        <th>Tên khoản thu</th>
        <th>Số tiền</th>
        <th>Ghi chú</th>
        <th>Xem</th>
      </tr>
    </thead>
    <tbody>
      {fee.length === 0 ? (
        <tr>
          <td colSpan={5} style={{ textAlign: "center" }}>Không có khoản thu nào</td>
        </tr>
      ) : (
        fee.map((fee, idx) => (
          <tr
            key={fee.idx}
            style={{ cursor: "pointer" }}
            onClick={() => onRowClick && onRowClick(fee)}
          >
            <td>{idx + 1}</td>
            <td>{fee.name}</td>
            <td>{fee.amount.toLocaleString()} </td>
            <td>{fee.description}</td>
            <td>
              <span style={{ color: "#1890ff", cursor: "pointer", textDecoration: "underline" }}
              onClick={e => {
                e.stopPropagation();
                onDetailClick && onDetailClick(fee);
              }}
              >
                Chi tiết
              </span>
            </td>
          </tr>
        ))
      )}
    </tbody>
  </table>
);

export default FeeTable;