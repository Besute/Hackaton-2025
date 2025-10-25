"use client"

import { createContext, useContext, useEffect, useLayoutEffect, useState } from "react";
import { useRouter, usePathname } from 'next/navigation';
import Loader from "../ui/loader";

const baseURL = ""

async function makeFetchGet(url : string, token : string | boolean | null) {
    try {
        const resToGetData = await fetch(url, {
            method: "GET",
            headers: {
                "Authorization": `${token}`
            }
            });
        const res = await resToGetData.json()
        return res;
    } catch {
        return false;
    }
}

interface access {
    setPassword: (pass: string) => void,
    setLogin: (log: string) => void,
    token: string | null;
    login: string | undefined;
    setLoading: (load: boolean) => void;
    setOK: (OK: boolean) => void;
    baseURL: string;
    OK: null | boolean;
};

export const AccessContext = createContext <access> ({
    setPassword: () => {},
    setLogin: () => {},
    token: null,
    login: "",
    setLoading: () => {},
    setOK: () => {},
    baseURL: "",
    OK: null,
});

function AccessProvider({ children }: { children: React.ReactNode }) {
    const [login, setLogin] = useState<undefined | string>(undefined);
    const [password, setPassword] = useState<undefined | string>(undefined);
    const [token, setToken] = useState <string | null> (null);
    const [loading, setLoading] = useState(false);
    const [OK, setOK] = useState<boolean | null> (false);

    const router = useRouter();
    const pathname = usePathname();
    useLayoutEffect(() => {
        if (localStorage.getItem("Token") !== "") {
            setOK(true)
        }
    }, [])
    useLayoutEffect(() => { 
        if (!OK && pathname !== "/discovery" && pathname !== "/register" && pathname !== "/login") {
            router.push("/register")
        }
    }, [pathname, OK, router])

    useEffect(() => {
        async function sendData() {
            const res = await makeFetchGet(baseURL + "login", "")
            console.log(res)
        }
        sendData();
    }, [login, password])

    return (
        <AccessContext.Provider value={{ setPassword, setLogin, token, login, setLoading, setOK, baseURL, OK }}>
            {children}
        </AccessContext.Provider>
    );
}

export function useAccess() {
  const context = useContext(AccessContext);
  return context;
}

export default AccessProvider;