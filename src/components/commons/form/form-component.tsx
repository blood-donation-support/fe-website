import { useEffect, useState } from "react";
import "./form-component-styles.scss";
import { WrapperSection } from "@/components";
import bloodService, { type BloodComponent, type BloodGroup } from "@/api/bloodService";
import bloodComponentVN from "@/utils/translateBloodComponentVN";

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
  statusForm: string; // "Pending" | "Submited" | "Error"
}

function FormComponent<T>({
  fields,
  heading,
  buttonText,
  formData,
  setFormData,
  handleSubmit,
  statusForm,
}: FormComponentProps<T>) {
  const [bloodGroups, setBloodGroups] = useState<BloodGroup[]>([]);
  const [bloodComponents, setBloodComponents] = useState<BloodComponent[]>([]);
  const inputStyles = `w-full p-5 border sm:col-span-4 border-none bg-[#D9D9D9] rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-gray-200`;
  useEffect(() => {
    const fetchBloodGroups = async () => {
      const bloodGrofetch = await bloodService.getBloodGroups();
      setBloodGroups(bloodGrofetch);
    };
	const fetchBloodComponents = async () => {
		const bloodComponents = await bloodService.getBloodComponents();
		setBloodComponents(bloodComponents);
	}
	fetchBloodComponents();
    fetchBloodGroups();
  }, []);
  return (
    <WrapperSection>
      <div className={`form-wrapper -mt-[10em] w-full relative p-6 py-10 lg:p-20 lg:pb-10 rounded-xl z-[25] overflow-hidden`}>
        <h3 className="not-italic text-center font-medium text-[16px] sm:text-[25px] leading-[34px] tracking-[0.1em] sm:tracking-[0.3em] uppercase text-white">
          {heading}
        </h3>
        {statusForm === "Submited" ? (
          <p className="text-center text-white text-sm sm:text-base mt-12">
            Cảm ơn bạn đã tương tác với DonationBlood. <br/>Chúng tôi sẽ thông báo lịch cho bạn sớm nhất có thể.
          </p>
        ) : (
          <form
            className="contact-form grid grid-cols-1 sm:grid-cols-2 gap-5 w-full relative  py-8 sm:p-10 rounded-rmd z-[25] overflow-hidden"
            onSubmit={handleSubmit}
          >
          {fields.map((field, index) => field.name === "blood_group_id" ? (
			<select
				key={field.key}
				name={field.name}
				className={inputStyles}
				value={formData[field.name as keyof T] as string || ""}
				onChange={e =>
					setFormData(prev => ({
					...prev,
					[field.name]: e.target.value,
					}))
				}
				required={field.required}
				>
				<option value="">Chọn nhóm máu của bạn</option>
				{bloodGroups.map(bg => (
					<option key={bg._id} value={bg._id}>
					{bg.name}
					</option>
				))}
				</select>
			) : field.name=== "blood_component_id"? (
			<select
				key={field.key}
				name={field.name}
				className={inputStyles}
				value={formData[field.name as keyof T] as string || ""}
				onChange={e =>
					setFormData(prev => ({
					...prev,
					[field.name]: e.target.value,
					}))
				}
				required={field.required}
				>
				<option value="">Chọn thành phần máu của bạn</option>
				{bloodComponents.map(bc => (
					<option key={bc._id} value={bc._id}>
					{bloodComponentVN(bc.name)}
					</option>
				))}
			</select>
			): (
				<input
				key={field.key}
				name={field.name}
				className={inputStyles}
				value={formData[field.name as keyof T] as string || ""}
				onChange={e =>
					setFormData(prev => ({
					...prev,
					[field.name]: e.target.value,
					}))
				}
				required={field.required}
				placeholder={field.placeholder}
				/>
			))}


            <div className="grid place-items-center sm:col-span-2 gap-5 mb-5 w-full">
              <button
                type="submit"
                name="submit"
                className={` rounded-md border border-white hover:border-red-900 text-dark bg-white hover:bg-red-900 hover:text-white transition px-10 py-4 text-sm w-fit font-bold cursor-pointer`}
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