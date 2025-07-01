interface ParaComponentProps {
  innerText: string;
  size?: "large" | "small";
}

const ParaComponent = ({ innerText, size }: ParaComponentProps) => {
  return (
    <p className={`step-description not-italic font-medium ${size == "large" ? `text-[30px] leading-10` : `text-[16px] leading-7`}  text-light`}>
      {innerText}
    </p>
  );
};

export default ParaComponent;