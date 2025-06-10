import { NavLink } from "react-router-dom";
interface ButtonComponentProps {
  buttonType: string; 
  buttonText: string;
  buttonLink: string;
}
const ButtonComponent = ({ buttonText, buttonLink, buttonType }:ButtonComponentProps) => {
	return (
		<button
			className={`cta-btn 
            mt-5 rounded-md border 
            ${
				buttonType === "fill"
					? "border-dark_red text-white bg-red-800 hover:bg-red-900 hover:text-white"
					: "border-off_white/[.5] text-dark bg-white hover:bg-red hover:text-white hover:border-red-900 hover:bg-red-800"
			}
            transition text-black px-8 py-3 text-sm w-fit font-bold`}
		>
			<NavLink to={buttonLink}>{buttonText}</NavLink>
		</button>
	);
};

export default ButtonComponent;
