import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import donationData from "../../public/totalDonationRegistrations.json";
import DonationQuestionsEditor from "@/components/DonationQuestionsEditor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  const [registrations, setRegistrations] = useState<FormRegistration[]>([]);
  const [selected, setSelected] = useState<FormRegistration | null>(null);
  const [questions, setQuestions] = useState<string[]>(initialQuestions);
  
  const [adding, setAdding] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
const [bloodAcceptance, setBloodAcceptance] = useState<BloodAcceptance>({
    A: true,
    B: true,
    AB: true,
    O: true,
  });
  useEffect(() => {
    setRegistrations(donationData as FormRegistration[]);
  }, []);
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
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
      <TabsList className="rounded-md px-2 py-1 flex space-x-2">
  <TabsTrigger
    value="questions"
    className="data-[state=active]:bg-white data-[state=active]:text-[#236afe] px-4 py-2 rounded-md text-black hover:bg-white/70 transition"
  >
    Câu hỏi và nhóm máu nhận
  </TabsTrigger>
  <TabsTrigger
    value="registrations"
    className="data-[state=active]:bg-white data-[state=active]:text-[#236afe] px-4 py-2 rounded-md text-black hover:bg-white/70 transition"
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
                <span className="text-lg font-medium text-gray-800">{bg}</span>
              </label>
            ))}
          </div>
        </div>
</TabsContent>
       
        <TabsContent value="registrations">
         <div className="grid grid-cols-3 gap-4">
  <Card className="col-span-2">
    <CardHeader>
      <CardTitle className="text-[#236afe] text-xl text-center">Danh sách đăng ký hiến máu</CardTitle>
    </CardHeader>
    <CardContent className="overflow-auto max-h-[600px] p-0">
      <table className="w-full border">
        <thead className="bg-[#236afe] text-white">
          <tr>
            <th className="p-2 border">Họ tên</th>
            <th className="p-2 border">SĐT</th>
            <th className="p-2 border">Nhóm máu</th>
            <th className="p-2 border">Trạng thái</th>
            <th className="p-2 border">Chi tiết</th>
          </tr>
        </thead>
        <tbody>
          {registrations.map((reg) => (
            <tr key={reg.id} className="text-center border hover:bg-gray-100">
              <td className="p-2 border">{reg.fullName}</td>
              <td className="p-2 border">{reg.phone}</td>
              <td className="p-2 border">{reg.bloodGroup}</td>
              <td className="p-2 border capitalize">{reg.status}</td>
              <td className="p-2 border">
                <Button onClick={() => setSelected(reg)} size="sm" variant="outline">
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
    <Card className="col-span-1 max-h-[600px] overflow-auto">
      <CardHeader>
        <CardTitle className="text-[#236afe] text-lg">Chi tiết đơn đăng ký</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <p><strong>Họ tên:</strong> {selected.fullName}</p>
        <p><strong>Ngày sinh:</strong> {selected.birthDate}</p>
        <p><strong>Giới tính:</strong> {selected.gender}</p>
        <p><strong>CCCD:</strong> {selected.nationalId}</p>
        <p><strong>Địa chỉ:</strong> {selected.address}</p>
        <p><strong>Điện thoại:</strong> {selected.phone}</p>
        <p><strong>Email:</strong> {selected.email || "-"}</p>
        <p><strong>Chiều cao:</strong> {selected.height || "-"} cm</p>
        <p><strong>Cân nặng:</strong> {selected.weight} kg</p>
        <p><strong>Nhóm máu:</strong> {selected.bloodGroup}</p>
        <p><strong>Lần hiến gần nhất:</strong> {selected.lastDonationDate || "-"}</p>
        <p><strong>Ngày đăng ký:</strong> {selected.registrationDate}</p>
        <p><strong>Trạng thái:</strong> {selected.status}</p>
        <div>
          <strong>Câu trả lời sàng lọc:</strong>
          <ul className="list-disc list-inside">
            {selected.diseaseHistory.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )}
</div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
