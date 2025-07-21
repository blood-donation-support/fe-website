import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import DonationQuestionsEditor from "@/components/DonationQuestionsEditor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	fetchDonationRegistrationById,
	fetchDonationRegistrations,
} from "@/api/donationRegistrationService";
import type { DonationRegistration } from "@/types/donation";
import { fetchBloodGroups } from "@/api/bloodService";
import bloodComponentVN from "@/utils/translateBloodComponentVN";

interface FormRegistration {
	id: string;
	fullName: string;
	birthDate: string;
	gender: "Nam" | "Nữ" | "Khác";
	nationalId: string;
	address: string;
	phone: string;
	email?: string;
	weight: number;
	height?: number;
	bloodGroup: "A" | "B" | "AB" | "O";
	lastDonationDate?: string;
	diseaseHistory: string[];
	isPregnant?: boolean;
	hasTattoo?: boolean;
	usesMedication?: boolean;
	alcoholSmoking?: boolean;
	acuteIllness?: boolean;
	willing: boolean;
	registrationDate: string;
	status: "pending" | "approved" | "rejected";
}

const initialQuestions = [
	"Họ và tên",
	"Ngày sinh",
	"Giới tính",
	"Số CMND/CCCD",
	"Địa chỉ liên hệ",
	"Số điện thoại",
	"Email",
	"Chiều cao (cm)",
	"Cân nặng (kg)",
	"Bạn có đang mang thai hoặc cho con bú không?",
	"Bạn có xăm mình trong vòng 6 tháng qua không?",
	"Bạn đang sử dụng thuốc điều trị không?",
	"Bạn có hút thuốc hoặc uống rượu thường xuyên không?",
	"Bạn có đang bị bệnh cấp tính như sốt, ho, cảm cúm không?",
];

interface BloodAcceptance {
	[key: string]: boolean;
}

