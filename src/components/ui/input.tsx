
import classNames from "classnames"

interface ButtonProps {
  placeholder: string,
  initValue?: string,
  className?: string,
  type: string
}

const InputComponent = function({placeholder, initValue, className, type} : ButtonProps) {
    return (<input type={type} placeholder={placeholder} defaultValue={initValue != "" ? initValue : ""} className={classNames(className, "transition-all duration-150 h-[3rem] text-[1.5rem] select-none outline-none pl-[1rem] rounded-xl w-[20%]")}>

    </input>)
}

export default InputComponent