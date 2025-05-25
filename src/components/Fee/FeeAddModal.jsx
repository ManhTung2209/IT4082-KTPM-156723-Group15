import React, { useState } from "react";
import Modal from "../Modal/Modal";
import FeeInfo from "./FeeInfo";
import "./FeeInfo.css";

const FeeAddModal = ({ open, onClose, defaultFee }) => {
    const [fee, setFee] = useState({
        idFee:"",
        feeName: "",
        feeType: "",
        amount: defaultFee || "",
        feeDate:"",
        feeEndDate: "",
        description:"Thu theo tháng",
    });

    const handleChange = (e) => {
        setFee({ ...fee, [e.target.name]: e.target.value });
    };

    const handleAdd = () => {
        //Gọi API thêm khoản thu ở đây
        alert("Đã thêm khoản thu mới!");
        setFee({
            idFee:"",
            feeName: "",
            feeType: "",
            amount: defaultFee || "",
            feeDate: "",
            description: "",
        });
        onClose();
    };

    return (
        <Modal open={open} onClose={onClose}>
            <h2>Thêm khoản thu mới</h2>
            <div className="fee-info-edit">
                <div className="info-grid">
                <div>
                    <label>Mã khoản thu: </label>
                    <input name="idFee" value={fee.idFee} onChange={handleChange}/>
                </div>
                <div>
                    <label>Tên khoản thu: </label>
                    <input name="feeName" value={fee.feeName} onChange={handleChange}/>
                </div>
                <div>
                    <label>Loại khoản thu: </label>
                    <select name="feeType" value={fee.feeType} onChange={handleChange}>
                        <option value="Bắt buộc">Bắt buộc</option>
                        <option value="Tự nguyện">Tự nguyện</option>
                    </select>
                </div>
                <div>
                    <label>Số tiền: </label>
                    <input name="amount" value={fee.amount} onChange={handleChange}/>
                </div>
                <div>
                    <label>Ngày tạo: </label>
                    <input name="feeDate" value={fee.feeDate} onChange={handleChange}/>
                </div>
                <div>
                    <label>Ghi chú: </label>
                    <input name="description" value={fee.description} onChange={handleChange}/>
                </div>
                </div>
            </div>
            <button className="addfeebtn" style={{ marginTop: 20 }} onClick={handleAdd}>
                Thêm khoản thu
            </button>
            <h3 style={{ marginTop: 24 }}>Xem trước thông tin:</h3>
            <FeeInfo fee={fee} />
        </Modal>
    );
};

export default FeeAddModal;