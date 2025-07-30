import React, { useEffect, useRef, useState } from "react";
import { WrapperSection } from "@/components";
import DateInputVi from "@/components/datePicker";
import { donationTypeList } from "@/constants/donationType";
import type { BloodComponent, BloodGroup } from "@/api/bloodService";
import { bloodService } from "@/api/bloodService";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import { fetchUserProfile } from "@/redux/slices/userSlice";
import { questionService } from "@/api/questionService";
import { toast } from "react-toastify";

interface Field {
  key: string;
  name: string;
  placeholder: string;
  required?: boolean;
}

interface FormComponentProps<T> {
  fields: Field[];
  heading: string;
  buttonText: string;
  formData: T;
  setFormData: React.Dispatch<React.SetStateAction<T>>;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  statusForm: string;
  dateValue: Date | null;
  setDateValue: (date: Date | null) => void;
}

function FormComponent<T extends Record<string, any>>({
  fields,
  heading,
  buttonText,
  formData,
  setFormData,
  handleSubmit,
  statusForm,
  dateValue,
  setDateValue,
}: FormComponentProps<T>) {
  const [bloodGroups, setBloodGroups] = useState<BloodGroup[]>([]);
  const formWrapperRef = useRef<HTMLDivElement>(null);
  const [questions, setQuestions] = useState<{ _id: string; name: string }[]>([]);
  const dispatch = useDispatch<AppDispatch>();
  const profile = useSelector((state: RootState) => state.users.profile);
  useEffect(() => {
      if (!profile) dispatch(fetchUserProfile());
    }, [dispatch, profile]);
  useEffect(() => {
    bloodService.getBloodGroups().then(setBloodGroups);
    questionService.fetchQuestions().then((res) => setQuestions(res || []));;
  }, []);
  useEffect(() => {
    if (profile?.blood_group_id && bloodGroups.length) {
      setFormData((prev) => ({
        ...prev,
        [fields[0].name]: (prev as Record<string, any>)[fields[0].name] || profile.blood_group_id, // chỉ set nếu chưa có
      }));
    }
  }, [profile, bloodGroups]);
  const handleAnswerChange = (question_id: string, answer: boolean) => {
      setFormData((prev) => {
        const existing = prev.answers.find((a: any) => a.question_id === question_id);
        let newAnswers;
        if (existing) {
          newAnswers = prev.answers.map((a: any) =>
            a.question_id === question_id ? { ...a, answer } : a
          );
        } else {
          newAnswers = [...prev.answers, { question_id, answer }];
        }
        return { ...prev, answers: newAnswers };
      });
    };
  // Fade-up effect
  useEffect(() => {
    const wrapper = formWrapperRef.current;
    if (wrapper) {
      setTimeout(() => {
        wrapper.style.transform = "translateY(0)";
        wrapper.style.opacity = "1";
      }, 500);
    }
  }, []);
  const validateForm = () => {
    const { blood_group_id, donation_type, answers } = formData;

    if (!blood_group_id) {
      toast.error("Vui lòng chọn nhóm máu");
      return false;
    }
    if (!donation_type) {
      toast.error("Vui lòng chọn loại hiến máu");
      return false;
    }
    if (!dateValue) {
      toast.error("Vui lòng chọn ngày hiến máu");
      return false;
    }
    const hasUnanswered = answers.some((a: any) => typeof a.answer !== "boolean");
    if (hasUnanswered) {
      toast.error("Vui lòng trả lời tất cả các câu hỏi kiểm tra");
      return false;
    }

    return true;
  };
  const inputStyles =
    "w-full p-4 border-none bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200 text-base";

  return (
    <WrapperSection>
      <div
        ref={formWrapperRef}
        className={`
          w-full relative p-6 py-10 lg:p-20 lg:pb-10 rounded-xl z-[25] overflow-visible
          -mt-[10em] form-wrapper-custom
        `}
        style={{
          backgroundColor: "rgb(37,99,235)", // blue-600
          backgroundImage: `url("../../assets/black texturized hemocell blood bank.jpg")`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        <h3 className="not-italic text-center font-medium text-[16px] sm:text-[25px] leading-[34px] tracking-[0.1em] sm:tracking-[0.3em] uppercase text-white">
          {heading}
        </h3>
        {statusForm === "Submited" ? (
          <p className="text-center text-white text-sm sm:text-base mt-12">
            Cảm ơn bạn đã tương tác với DonationBlood. <br />
            Chúng tôi sẽ thông báo lịch cho bạn sớm nhất có thể.
            <Link to="/profile/blood-history">
              <span className="hover:text-blue-900 hover:underline">Xem lịch sử hiến máu của bạn</span>
            </Link>
          </p>
        ) : (
          <form
            className="
              grid grid-cols-1 md:grid-cols-3 gap-5 w-full relative py-8 sm:p-10 rounded-xl z-[25] overflow-visible
              contact-form
            "
            onSubmit={(e) => {
              e.preventDefault();
              if (validateForm()) {
                handleSubmit(e);
              }
            }}
          >
            {/* Câu hỏi */}
            <div className="col-span-1 md:col-span-3">
              <div className="bg-white p-6 md:p-8 rounded-xl shadow-md border border-gray-200">
                <h4 className="text-lg font-semibold mb-4 text-center">
                  Câu hỏi kiểm tra trước hiến máu
                </h4>

                {/* Container có chiều cao cố định + scroll */}
                <div className="space-y-4 max-h-[45vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                  {questions.map((q) => {
                    const currentAnswer =
                      formData.answers.find((a: any) => a.question_id === q._id)?.answer ?? false;

                    return (
                      <div key={q._id}>
                        <p className="text-base font-semibold text-gray-800 mb-1">{q.name}</p>
                        <div className="flex gap-4">
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              name={q._id}
                              value="true"
                              checked={currentAnswer === true}
                              onChange={() => handleAnswerChange(q._id, true)}
                            />
                            Có
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              name={q._id}
                              value="false"
                              checked={currentAnswer === false}
                              onChange={() => handleAnswerChange(q._id, false)}
                            />
                            Không
                          </label>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
            {/* Select máu */}
            <div className="col-span-1">
              <select
                key={fields[0].key}
                name={fields[0].name}
                className={inputStyles}
                value={formData[fields[0].name as keyof T] as string || ""}
                onChange={e =>
                  setFormData(prev => ({
                    ...prev,
                    [fields[0].name]: e.target.value,
                  }))
                }
              >
                <option value="">Chọn nhóm máu của bạn</option>
                {bloodGroups.map(bg => (
                  <option key={bg._id} value={bg._id}>
                    {bg.name}
                  </option>
                ))}
              </select>
            </div>
            {/* Select blood type (DonationType) */}
            <div className="col-span-1">
              <select
                key={fields[1].key}
                name={fields[1].name}
                className={inputStyles}
                value={formData[fields[1].name as keyof T] as string || ""}
                onChange={e =>
                  setFormData(prev => ({
                    ...prev,
                    [fields[1].name]: e.target.value,
                  }))
                }
              >
                <option value="">Chọn loại hiến máu</option>
                {donationTypeList.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            {/* Datepicker */}
            <div className="col-span-1 flex items-center">
              <DateInputVi
                value={dateValue}
                onChange={setDateValue}
                disabled={statusForm === "Submited"}
              />
            </div>
            {/* Button dưới cùng full width */}
            <div className="col-span-1 md:col-span-3 mt-6 flex justify-center">
              <button
                type="submit"
                name="submit"
                className="rounded-md border border-white hover:border-red-900 text-dark bg-white hover:bg-red-900 hover:text-white transition px-10 py-4 text-base w-full max-w-xs font-bold cursor-pointer"
              >
                {buttonText}
              </button>
            </div>
          </form>
        )}
      </div>
    </WrapperSection>
  );
}

export default FormComponent;
