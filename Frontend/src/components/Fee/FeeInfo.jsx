import React from "react";
import "./FeeInfo.css";

const FeeInfo = ({fee}) => {
    if(!fee) return <div>Không có dữ liệu khoản thu</div>;

    return (
        <div className="fee-info">
            <div className="fee-info-grid">
                <div><strong>Mã khoản thu:</strong> {fee.idFee}</div>
                <div><strong>Tên khoản thu:</strong> {fee.feeName}</div>
                <div><strong>Loại khoản thu:</strong> {fee.feeType}</div>
                <div><strong>Số tiền:</strong> {fee.amount}</div>
                <div><strong>Ngày tạo:</strong> {fee.feeDate}</div>
                <div><strong>Ngày hết hạn:</strong> {fee.feeEndDate}</div>
                <div><strong>Ghi chú:</strong> {fee.description}</div>
            </div>
        </div>
    )
}

export default FeeInfo;