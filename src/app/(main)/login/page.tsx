"use client"
import Button from "@/src/components/ui/button";
import InputComponent from "@/src/components/ui/input";
import { usePathname, useRouter } from "next/navigation";

async function sendData(login: string, password: string) {
    const res = await fetch("");
    return await res;
}

const Login = function() {
    const router = useRouter();
    const pathname = usePathname();
    return (
    <div className="w-screen h-screen flex justify-center items-center">
        <div className="flex flex-col w-[75%] h-[70%]">
            <h1 className="text-[3rem] text-center">Вход</h1>
            <div className="flex flex-col justify-evenly h-[30%] w-[50%] m-auto">
                <InputComponent placeholder={"Введите вашу почту"} type={"email"} className="bg-gray-400 w-full hover:bg-gray-300" />
                <InputComponent placeholder={"Введите ваш пароль"} type={"password"} className="w-full bg-gray-400 hover:bg-gray-300" />
            </div>
            <Button text="Войти" onSubmit={() => {}} className="m-auto bg-gray-400 h-[4rem] w-[40%] rounded-xl hover:bg-gray-300 text-gray-600"/>
            <Button text="Зарегистрироваться" className="m-auto h-[4rem] w-[40%] rounded-xl text-gray-600 hover:bg-gray-300" onSubmit={() => {
                router.push("/register")
            }} />
        </div>
    </div>
    )
}

export default Login;