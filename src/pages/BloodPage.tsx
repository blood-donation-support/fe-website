import React, { useEffect, useState } from "react";
import {
  fetchBloodGroups,
  fetchBloodComponents,
  createBloodGroups,
  createBloodComponents,
} from "../api/bloodService";
import bloodComponentVN from "@/utils/translateBloodComponentVN";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

type BloodItem = {
  _id: string;
  name: string;
  created_at: string;
  updated_at: string;
};

const PRIMARY_COLOR = "#236AFE";

export default function BloodPage() {
  const [bloodGroups, setBloodGroups] = useState<BloodItem[]>([]);
  const [bloodComponents, setBloodComponents] = useState<BloodItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<BloodItem | null>(null);
  const [modalType, setModalType] = useState<"group" | "component">("group");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [groups, components] = await Promise.all([
          fetchBloodGroups(),
          fetchBloodComponents()
        ]);
        setBloodGroups(groups);
        setBloodComponents(components);
      } catch (error) {
        console.error("Error loading blood data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleOpenModal = (item?: BloodItem, type: "group" | "component" = "group") => {
    setEditItem(item ?? null);
    setModalType(type);
    setModalOpen(true);
  };

  const handleSave = async (data: BloodItem) => {
    try {
      let savedItem: BloodItem;

      if (data._id) {
        // TODO: Gọi API update (nếu bạn có)
        savedItem = {
          ...data,
          updated_at: new Date().toISOString(),
        };
      } else {
        if (modalType === "group") {
          savedItem = await createBloodGroups(data.name);
          setBloodGroups([...bloodGroups, savedItem]);
        } else {
          savedItem = await createBloodComponents(data.name);
          setBloodComponents([...bloodComponents, savedItem]);
        }
      }

      setModalOpen(false);
    } catch (err) {
      console.error("Lỗi khi tạo:", err);
    }
  };

  if (loading) {
    return (
      <div className="px-3 py-6">
        <p className="text-gray-500 italic text-center">Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="px-3 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Danh sách nhóm máu - Bên trái */}
        <div>
          {renderTable(bloodGroups, "group", () => handleOpenModal(undefined, "group"))}
        </div>

        {/* Danh sách thành phần máu - Bên phải */}
        <div>
          {renderTable(bloodComponents, "component", () => handleOpenModal(undefined, "component"))}
        </div>
      </div>

      {modalOpen && (
        <ModalForm
          defaultValue={editItem}
          type={modalType}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

function renderTable(
  list: BloodItem[],
  type: "group" | "component",
  onAdd?: () => void
) {
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800 text-center w-full">
          {type === "group" ? "Danh sách nhóm máu" : "Danh sách thành phần máu"}
        </h2>
        {/* Uncomment để thêm nút thêm */}
        {/* <button
          className="absolute right-3 top-6 bg-blue-600 text-white px-5 py-2 rounded-full font-semibold shadow hover:scale-105 transition"
          onClick={onAdd}
        >
          + Thêm mới
        </button> */}
      </div>

      <Table className="border rounded-xl overflow-hidden">
        <TableHeader className="bg-[#236afe] text-white">
          <TableRow>
            <TableHead className="text-white">STT</TableHead>
            <TableHead className="text-white">Tên</TableHead>
            <TableHead className="text-white">Ngày tạo</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {list.map((item, index) => (
            <TableRow key={item._id} className="hover:bg-gray-50">
              <TableCell className="text-center font-medium">
                {index + 1}
              </TableCell>
              <TableCell>
                <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {type === "component"
                    ? bloodComponentVN(item.name)
                    : item.name}
                </span>
              </TableCell>
              <TableCell className="text-gray-600">
                {new Date(item.created_at).toLocaleDateString("vi-VN")}
              </TableCell>
            </TableRow>
          ))}
          {list.length === 0 && (
            <TableRow>
              <TableCell colSpan={3} className="text-center italic text-gray-500 py-4">
                Không có dữ liệu
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}

function ModalForm({
  defaultValue,
  type,
  onClose,
  onSave,
}: {
  defaultValue: BloodItem | null;
  type: "group" | "component";
  onClose: () => void;
  onSave: (item: BloodItem) => void;
}) {
  const [name, setName] = useState(defaultValue?.name || "");

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          {defaultValue ? "Cập nhật" : "Thêm mới"} {type === "group" ? "nhóm máu" : "thành phần máu"}
        </h3>

        <input
          className="w-full border border-gray-300 p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Nhập tên"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
            onClick={onClose}
          >
            Hủy
          </button>
          <button
            className="px-4 py-2 text-white rounded-md"
            style={{ backgroundColor: PRIMARY_COLOR }}
            onClick={() =>
              onSave({
                _id: defaultValue?._id || "",
                name,
                created_at: defaultValue?.created_at || "",
                updated_at: new Date().toISOString(),
              })
            }
          >
            {defaultValue ? "Cập nhật" : "Tạo mới"}
          </button>
        </div>
      </div>
    </div>
  );
}