import "./HouseholdInfo.css";

const HouseholdInfo = ({ household }) => {
    if (!household) return <div>Không có dữ liệu căn hộ.</div>;

    return (
    <div className="household-info">
      <div><strong>Số hộ khẩu:</strong> {household.id}</div>
      <div><strong>Căn hộ:</strong> {household.household}</div>
      <div><strong>Chủ căn hộ:</strong> {household.owner}</div>
      <div><strong>Thành viên:</strong> {household.person}</div>
      <div><strong>Trạng thái:</strong> {household.status}</div>
      {/* Thêm các trường khác nếu cần */}
    </div>
  );
};

export default HouseholdInfo;