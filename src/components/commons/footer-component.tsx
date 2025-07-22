import { NavLink } from "react-router-dom";

const FooterComponent = () => {
  const exploreLinks = [
    { title: "Trang chủ", link: "/" },
    { title: "Hiến máu", link: "/donateBlood" },
    { title: "Yêu cầu máu", link: "/" },
    { title: "Donate Money", link: "https://www.facebook.com/dustin.tsan.181003" },
    { title: "Trợ giúp", link: "/" }
  ];

  const contactLinks = [
    { title: "(+92) 899353935", link: "tel:+899353935" },
    { title: "help@BloodDonation.com", link: "mailto:help@BloodDonation.com" },
    { title: "Di An,Binh Duong", link: "https://maps.app.goo.gl/oLicVPMzHJ1XvgmS6" },
    { title: "Open 24/7", link: "/support" }
  ];


  return (
    <section className="flex flex-col justify-center items-center w-full mx-auto my-0 px-2.5 pt-[70px] pb-[40px] bg-blue-600 ">
      <div className="relative w-[min(100%_-_15px,1250px)] mx-auto p-2.5">
        <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-10">
          {/* First Column: Logo and Tagline */}
          <div className="footer-col flex flex-col items-start">
            <h2 className="text-4xl font-bold text-white">
              Donation<span className="text-red-500">Blood</span>
            </h2>
            <h3 className="font-normal text-lg text-[#D9D9D9] mt-2">
              Bạn không cần phải là bác sĩ để cứu mạng người: <br /> Chỉ cần hiến máu
            </h3>
          </div>

          {/* Second Column: Explore Links */}
          <div className="footer-col">
            <h3 className="text-2xl font-bold text-white uppercase mb-3">Khám phá</h3>
            <ul className="flex flex-col gap-2">
              {exploreLinks.map((link, index) => (
                <li key={index}>
                  <NavLink
                    className={({ isActive }) =>
                      isActive ? "font-medium text-xl text-gray-400" : "font-medium text-xl text-white"
                    }
                    to={link.link}
                  >
                    {link.title}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Third Column: Contact Links */}
          <div className="footer-col">
            <h3 className="text-2xl font-bold text-white uppercase mb-3">Liên hệ</h3>
            <ul className="flex flex-col gap-2">
              {contactLinks.map((link, index) => (
                <li key={index}>
                  <NavLink
                    className={({ isActive }) =>
                      isActive ? "font-medium text-xl text-gray-400" : "font-medium text-xl text-white"
                    }
                    to={link.link}
                  >
                    {link.title}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Bottom Section */}
        <div className="footer-col text-center mt-10 border-t-[1px] border-off_white/[.2] pt-6">
          <h3 className="text-lg text-[#D9D9D9]">©️ 2025 Donation Blood</h3>
        </div>
      </div>
    </section>
  );
};

export default FooterComponent;
