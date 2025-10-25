"use client"
import Button from "@/src/components/ui/button";
import InputComponent from "@/src/components/ui/input";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { AccessContext } from "@/src/components/context/access"


async function makeEnter(url: string, login: string, password: string) {
    const dataH = JSON.stringify({
        password,
        login
    })
    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: dataH,
        });
        if (!res.ok) {
            return ""
        }
        const data = await res.json();
        return data.token as string;
    } catch (error) {
        console.error('Error:', error);
        return ""
    }
}

const Login = function() {
    const router = useRouter();
    const {setOK, OK, baseURL, setToken, setMemo } = useContext(AccessContext);
    return (
    <div className="w-screen h-screen flex justify-center items-center">
        <div className="flex flex-col w-[75%] md:h-[70%] h-[50%]">
            <h1 className="text-[3rem] text-center">Вход</h1>
            <div className="flex flex-col justify-evenly h-[50%] w-[50%] m-auto">
                <InputComponent placeholder={"Введите вашу почту"} type={"email"} className="md:text-[2rem] text-[1rem] inputEmail bg-gray-400 w-full hover:bg-gray-300" />
                <InputComponent placeholder={"Введите ваш пароль"} type={"password"} className="md:text-[2rem] text-[1rem] inputPassword w-full bg-gray-400 hover:bg-gray-300" />
                <label className="flex items-center space-x-3 cursor-pointer">
                    <input 
                        type="checkbox"
                        className="w-[2rem] md:h-[2rem] h-[1.5rem] rememberMe text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <span className="md:text-[2rem] text-[1rem] text-gray-600 select-none">Запомнить меня</span>
                </label>
            </div>
            <Button text="Войти" onSubmit={async () => {
                const email = document.querySelector(".inputEmail") as HTMLInputElement;
                const password = document.querySelector(".inputPassword") as HTMLInputElement;
                const rememberMe = document.querySelector(".rememberMe") as HTMLInputElement;
                if (email !== null && password !== null) {
                    const res = await makeEnter(baseURL + "/login", email.value, password.value)
                    if (rememberMe !== null && rememberMe.value === "true") {
                        setMemo(true);
                    }
                    if (res !== "") {
                        setOK(true);
                        setToken(res);
                        router.push("/")
                    } else {
                        setOK(false);
                    }
                }
            }} className="m-auto md:text-[2rem] text-[1rem] bg-gray-400 h-[4rem] w-[40%] rounded-xl hover:bg-gray-300 text-gray-600"/>            
            <Button text="Зарегистрироваться" className=" md:text-[2rem] text-[1rem] m-auto h-[4rem] w-[40%] rounded-xl text-gray-600 hover:bg-gray-300" onSubmit={() => {
                router.push("/register")
            }} />
            {(OK === false && OK !== null) ? (<div className="text-[3rem] m-auto text-gray-600">Неправильный логин или пароль!</div>) : null}
        </div>
    </div>
    )
}

export default Login;