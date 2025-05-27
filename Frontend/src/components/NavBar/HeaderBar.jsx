import React, { useState, useEffect } from 'react'
import './HeaderBar.css'
import { useNavigate } from 'react-router-dom';
import { FaUserEdit } from "react-icons/fa";
const roleMap = {
    manager: "Tổ trưởng",
    accountant: "Kế toán",
    // ...thêm các role khác nếu cần
};

const HeaderBar = ({ title, onChangeUnitCode }) => {
    const navigate = useNavigate();
    const [showEdit, setShowEdit] = useState(false);
    const [newUnitCode, setNewUnitCode] = useState("");
    const [role, setRole] = useState(""); // Lưu role lấy từ API
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
    const fetchUserInfo = async () => {
        try {
            setLoading(true);
            setError("");
            const token = localStorage.getItem('token');
            const res = await fetch("http://127.0.0.1:8000/users/info/", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                }
            });
            if (res.ok) {
                const data = await res.json();
                setRole(data.role); // data.role phải có trong response của API /users/info/
            } else {
                setError("Không lấy được thông tin người dùng!");
            }
        } catch (err) {
            setError("Lỗi kết nối tới server!");
        } finally {
            setLoading(false);
        }
    };
    fetchUserInfo();
}, []);

    const handleChangePassword = () => {
        navigate('/change-password');
    };

    const handleEditUnitCode = async () => {
    if (newUnitCode.trim() === "") {
        alert("Mã đơn vị không được để trống!");
        return;
    }
    if (window.confirm("Bạn có chắc chắn muốn đổi mã đơn vị cho toàn bộ user trong tổ?")) {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch("http://127.0.0.1:8000/users/change-unit-code/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ new_unit_code: newUnitCode })
            });
            const data = await res.json();
            if (res.ok) {
                alert(data.detail || "Đổi mã đơn vị thành công!");
                onChangeUnitCode && onChangeUnitCode(newUnitCode);
                setShowEdit(false);
                setNewUnitCode("");
            } else {
                alert(data.detail || "Đổi mã đơn vị thất bại!");
            }
        } catch (err) {
            alert("Lỗi kết nối tới server!");
        }
    }
};

    return (
        <div className='headerbar-container'>
            <div className='headerbar-title'>
                <h2>{title}</h2>
            </div>
            <div className='headerbar-action'>
                <span className='headerbar-role'>
                    Vai trò: {loading ? "Đang tải..." : (roleMap[role] || "Chưa xác định")}
                </span>
                {error && <span style={{ color: "red", marginLeft: 12 }}>{error}</span>}
                {role === "manager" && (
                    <>
                        {!showEdit ? (
                            <button className='edit-unit-btn' onClick={() => setShowEdit(true)}>
                                Sửa mã đơn vị
                            </button>
                        ) : (
                        <div className='edit-unit-form'>
                            <input className='edit-unit-input'
                                type="text"
                                placeholder="Nhập mã đơn vị mới"
                                value={newUnitCode}
                                onChange={e => setNewUnitCode(e.target.value)}
                            />
                <button onClick={handleEditUnitCode}>Lưu</button>
                <button onClick={() => setShowEdit(false)}>Hủy</button>
            </div>
        )}
                    </>
                )}
                <button className='changepass-btn' onClick={handleChangePassword}>Đổi mật khẩu</button>
            </div>
        </div>
    )
}

export default HeaderBar;