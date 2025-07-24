import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { HeaderComponent } from "@/components";
import SectionMotionWrapper from "@/components/commons/SectionMotionWrapper";
import FooterSection from "@/components/FooterSection";

const SupportPage: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState<number>(1);
  const [isScrolling, setIsScrolling] = useState<boolean>(false);
  const navigate = useNavigate();

  // Cập nhật currentSlide từ hash trong URL
  useEffect(() => {
    const slideId = window.location.hash;
    if (slideId) {
      const slideNumber = parseInt(slideId.slice(-1)); // Lấy số sau hash (ví dụ: slide-1 -> 1)
      setCurrentSlide(slideNumber);  // Cập nhật slide
      const slideElement = document.getElementById(slideId.slice(1));
      if (slideElement) {
        slideElement.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, []);

  // Xử lý sự kiện cuộn chuột (wheel)
  const handleWheel = (e: WheelEvent) => {
    if (isScrolling) return; // Tránh cuộn liên tục

    setIsScrolling(true);

    if (e.deltaY > 0) {
      // Nếu cuộn xuống, chuyển đến slide tiếp theo
      if (currentSlide < 5) {
        setCurrentSlide((prevSlide) => prevSlide + 1);
      }
    } else {
      // Nếu cuộn lên, chuyển về slide trước
      if (currentSlide > 1) {
        setCurrentSlide((prevSlide) => prevSlide - 1);
      }
    }

    setTimeout(() => {
      setIsScrolling(false);
    }, 800); // Thời gian chờ giữa các lần cuộn
  };

  // Điều hướng đến slide khi thay đổi currentSlide
  useEffect(() => {
    const slideElement = document.getElementById(`slide-${currentSlide}`);
    if (slideElement) {
      slideElement.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentSlide]);

  // Thay đổi slide khi bấm vào liên kết
  const handleLinkClick = (slideNumber: number) => {
    // Điều hướng đến trang mới với hash tương ứng và cuộn đến phần tử
    navigate(`/support#slide-${slideNumber}`);  // Điều hướng tới trang Support và hash tương ứng
    setCurrentSlide(slideNumber);  // Cập nhật slide
  };

  useEffect(() => {
    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, [currentSlide]);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Container for all slides */}
      <div className="h-screen overflow-y-auto scroll-smooth snap-y snap-mandatory">
        {/* Slide 1 */}
        <HeaderComponent isHomepage={false} />
        <SectionMotionWrapper className="w-full h-screen flex flex-col items-center justify-center bg-blue-50 snap-start">
                    {(inView) => (
          <>
        <section
            id="slide-1"
            className="w-full h-screen snap-start flex items-center justify-center bg-blue-50"
        >
            {/* Phần trái: Nội dung */}
            <motion.div
                initial={{ opacity: 0, x: -60 }}
                animate={{ opacity: inView ? 1 : 0, x: 0 }}
                transition={{ duration: 0.8 }}
                className="w-2/5 flex flex-col justify-center pl-16 pr-6 text-center"
            >
                <h1 className="text-[2rem] font-bold text-gray-800 mb-6 mt-[8rem] text-left">
                Đăng ký thông tin để hiến máu
                </h1>
                <p className="text-[1.125rem] text-gray-600 mb-4 text-left">
                Trước khi tham gia vào <span className="text-blue-600 font-bold">hoạt động hiến máu</span>, bạn cần điền đầy đủ thông tin cá nhân và lịch trình hiến máu.
                Đây là bước quan trọng giúp chúng tôi sắp xếp và điều phối hoạt động hiến máu một cách hiệu quả.
                </p>
                <p className="text-[1.125rem] text-gray-600 text-left">
                Các thông tin cần điền:
                </p>
                <ul className="text-left text-[1.125rem] text-gray-600 mb-4">
                <li>• <span className="text-blue-600 font-bold">Nhóm máu của bạn</span> : Chọn nhóm máu của bạn từ danh sách để chúng tôi có thể xác định chính xác nhu cầu hiến máu.</li>
                <li>• <span className="text-blue-600 font-bold">Loại hiến máu bạn muốn tham gia</span> : Chọn loại hiến máu mà bạn muốn tham gia.</li>
                <li>• <span className="text-blue-600 font-bold">Ngày hiến máu</span> : Chọn ngày mà bạn muốn tham gia hiến máu.</li>
                </ul>
                <p className="text-[1.125rem] text-gray-600 text-left">
                    Sau khi hoàn thành các thông tin trên, bạn chỉ cần nhấn vào nút "<span className="text-blue-600 font-bold">Lên lịch đăng ký</span>" để xác nhận lịch hiến máu của bạn.

                </p>
                <p className="text-[1.125rem] text-gray-600 mb-4 text-left">
                    Cảm ơn bạn đã đồng hành cùng chúng tôi trong việc cứu giúp những cuộc đời cần máu!
                </p>
                <button className="w-fit px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-400 rounded-full text-white font-bold text-lg shadow hover:scale-105 transition mb-8">
                <Link to="/donateBlood">Đến trang đăng kí hiến máu</Link>
                </button>
                
            </motion.div>

            {/* Phần phải: Hình ảnh */}
            <motion.div
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: inView ? 1 : 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="w-3/5 flex flex-col justify-center items-center bg-blue-600/90 rounded-l-[56px] h-full"
            >
                <img
                src="/src/assets/regisdonate.png"
                alt="Hiến máu"
                className="w-5/6 h-3/5 object-cover rounded-lg"
                />
                <div className="mt-8 text-white text-center">
                <h2 className="text-3xl font-bold mb-2">Màn hình đăng kí hiến máu</h2>
                </div>
            </motion.div>
            </section>
          </>
        )}
        </SectionMotionWrapper>

        {/* Slide 2 */}
        <SectionMotionWrapper className="w-full h-screen flex flex-col items-center justify-center bg-blue-50 snap-start">
                    {(inView) => (
          <>
        <section id="slide-2" className="w-full h-screen snap-start flex items-center justify-center ">
        {/* Phần trái: Hình ảnh */}
        <motion.div
        initial={{ opacity: 0, x: -220 }}
        animate={{ opacity: inView ? 1 : 0, x: inView ? 0 : -100 }} // Kích hoạt animation khi in view
        transition={{ duration: 1, delay: 0.2, ease: "easeInOut" }} // Delay và easing để mượt mà hơn
        className="w-[45%] flex flex-col justify-center items-center bg-blue-600/90 rounded-r-[56px] h-full pt-[10%]"
      >
            <img
            src="https://careplusvn.com/files/kham-suc-khoe-dinh-ky-o-dau-tot-5.jpg"
            alt="Kiểm tra sức khỏe"
            className="w-[90%] h-3/5 object-cover rounded-lg"
            />
            <div className="mt-8 text-white text-center">
            <h2 className="text-3xl font-bold mb-2">Kiểm tra trực tiếp tại cơ sở  <br />Nhà văn hóa sinh viên</h2>
            </div>
        </motion.div>

        {/* Phần phải: Nội dung */}
        <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: inView ? 0 : 100 }}
            transition={{ duration: 0.8 , delay: 0.2 , ease: "easeInOut" }}
            className="w-[55%] flex flex-col justify-center pl-16 pr-6 text-center"
        >
            <h1 className="text-[2rem] font-bold text-gray-800 mb-6 mt-[8rem] text-left">
            Kiểm tra sức khỏe tại cơ sở của chúng tôi
            </h1>
            <p className="text-[1.125rem] text-gray-600 mb-4 text-left">
            Sau khi <span className="text-blue-600 font-bold">hoàn tất đăng ký hiến máu</span>, bạn sẽ được hướng dẫn thực hiện các bước kiểm tra sức khỏe tại cơ sở hiến máu. 
            Đây là bước quan trọng giúp đảm bảo bạn đủ điều kiện tham gia hiến máu và bảo vệ sức khỏe cho chính bạn.
            </p>
            <p className="text-[1.125rem] text-gray-600 text-left">
            Quy trình kiểm tra sức khỏe bao gồm:
            </p>
            <ul className="text-left text-[1.125rem] text-gray-600 mb-4">
            <li>• <span className="text-blue-600 font-bold">Khám tổng quát</span>: Các bác sĩ sẽ kiểm tra tổng thể sức khỏe của bạn, bao gồm huyết áp, nhịp tim, và các chỉ số cơ bản khác.</li>
            <li>• <span className="text-blue-600 font-bold">Kiểm tra nhóm máu và các xét nghiệm cần thiết</span>: Để xác định nhóm máu và kiểm tra các chỉ số quan trọng như mức độ hemoglobin trong máu, giúp đánh giá sức khỏe tổng quát của bạn.</li>
            <li>• <span className="text-blue-600 font-bold">Hỏi về tiền sử bệnh lý</span>: Bạn sẽ được yêu cầu khai báo về các bệnh lý hoặc tình trạng sức khỏe có thể ảnh hưởng đến việc hiến máu.</li>
            </ul>
            <p className="text-[1.125rem] text-gray-600 text-left mb-2">
            Sau khi hoàn thành các kiểm tra, các bác sĩ sẽ thông báo kết quả và xác nhận bạn có <span className="text-blue-600 font-bold">đủ điều kiện</span> để hiến máu hay không.
            </p>
            <p className="text-[0.9rem] text-gray-600 mb-4 text-left">
            <span className="text-red-600 font-bold">Lưu ý:</span> *Nếu có bất kỳ dấu hiệu bất thường nào, bạn có thể yêu cầu tham khảo thêm bác sĩ hoặc hoãn hiến máu để đảm bảo an toàn cho sức khỏe của bạn.*
            </p>
            <button className="w-fit px-8 py-3 bg-gradient-to-r bg-blue-600/90 to-blue-400 rounded-full text-white font-bold text-lg shadow hover:scale-105 transition mb-8">
            <Link to="/donateBlood">Hiến máu</Link>
            </button>
        </motion.div>
        </section>
 </>
        )}
        </SectionMotionWrapper>
        {/* Slide 3 */}
        <SectionMotionWrapper className="w-full h-screen flex flex-col items-center justify-center bg-blue-50 snap-start">
                    {(inView) => (
          <>
        <section id="slide-3" className="w-full h-screen snap-start flex items-center justify-center bg-blue-50">
            {/* Phần trái: Nội dung */}
            <motion.div
                initial={{ opacity: 0, x: -60 }}
                animate={{ opacity: 1, x: inView ? 0 : -60 }}
                transition={{ duration: 0.8 }}
                className="w-2/5 flex flex-col justify-center pl-16 pr-6 text-center"
            >
                <h1 className="text-[2rem] font-bold text-gray-800 mb-4 mt-[8rem] text-left">
                Đăng ký thông tin nhận máu
                </h1>
                <p className="text-[1.125rem] text-gray-600 mb-2 text-left">
                Trước khi nhận máu, bạn cần điền đầy đủ thông tin và yêu cầu nhận máu. 
                Đây là bước quan trọng giúp chúng tôi đảm bảo việc cung cấp máu đúng mục đích và phù hợp với nhu cầu của bạn.
                </p>
                <p className="text-[1.125rem] text-gray-600 text-left">
                Các thông tin cần điền:
                </p>
                <ul className="text-left text-[1.125rem] text-gray-600 mb-2">
                <li>• <span className="text-blue-600 font-bold">Nhóm máu của bạn</span> : Chọn nhóm máu của bạn từ danh sách để chúng tôi có thể xác định chính xác nhu cầu nhận máu.</li>
                <li>• <span className="text-blue-600 font-bold">Lý do cần nhận máu</span> : Mô tả lý do bạn cần nhận máu, ví dụ như điều trị bệnh lý, phẫu thuật, hoặc các tình huống khẩn cấp.</li>
                <li>• <span className="text-blue-600 font-bold">Số lượng máu yêu cầu</span> : Cung cấp số lượng máu bạn cần nhận, bao gồm các đơn vị máu hoặc tiểu cầu.</li>
                <li>• <span className="text-blue-600 font-bold">Ngày nhận máu</span> : Chọn ngày bạn cần nhận máu để chúng tôi có thể sắp xếp lịch với nguồn cung ứng.</li>
                </ul>
                <p className="text-[1.125rem] text-gray-600 text-left">
                Sau khi hoàn thành các thông tin trên, bạn chỉ cần nhấn vào nút "<span className="text-blue-600 font-bold">Lên lịch nhận máu</span>" để xác nhận lịch nhận máu của bạn.
                </p>
                <p className="text-[1.125rem] text-gray-600 mb-2 text-left">
                Cảm ơn bạn đã tin tưởng và hợp tác với chúng tôi để đảm bảo sức khỏe cộng đồng!
                </p>
                <button className="w-fit px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-400 rounded-full text-white font-bold text-lg shadow hover:scale-105 transition mb-8">
                <Link to="/donateBlood">Đến trang đăng kí nhận máu</Link>
                </button>
            </motion.div>
 
            {/* Phần phải: Hình ảnh */}
            <motion.div
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="w-3/5 flex flex-col justify-center items-center bg-blue-600/90 rounded-l-[56px] h-full"
            >
                <img
                src="/src/assets/regisdonate.png"
                alt="Nhận máu"
                className="w-5/6 h-3/5 object-cover rounded-lg"
                />
                <div className="mt-8 text-white text-center">
                <h2 className="text-3xl font-bold mb-2">Màn hình đăng kí nhận máu</h2>
                </div>
            </motion.div>
        </section>

</>
        )}
        </SectionMotionWrapper>
        {/* Slide 4 */}
        <SectionMotionWrapper className="w-full h-screen flex flex-col items-center justify-center snap-start">
        {(inView) => (
        <section id="slide-4" className="w-full h-screen snap-start flex items-center justify-center ">
            {/* Phần trái: Hình ảnh */}
            <motion.div
                initial={{ opacity: 0, x: -60 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="w-[60%] flex flex-col justify-center items-center bg-blue-600 rounded-r-[56px] h-full pt-8"
            >
                <img
                src="https://tambinh.vn/wp-content/uploads/2018/11/119733786_1815937145225492_6742848521244581519_o.jpg"
                alt="Hiến máu"
                className="w-5/6 h-3/5 object-cover rounded-lg"
                />
                <div className="mt-8 text-white text-center">
                <h2 className="text-3xl font-bold mb-2">Hiến máu tại cơ sở</h2>
                </div>
            </motion.div>

            {/* Phần phải: Nội dung */}
            <motion.div
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: inView ? 0 : 100 }}
                transition={{ duration: 0.8 , delay: 0.2 , ease: "easeInOut" }}
                className="w-[40%] flex flex-col justify-center pl-16 pr-6 text-center bg-white"
            >
                <h1 className="text-[2rem] font-bold text-gray-800 mb-4  text-left">
                Hiến máu
                </h1>
                <p className="text-[1.125rem] text-gray-800 mb-4 text-left">
                Khi bạn đã hoàn tất <span className="font-semibold text-blue-600">đăng ký hiến máu</span>, việc tiếp theo là tham gia vào buổi hiến máu tại địa điểm đã đăng ký.
                </p>
                <p className="text-[1.125rem] text-gray-600 mb-4 text-left">
                <span className="font-semibold text-blue-600">Địa điểm thực hiện:</span> Buổi hiến máu sẽ được tổ chức tại <span className="font-semibold text-blue-600">Nhà văn hóa sinh viên, Đồng Hòa, Dĩ An, Bình Dương</span>.
                </p>
                <p className="text-[1.125rem] text-gray-600 text-left">
                <span className="font-semibold text-blue-600">Thời gian hiến máu:</span> Buổi hiến máu sẽ diễn ra vào thời gian đã được lên lịch khi bạn hoàn tất quá trình đăng ký. Hệ thống sẽ gửi cho bạn thông tin chi tiết về ngày và giờ hiến máu để bạn có thể sắp xếp tham gia.
                </p>
                <p className="text-[1.125rem] text-gray-600 text-left">
                <span className="font-semibold text-blue-600">Hướng dẫn hiến máu:</span> Hệ thống cũng sẽ cung cấp hướng dẫn cụ thể về các bước cần thực hiện khi tham gia buổi hiến máu, giúp bạn chuẩn bị tốt nhất cho quá trình hiến máu.
                </p>
                <p className="text-[1.125rem] text-gray-600 mb-4 text-left">
                Cảm ơn bạn đã tham gia và đóng góp cho cộng đồng!
                </p>
                <button className="w-fit px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-400 rounded-full text-white font-bold text-lg shadow hover:scale-105 transition mb-8">
                <Link to="/donateBlood">Hiến máu</Link>
                </button>
            </motion.div>
        </section>
        )}
        </SectionMotionWrapper>

        {/* Slide 5 */}
        <SectionMotionWrapper className="w-full h-screen flex flex-col items-center justify-center  snap-start">
        {(inView) => (
        <section id="slide-5" className="w-full h-screen snap-start flex items-center justify-center ">
            {/* Phần trái: Nội dung */}
            <motion.div
                initial={{ opacity: 0, x: -60 }}
                animate={{ opacity: 1, x: inView ? 0 : -60 }}
                transition={{ duration: 0.8 }}
                className="w-[60%] flex flex-col justify-center pl-16 pr-6 text-center bg-white"
            >
                <h1 className="text-[2rem] font-bold text-gray-800 mb-4 mt-[8rem] text-left">
                Nhận máu
                </h1>
                <p className="text-[1.125rem] text-gray-800 mb-4 text-left">
                Khi bạn cần <span className="font-semibold text-blue-600">nhận máu</span>, hệ thống của chúng tôi sẽ giúp bạn <span className="font-semibold text-blue-600">đăng ký và đảm bảo</span> rằng bạn nhận được lượng máu cần thiết cho việc điều trị của mình. Quá trình nhận máu bao gồm các bước sau:
                </p>
                <p className="text-[1.125rem] text-gray-600 text-left">
                <span className="font-semibold text-blue-600">Địa điểm nhận máu:</span> Bạn sẽ nhận máu tại các cơ sở y tế, bệnh viện hoặc trung tâm nhận máu được chỉ định trong hệ thống. Thông tin chi tiết về địa điểm sẽ được gửi cho bạn sau khi xác nhận đăng ký.
                </p>
                <p className="text-[1.125rem] text-gray-600 text-left">
                <span className="font-semibold text-blue-600">Thời gian nhận máu:</span> Buổi nhận máu sẽ diễn ra vào thời gian đã được lên lịch trong quá trình đăng ký. Hệ thống sẽ gửi thông tin về thời gian và địa điểm nhận máu để bạn có thể sắp xếp tham gia.
                </p>
                <p className="text-[1.125rem] text-gray-600 text-left">
                <span className="font-semibold text-blue-600">Quy trình nhận máu:</span> Kỹ thuật viên và nhân viên y tế sẽ thực hiện việc truyền máu cho bạn. Hệ thống theo dõi sức khỏe và tình trạng của bạn trong suốt quá trình để đảm bảo mọi thứ diễn ra an toàn.
                </p>
                <p className="text-[1.125rem] text-gray-600 text-left">
                <span className="font-semibold text-blue-600">Hướng dẫn và chăm sóc sau khi nhận máu:</span> Sau khi nhận máu, bạn sẽ được theo dõi trong một khoảng thời gian để đảm bảo sức khỏe không có tác dụng phụ. Hệ thống y tế sẽ cung cấp hướng dẫn về cách chăm sóc bản thân sau khi nhận máu và các lưu ý cần thiết.
                </p>
                <p className="text-[1.125rem] text-gray-600 mb-4 text-left">
                "Cảm ơn bạn đã tin tưởng và hợp tác với chúng tôi để đảm bảo sức khỏe cộng đồng!"
                </p>
                <button className="w-fit px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-400 rounded-full text-white font-bold text-lg shadow hover:scale-105 transition mb-8">
                <Link to="/donateBlood">Đến trang đăng kí nhận máu</Link>
                </button>
            </motion.div>

            {/* Phần phải: Hình ảnh */}
            <motion.div
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="w-[40%] flex flex-col justify-center items-center bg-blue-600/90 rounded-l-[56px] h-full pt-[5rem]"
            >
                <img
                src="https://medlatec.vn/media/32029/file/chi-dinh-truyen-mau-trong-nhung-truong-hop-nao-1.jpg"  // Thay thế đường dẫn này bằng URL đúng của ảnh bạn muốn hiển thị
                alt="Nhận máu"
                className="w-5/6 h-3/5 object-cover rounded-sm"
                />
                <div className="mt-8 text-white text-center">
                <h2 className="text-3xl font-bold mb-2">Nhận máu tại cơ sở</h2>
                </div>
            </motion.div>
        </section>
        )}
        </SectionMotionWrapper>
        <FooterSection />
      </div>
    </div>
  );
};

export default SupportPage;
