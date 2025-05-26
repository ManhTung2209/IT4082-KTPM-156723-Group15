import React from "react";
import "./ChargeInfo.css";

const ChargeInfo = ({charge}) => {
    if(!charge) return <div>Không có dữ liệu phiếu nộp</div>;

    return (
        <div className="charge-info">
            <div className="charge-info-grid">
                <div><strong>Mã phiếu:</strong> {charge.id}</div>
                <div><strong>Mã hộ dân:</strong> {charge.householdNumber}</div>
                <div><strong>Chủ hộ:</strong> {charge.owner}</div>
                <div><strong>Tên khoản thu:</strong> {charge.feeName}</div>
                <div><strong>Loại khoản thu:</strong> {charge.Type}</div>
                <div><strong>Số tiền:</strong> {charge.amount}</div>
                <div><strong>Ngày nộp:</strong> {charge.paidAt}</div>
            </div>
        </div>
    );
};

export default ChargeInfo;