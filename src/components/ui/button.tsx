"use client"

import classNames from "classnames";

interface ButtonProps {
  text: string;
  onSubmit: (e: React.MouseEvent<HTMLDivElement>) => void;
  className?: string;
  color?: string;
  size?: string;
}

const Button = ({text, onSubmit, className} : ButtonProps) => {


  return (
    <div className={classNames(
      "rounded-lg flex items-center justify-center transition-all duration-150 select-none md:text-[2rem] text-[1.5rem] w-[10%]",
      className
    )} onClick={(e : React.MouseEvent<HTMLDivElement>) => onSubmit(e)}>
      {text}
    </div>
  )
}

export default Button;