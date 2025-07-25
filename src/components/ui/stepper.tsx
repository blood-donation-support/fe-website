import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StepProps {
	title: string;
	isActive: boolean;
	isCompleted: boolean;
	stepNumber: number;
}

const Step = ({ title, isActive, isCompleted, stepNumber }: StepProps) => {
	return (
		<div className="flex flex-col items-center text-center relative">
			<motion.div
				initial={false}
				animate={{
					scale: isActive ? 1.2 : 1,
					backgroundColor: isCompleted
						? "#22c55e" 
						: isActive
						? "#2563eb" 
						: "#d1d5db", 
				}}
				transition={{ type: "spring", stiffness: 300, damping: 20 }}
				className={cn(
					"rounded-full w-12 h-12 flex items-center justify-center text-white font-bold z-10 shadow-lg",
				)}
			>
				{isCompleted ? "✔" : stepNumber}
			</motion.div>
			<div className="mt-2 text-sm font-medium">{title}</div>
		</div>
	);
};

interface StepperProps {
	steps: string[];
	currentStep: number;
	rejectedStep?: number;
}

export const Stepper = ({ steps, currentStep, rejectedStep }: StepperProps) => {
	return (
		<div className="relative flex items-center w-full">
		{steps.map((title, index) => {
  const stepNumber = index + 1;
  const isCompleted = currentStep > stepNumber;
  const isActive = currentStep === stepNumber;

  const isRejected =
    rejectedStep !== undefined && stepNumber >= rejectedStep;

  const isGreenCompleted = !isRejected && isCompleted;
  const isBlueActive = !isRejected && isActive;

  const bgColor = isRejected
    ? "#ef4444" 
    : isGreenCompleted
    ? "#22c55e" 
    : isBlueActive
    ? "#2563eb" 
    : "#d1d5db"; 

  const icon = isRejected
    ? "✖"
    : isGreenCompleted
    ? "✔"
    : stepNumber;

  return (
    <div key={index} className="flex-1 flex flex-col items-center relative">
      {/* Đường nối ngang */}
      {index !== steps.length - 1 && (
        <div className="absolute top-6 left-1/2 w-full h-1 z-0">
          <motion.div
            animate={{
              backgroundColor: isGreenCompleted ? "#22c55e" : "#d1d5db",
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="h-1 rounded-full"
          />
        </div>
      )}

      {/* Nút step */}
      <motion.div
        animate={{
          scale: isActive ? 1.2 : 1,
          backgroundColor: bgColor,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="rounded-full w-12 h-12 flex items-center justify-center text-white font-bold z-10 shadow-lg"
      >
        {icon}
      </motion.div>

      <div className="mt-2 text-sm font-medium text-center">{title}</div>
    </div>
  );
})}

		</div>
	);
};
