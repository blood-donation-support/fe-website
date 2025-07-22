import { FooterComponent, HeaderComponent } from "@/components";
import React from "react";
import { Link } from "react-router-dom";
import backgroundImage from '@/assets/blood-donation(1).jpg'; // Adjust path if necessary

const PolicyPage: React.FC = () => {
  return (
    <>
      <HeaderComponent isHomepage={false} />
      <div
        className="relative w-full min-h-screen bg-cover bg-center bg-no-repeat "
        style={{ backgroundImage: `url('src/assets/blood-donation(1).jpg')` }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>

        <div className="relative z-10 p-8 sm:p-16 md:p-24">
          <h1 className="text-center text-4xl font-bold text-white mb-6">
            Chính Sách Hiến Máu Tình Nguyện
          </h1>

          <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              1. Khám và Tư Vấn Sức Khỏe Miễn Phí
            </h2>
            <p className="text-lg text-gray-600 mb-4">
              Trước khi hiến máu, người tham gia được khám và tư vấn sức khỏe miễn phí. Các xét nghiệm bao gồm nhóm máu, HIV, viêm gan B, viêm gan C, giang mai, sốt rét. Kết quả xét nghiệm được thông báo bảo mật; nếu phát hiện bất thường, người hiến máu sẽ được bác sĩ tư vấn thêm.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              2. Hỗ Trợ Bồi Dưỡng và Chi Phí
            </h2>
            <p className="text-lg text-gray-600 mb-4">
              Phục vụ ăn nhẹ tại chỗ: Mức chi bình quân tối đa là 30.000 đồng/người/lần hiến máu. Hỗ trợ chi phí đi lại: Mức chi bình quân tối đa là 50.000 đồng/người/lần hiến máu. Quà tặng bằng hiện vật hoặc dịch vụ y tế.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              3. Giấy Chứng Nhận Hiến Máu Tình Nguyện
            </h2>
            <p className="text-lg text-gray-600 mb-4">
              Người hiến máu sẽ nhận được Giấy chứng nhận hiến máu tình nguyện. Giấy chứng nhận có giá trị miễn phí truyền máu tại các cơ sở y tế công lập trên toàn quốc. Giấy chứng nhận này cũng có giá trị bồi hoàn máu.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              4. Quyền Lợi Bảo Mật và Tư Vấn
            </h2>
            <p className="text-lg text-gray-600 mb-4">
              Được bảo đảm bí mật về kết quả khám lâm sàng và xét nghiệm. Được tư vấn về các bất thường phát hiện khi khám sức khỏe và hiến máu. Được hướng dẫn cách chăm sóc sức khỏe sau khi hiến máu.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              5. Điều Kiện Tham Gia
            </h2>
            <p className="text-lg text-gray-600 mb-4">
              Đối với nữ: Tuổi từ 18 – 45, cân nặng trên 45 kg. Đối với nam: Tuổi từ 18 – 50, cân nặng trên 50 kg. Đã hiến máu nhân đạo từ 03 lần liên tiếp trở lên và có kết quả xét nghiệm máu tốt.
            </p>

            <div className="flex justify-center mt-8">
              <Link
                to="/donateBlood"
                className="bg-gradient-to-r from-blue-500 to-blue-400 text-white font-bold text-lg py-3 px-8 rounded-full shadow hover:scale-105 transition"
              >
                Đến trang đăng ký hiến máu
              </Link>
            </div>
          </div>
        </div>
      </div>
      <FooterComponent />
    </>
  );
};

export default PolicyPage;
