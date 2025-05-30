import React, { useState } from "react";
import Modal from "../Modal/Modal";
import FeeInfo from "./FeeInfo";
import "./FeeInfo.css";

const FeeAddModal = ({ open, onClose, defaultFee }) => {
    // const [errors, setErrors] = useState({});
    const [fee, setFee] = useState({
        code:"",
        name: "",
        type: "",
        amount: defaultFee || "",
        feeDate:"",
        feeEndDate: "",
        description:"Thu theo tháng",
    });

    const handleChange = (e) => {
        setFee({ ...fee, [e.target.name]: e.target.value });
    };

    const handleAdd = async () => {
        if(!fee.code || !fee.name || !fee.type || !fee.amount || !fee.feeDate
        || !fee.feeEndDate){
            alert("Vui lòng nhập đầy đủ thông tin");
            return;
        }
        try{
            const token = localStorage.getItem('token');
            const res = await fetch("http://127.0.0.1:8000/collections/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    code: fee.code,
                    name: fee.name,
                    type: fee.type,
                    amount: fee.amount,
                    feeDate: fee.feeDate || null,
                    feeEndDate: fee.feeEndDate || null,
                    description: fee.description,
                })
            });
            if (res.ok) {
                alert("Đã thêm khoản thu mới!");
                if (typeof onSuccess === "function") onSuccess();
                setFee({
                    code: "",
                    name: "",
                    type: "",
                    amount: "",
                    feeDate:"",
                    feeEndDate: "",
                    description: "",
                });
                onClose();
            } else {
                const data = await res.json();
                alert(data.detail || "Thêm khoản thu thất bại!");
            }
        } catch (errors) {
            alert("ERRORS " + errors.message);
            console.error("Error during registration:", errors);
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <h2>Thêm khoản thu mới</h2>
            <div className="fee-info-edit">
                <div className="info-grid">
                <div>
                    <label>Mã khoản thu: </label>
                    <input name="code" value={fee.code} onChange={handleChange}/>
                </div>
                <div>
                    <label>Tên khoản thu: </label>
                    <input name="name" value={fee.name} onChange={handleChange}/>
                </div>
                <div>
                    <label>Loại khoản thu: </label>
                    <select name="type" value={fee.type} onChange={handleChange}>
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
                    <label>Ngày hết hạn: </label>
                    <input name="feeEndDate" value={fee.feeEndDate} onChange={handleChange}/>
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