"use client"
import Button from "@/src/components/ui/button";
import InputComponent from "@/src/components/ui/input";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { AccessContext } from "@/src/components/context/access"

async function makeRegister(url: string, login: string, password: string) {
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
        console.log(res)
        if (!res.ok) {
            return ""
        }
        const data = await res.json();
        return data as string;
    } catch (error) {
        console.error('Error:', error);
        return ""
    }
}

const Register = function() {
    const router = useRouter();
    const {setOK, OK, baseURL, setToken} = useContext(AccessContext);
    return (
    <div className="w-screen h-screen flex justify-center items-center">
        <div className="flex flex-col w-[75%] h-[70%]">
            <h1 className="text-[3rem] text-center">Регистрация</h1>
            <div className="flex flex-col justify-evenly h-[40%] w-[50%] m-auto">
                <InputComponent placeholder={"Введите вашу почту"} type={"email"} className="bg-gray-400 w-full hover:bg-gray-300 inputEmail" />
                <InputComponent placeholder={"Введите ваш пароль"} type={"password"} className="w-full bg-gray-400 hover:bg-gray-300 inputEmail inputPassword" />
            </div>
            <Button text="Зарегистрироваться" onSubmit={async () => {
                const email = document.querySelector(".inputEmail") as HTMLInputElement;
                const password = document.querySelector(".inputPassword") as HTMLInputElement;
                if (email !== null && password !== null) {
                    const res = await makeRegister(baseURL + "/register", email.value, password.value)
                    if (res !== "") {
                        setOK(true);
                        setToken(res);
                        router.push("/")
                    } else {
                        setOK(false);
                    }
                }
            }} className="m-auto bg-gray-400 h-[4rem] w-[40%] rounded-xl hover:bg-gray-300 text-gray-600"/>
            <Button text="Войти" className=" m-auto h-[4rem] w-[40%] rounded-xl text-gray-600 hover:bg-gray-300" onSubmit={() => {
                router.push("/login")
            }} />
            {(OK === false && OK !== null) ? (<div className="text-[3rem] m-auto text-gray-600">Такой email уже занят!</div>) : null}
        </div>
    </div>
    )
}

export default Register;