export default function DonationRegistrationsPage() {
	const [activeTab, setActiveTab] = useState("questions");
	const [registrations, setRegistrations] = useState<DonationRegistration[]>(
		[],
	);
	const [selected, setSelected] = useState<DonationRegistration | null>(null);
	const [questions, setQuestions] = useState<string[]>(initialQuestions);
	const [groupNames, setGroupNames] = useState<Record<string, string>>({});

	const [adding, setAdding] = useState(false);
	const [newQuestion, setNewQuestion] = useState("");
	const [bloodAcceptance, setBloodAcceptance] = useState<BloodAcceptance>({
		A: true,
		B: true,
		AB: true,
		O: true,
	});
	useEffect(() => {
		const load = async () => {
			try {
				const data = await fetchDonationRegistrations();
				setRegistrations(data);
console.log(data);
				// const allGroups = await fetchBloodGroups();
				// const nameMap: Record<string, string> = {};
				// allGroups.forEach((g) => {
				// 	nameMap[g._id] = g.name;
				// });
				// setGroupNames(nameMap);
			} catch (err) {
				console.error("Lỗi khi tải danh sách đăng ký:", err);
			}
		};
		load();
	}, []);

	const handleSelectRegistration = async (id: string) => {
		try {
			const detail = await fetchDonationRegistrationById(id);
			setSelected(detail);
		} catch (err) {
			console.error("Lỗi khi tải chi tiết đơn đăng ký:", err);
		}
	};

	const toggleBloodGroup = (bg: string) => {
		setBloodAcceptance((prev) => ({ ...prev, [bg]: !prev[bg] }));
	};

	const addQuestion = () => {
		if (newQuestion.trim()) {
			setQuestions((prev) => [...prev, newQuestion.trim()]);
			setNewQuestion("");
			setAdding(false);
		}
	};
	return (
		<div className="p-6">
			<Tabs
				value={activeTab}
				onValueChange={setActiveTab}
				className="space-y-4"
			>
				<TabsList className="flex justify-center flex-wrap gap-4 mb-6 bg-transparent border-none p-0">
  <TabsTrigger
    value="questions"
    className={`
      px-6 py-2 rounded-xl text-lg transition-all
      data-[state=active]:bg-[#236afe] data-[state=active]:text-white
      data-[state=inactive]:bg-white data-[state=inactive]:text-[#236afe]
      border border-[#236afe]
    `}
  >
    Câu hỏi và nhóm máu nhận
  </TabsTrigger>
  <TabsTrigger
    value="registrations"
    className={`
      px-6 py-2 rounded-xl text-lg transition-all
      data-[state=active]:bg-[#236afe] data-[state=active]:text-white
      data-[state=inactive]:bg-white data-[state=inactive]:text-[#236afe]
      border border-[#236afe]
    `}
  >
    Danh sách đăng ký
  </TabsTrigger>
</TabsList>

				<TabsContent value="questions">
					<DonationQuestionsEditor />

					<div className="mt-10">
						<h3 className="text-xl font-semibold mb-4 text-[#236afe] text-center">
							Trạng thái nhận các nhóm máu
						</h3>
						<div className="flex justify-center gap-10">
							{Object.entries(bloodAcceptance).map(([bg, accepted]) => (
								<label
									key={bg}
									className="flex items-center cursor-pointer space-x-2"
								>
									<input
										type="checkbox"
										checked={accepted}
										onChange={() => toggleBloodGroup(bg)}
										className="w-5 h-5 cursor-pointer accent-[#236afe]"
									/>
									<span className="text-lg font-medium text-gray-800">
										{bg}
									</span>
								</label>
							))}
						</div>
					</div>
				</TabsContent>

		<TabsContent value="registrations">
  <div className={`grid gap-4 ${selected ? "grid-cols-3" : "grid-cols-1"}`}>
    <Card className={selected ? "col-span-2" : "col-span-1"}>
      <CardHeader>
        <CardTitle className="text-[#236afe] text-xl text-center">
          Danh sách đăng ký hiến máu
        </CardTitle>
      </CardHeader>
      <CardContent className="overflow-auto max-h-[600px] p-0">
        <table className="w-full border">
          <thead className="bg-[#236afe] text-white">
            <tr>
              <th className="p-2 border">Họ tên</th>
              <th className="p-2 border">SĐT</th>
              <th className="p-2 border">Nhóm máu</th>
              <th className="p-2 border">Loại hiến</th>
              <th className="p-2 border">Chi tiết</th>
            </tr>
          </thead>
          <tbody>
            {registrations.map((reg) => (
              <tr
                key={reg._id}
                className="text-center border hover:bg-gray-100"
              >
                <td className="p-2 border">{reg.full_name}</td>
                <td className="p-2 border">{reg.phone}</td>
                <td className="p-2 border">{reg.blood_group_name}</td>
                <td className="p-2 border">
                  {reg.donation_type
                    ? bloodComponentVN(reg.donation_type)
                    : "-"}
                </td>
                <td className="p-2 border">
                  <Button
                    onClick={() => handleSelectRegistration(reg._id)}
                    size="sm"
                    variant="outline"
                  >
                    Xem
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>

    {selected && (
      <Card className="col-span-1 h-full">
        <CardHeader>
          <CardTitle className="text-[#236afe] text-lg text-center">
            Chi tiết đơn đăng ký
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            <strong>CCCD:</strong> {selected.citizen_id_number}
          </p>
          <p>
            <strong>Họ tên:</strong> {selected.full_name}
          </p>
          <p>
            <strong>SĐT:</strong> {selected.phone}
          </p>
          <p>
            <strong>Nhóm máu:</strong>{" "}
            {selected.blood_group_name || "-"}
          </p>
          <p>
            <strong>Loại hiến:</strong> {selected.donation_type || "-"}
          </p>
          <p>
            <strong>Trạng thái:</strong> {selected.status}
          </p>
          <p>
            <strong>Ngày tạo:</strong>{" "}
            {new Date(selected.created_at).toLocaleDateString("vi-VN")}
          </p>
          <p>
            <strong>Ngày hiến:</strong> {selected.start_date_donation}
          </p>
        </CardContent>
      </Card>
    )}
  </div>
</TabsContent>
			</Tabs>
		</div>
	);
}
