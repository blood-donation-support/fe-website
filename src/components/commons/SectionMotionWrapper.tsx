import { useInView } from "react-intersection-observer";
import React from "react";

type Props = {
  children: (inView: boolean) => React.ReactNode;
  className?: string;
  threshold?: number;
};

export default function SectionMotionWrapper({
  children,
  className = "",
  threshold = 0.2,
}: Props) {
  const { ref, inView } = useInView({ threshold, triggerOnce: true });

  return (
    <section ref={ref} className={className}>
      {children(inView)}
    </section>
  );
}
