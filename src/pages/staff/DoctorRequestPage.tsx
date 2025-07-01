import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

import {
  fetchBloodGroups,
  fetchBloodComponents,
  getBloodGroupIdByName,
  getBloodComponentIdByName,
  createDoctorRequest,
} from "../../api/doctorRequestService";
import type { DoctorRequestPayload } from "../../api/doctorRequestService";

import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "@/firebase";

export const DoctorRequestPage: React.FC = () => {
  const navigate = useNavigate();

  type Form = {
    patient_code: string;
    citizen_id_number: string;
    full_name: string;
    phone: string;
    bloodGroupName: string;
    bloodComponentNames: string[];
    receive_date_request: string;
    is_emergency: boolean;
    image: string;
    note: string;
  };
  const initialForm: Form = {
    patient_code: "",
    citizen_id_number: "",
    full_name: "",
    phone: "",
    bloodGroupName: "",
    bloodComponentNames: [],
    receive_date_request: new Date().toISOString(),
    is_emergency: false,
    image: "",
    note: "",
  };

  const [idType, setIdType] = useState<"patient_code" | "citizen_id_number">(
    "patient_code"
  );
  const [form, setForm] = useState<Form>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});
  const [successMessage, setSuccessMessage] = useState("");
  const [bloodGroupOptions, setBloodGroupOptions] = useState<string[]>([]);
  const [bloodComponentOptions, setBloodComponentOptions] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const groups = await fetchBloodGroups();
        setBloodGroupOptions(groups.map((g) => g.name));
        const comps = await fetchBloodComponents();
        setBloodComponentOptions(comps.map((c) => c.name));
      } catch (err) {
        console.error("Lỗi lấy danh mục máu:", err);
      }
    })();
  }, []);

  useEffect(() => {
    setPreviewUrl(form.image || "");
  }, [form.image]);

  const handleChange = (
    field: keyof Form,
    value: string | boolean | string[]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value } as any));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const errs: Partial<Record<keyof Form, string>> = {};
    if (!form.full_name.trim()) errs.full_name = "Bắt buộc";
    if (!/^\d{10,11}$/.test(form.phone)) errs.phone = "SĐT không hợp lệ";
    if (!form.bloodGroupName) errs.bloodGroupName = "Chọn nhóm máu";
    if (form.bloodComponentNames.length === 0)
      errs.bloodComponentNames = "Chọn thành phần máu";
    if (
      idType === "patient_code" &&
      !form.patient_code.trim()
    )
      errs.patient_code = "Nhập mã bệnh nhân";
    if (
      idType === "citizen_id_number" &&
      !form.citizen_id_number.trim()
    )
      errs.citizen_id_number = "Nhập CCCD";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview tạm
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    // Upload lên Firebase
    const storageRef = ref(
      storage,
      `doctor-requests/${Date.now()}_${file.name}`
    );
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const prog = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setUploadProgress(prog);
      },
      (err) => console.error("Upload lỗi:", err),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          handleChange("image", url); // Lưu URL chính thức
          URL.revokeObjectURL(objectUrl); // Dọn preview tạm
          setUploadProgress(0);
        });
      }
    );
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const bgId = await getBloodGroupIdByName(form.bloodGroupName);
    const bcIds = await Promise.all(
      form.bloodComponentNames.map((name) =>
        getBloodComponentIdByName(name)
      )
    );

    if (!bgId || bcIds.some((id) => !id)) {
      alert("Không tìm thấy nhóm máu hoặc thành phần máu phù hợp.");
      return;
    }

    const payload: DoctorRequestPayload = {
      blood_group_id: bgId,
      blood_component_ids: bcIds as string[],
      receive_date_request: form.receive_date_request,
      is_emergency: form.is_emergency,
      full_name: form.full_name,
      phone: form.phone,
      image: form.image || undefined,
      note: form.note || undefined,
      ...(idType === "patient_code"
        ? { patient_code: form.patient_code }
        : { citizen_id_number: form.citizen_id_number }),
    };
    console.log("payload nè", payload);

    try {
      await createDoctorRequest(payload);
      setSuccessMessage("Tạo đơn xin máu thành công!");
      setForm(initialForm);
    } catch (err) {
      console.error(err);
      alert("Có lỗi khi gửi yêu cầu");
    }
  };

  return (
    <div className="p-8 bg-[#f9fafb] min-h-screen flex justify-center">
      <div className="w-full max-w-3xl">
        <h2 className="text-3xl font-semibold text-center text-[#236afe] mb-8">
          Tạo Đơn Xin Máu
        </h2>
        {successMessage && (
          <div className="mb-4 text-green-600 font-medium text-center">
            {successMessage}
          </div>
        )}
        <Card className="shadow-lg">
          <CardContent className="p-6 space-y-4">
            {/* Chọn ID */}
            <Select
              value={idType}
              onValueChange={(v) => setIdType(v as any)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn ID" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="patient_code">
                  Mã bệnh nhân
                </SelectItem>
                <SelectItem value="citizen_id_number">
                  CCCD
                </SelectItem>
              </SelectContent>
            </Select>

            {/* Input theo ID */}
            {idType === "patient_code" ? (
              <Input
                placeholder="Mã bệnh nhân"
                value={form.patient_code}
                onChange={(e) =>
                  handleChange("patient_code", e.target.value)
                }
                className={
                  errors.patient_code ? "border-red-500" : ""
                }
              />
            ) : (
              <Input
                placeholder="CCCD"
                value={form.citizen_id_number}
                onChange={(e) =>
                  handleChange("citizen_id_number", e.target.value)
                }
                className={
                  errors.citizen_id_number
                    ? "border-red-500"
                    : ""
                }
              />
            )}
            {errors[idType] && (
              <p className="text-red-600">{errors[idType]}</p>
            )}

            {/* Họ tên & SĐT */}
            <Input
              placeholder="Họ và tên"
              value={form.full_name}
              onChange={(e) =>
                handleChange("full_name", e.target.value)
              }
            />
            {errors.full_name && (
              <p className="text-red-600">{errors.full_name}</p>
            )}
            <Input
              placeholder="Số điện thoại"
              value={form.phone}
              onChange={(e) =>
                handleChange("phone", e.target.value)
              }
            />
            {errors.phone && (
              <p className="text-red-600">{errors.phone}</p>
            )}

            {/* Ngày nhận yêu cầu */}
            <Input
              type="datetime-local"
              value={form.receive_date_request.slice(0, 16)}
              onChange={(e) =>
                handleChange(
                  "receive_date_request",
                  new Date(e.target.value).toISOString()
                )
              }
            />

            {/* Nhóm máu */}
            <Select
              value={form.bloodGroupName}
              onValueChange={(v) =>
                handleChange("bloodGroupName", v)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn nhóm máu" />
              </SelectTrigger>
              <SelectContent>
                {bloodGroupOptions.map((g) => (
                  <SelectItem key={g} value={g}>
                    {g}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.bloodGroupName && (
              <p className="text-red-600">
                {errors.bloodGroupName}
              </p>
            )}

            {/* Thành phần máu (multi-check, 3 cột) */}
            <div className="space-y-2">
              <Label className="font-medium">
                Thành phần máu
              </Label>
              <div className="grid grid-cols-3 gap-4">
                {bloodComponentOptions.map((name) => (
                  <div
                    key={name}
                    className="flex items-center"
                  >
                    <Checkbox
                      id={name}
                      checked={form.bloodComponentNames.includes(
                        name
                      )}
                      onCheckedChange={(checked) => {
                        const isChecked = checked === true;
                        const next = isChecked
                          ? [
                              ...form.bloodComponentNames,
                              name,
                            ]
                          : form.bloodComponentNames.filter(
                              (n) => n !== name
                            );
                        handleChange(
                          "bloodComponentNames",
                          next
                        );
                      }}
                    />
                    <Label
                      htmlFor={name}
                      className="ml-2"
                    >
                      {name}
                    </Label>
                  </div>
                ))}
              </div>
              {errors.bloodComponentNames && (
                <p className="text-red-600 text-sm">
                  {errors.bloodComponentNames}
                </p>
              )}
            </div>

            {/* Khẩn cấp */}
            <Select
              value={form.is_emergency ? "true" : "false"}
              onValueChange={(v) =>
                handleChange(
                  "is_emergency",
                  v === "true"
                )
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Khẩn cấp" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="false">
                  Bình thường
                </SelectItem>
                <SelectItem value="true">
                  Khẩn cấp
                </SelectItem>
              </SelectContent>
            </Select>

            {/* File picker + URL input */}
            <div className="flex items-start space-x-6">
              <div className="flex flex-col">
                <label className="block mb-1 font-medium">
                  Hình ảnh
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="border rounded px-2 py-1"
                />
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <p className="text-sm mt-1">
                    Đang upload: {uploadProgress}%
                  </p>
                )}
                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="preview"
                    className="mt-2 w-32 h-32 object-cover rounded border"
                  />
                )}
              </div>
              <div className="flex-1 flex flex-col">
                <label className="block mb-1 font-medium">
                  URL hoặc Base64
                </label>
                <Input
                  placeholder="Hình ảnh (URL hoặc Base64)"
                  value={form.image}
                  onChange={(e) =>
                    handleChange("image", e.target.value)
                  }
                />
                {errors.image && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.image}
                  </p>
                )}
              </div>
            </div>

            {/* Ghi chú */}
            <Textarea
              placeholder="Ghi chú"
              value={form.note}
              onChange={(e) =>
                handleChange("note", e.target.value)
              }
              className="min-h-[80px]"
            />

            {/* Submit */}
            <div className="text-center">
              <Button onClick={handleSubmit}>
                Gửi yêu cầu
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
