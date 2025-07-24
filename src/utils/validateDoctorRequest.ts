import type { DoctorRequestForm } from "../api/doctorRequestService";

export type FormErrors = Partial<Record<keyof DoctorRequestForm, string>>;


export function validateDoctorRequest(form: DoctorRequestForm): FormErrors {
  const errors: FormErrors = {};

  const tsSelected = new Date(form.receive_date_request).getTime();
  if (tsSelected < Date.now()) {
    errors.receive_date_request = "Không được chọn ngày giờ trong quá khứ";
  }

  if (!form.full_name.trim()) {
    errors.full_name = "Họ và tên bắt buộc";
  } else if (!/^[A-Za-zÀ-ỹ\s]+$/.test(form.full_name.trim())) {
    errors.full_name = "Họ và tên chỉ được chứa chữ và khoảng trắng";
  }

  
  if (!form.phone.trim()) {
    errors.phone = "Số điện thoại bắt buộc";
  } else if (!/^0[35789]\d{8}$/.test(form.phone.trim())) {
    errors.phone = "Số điện thoại không hợp lệ (10 số, bắt đầu 0)";
  }

  if (!form.citizen_id_number.trim()) {
    errors.citizen_id_number = "CCCD bắt buộc";
  } else if (!/^[0-9]{12}$/.test(form.citizen_id_number.trim())) {
    errors.citizen_id_number = "CCCD phải gồm 12 chữ số";
  }

  if (!form.bloodGroupName) {
    errors.bloodGroupName = "Vui lòng chọn nhóm máu";
  }
  if (!form.request_type) {
    errors.request_type = "Vui lòng chọn thành phần máu";
  }

  if (form.image && !/^https?:\/\/.+\.(jpe?g|png|gif)$/i.test(form.image)) {
    errors.image = "URL hình ảnh không hợp lệ";
  }

  if (form.note.length > 500) {
    errors.note = "Ghi chú không được vượt quá 500 ký tự";
  }

  return errors;
}
