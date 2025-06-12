import React from "react";

const ChargeTable = ({ charge, onRowClick }) => (
    <table className="content-table">
        <thead>
        <tr>
            <th>STT</th>
            <th>Mã hộ dân</th>
            <th>Chủ hộ</th>
            <th>Tên khoản thu</th>
            <th>Số tiền</th>
            <th>Ngày nộp</th>
        </tr>
        </thead>
        <tbody>
            {charge.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ textAlign: "center" }}>Không có dữ liệu</td>
            </tr>
          ) : (
            charge.map((r, idx) => (
              <tr 
                key={r.id}
                style={{ cursor: "pointer" }}
                onClick={() =>{
                onRowClick && onRowClick(r);
                }}
              >
                <td>{idx + 1}</td>
                <td>{r.householdNumber}</td>
                <td>{r.owner}</td>
                <td>{r.feeName}</td>
                <td>{Number(r.amount).toLocaleString()} đ</td>
                <td>{r.paidAt}</td>
              </tr>
            ))
          )}
        </tbody>
    </table>
);

export default ChargeTable;