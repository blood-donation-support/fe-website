import { FooterComponent, HeaderComponent, HeroComponent, SideBySideComponent, TwoCtaComponent } from "@/components";

export default function HomePage() {
	return (
		<>
			<HeaderComponent/>
			<HeroComponent 
				subheadingText= "Một giọt máu cho đi"
				headingText= "một cuộc đời ở lại."
				classHint= "home-page-hero"
			/>
			<TwoCtaComponent/>
			<SideBySideComponent 
				subheadingText = "Hiến máu hôm nay"
				headingText= "Tại sao bạn nên hiến máu?"
				classHint= "side-col-image why-donate-blood"
				paraText= {
				`Hiến máu là một hành động vô tư có sức mạnh cứu sống. Sau đây là một số lý do tại sao bạn nên cân nhắc hiến máu:
				\n― Bạn có thể cứu được tới ba mạng người chỉ bằng một lần hiến máu.
				― Máu luôn cần thiết trong những tình huống khẩn cấp như thiên tai và tai nạn.
				― Máu cần thiết cho những bệnh nhân trải qua phẫu thuật, điều trị ung thư và các thủ thuật y tế khác.
				― Máu không thể sản xuất được, nghĩa là nguồn máu duy nhất là từ sự hiến tặng của những người tình nguyện.
				― Hiến máu cũng có thể mang lại lợi ích cho sức khỏe của người hiến, chẳng hạn như giảm nguy cơ mắc bệnh tim và ung thư.`}
				imageUrl= "../assets/blood-donation(1).jpg"
				buttonText= "Hiến máu ngay"
				buttonLink= "/donateBlood"
				buttonHave= {true}
			/>
			<FooterComponent/>
		</>
	);
}
