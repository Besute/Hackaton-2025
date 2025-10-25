"use client"

import { createContext, useContext, useEffect, useLayoutEffect, useState } from "react";
import { useRouter, usePathname } from 'next/navigation';
import Loader from "../ui/loader";

const baseURL = "http://127.0.01:8000"

async function makeFetchGet(url : string, token : string | boolean | null) {
    console.log(url)
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
    setToken: (token: string) => void;
    token: string | null;
    login: string | undefined;
    setLoading: (load: boolean) => void;
    setOK: (OK: boolean) => void;
    baseURL: string;
    OK: null | boolean;
    setMemo: (memo: boolean) => void;
};

export const AccessContext = createContext <access> ({
    setToken: () => {},
    token: null,
    login: "",
    setLoading: () => {},
    setOK: () => {},
    baseURL: "",
    OK: null,
    setMemo: () => {},
});

function AccessProvider({ children }: { children: React.ReactNode }) {
    const [login, setLogin] = useState<undefined | string>(undefined);
    const [password, setPassword] = useState<undefined | string>(undefined);
    const [token, setToken] = useState <string | null> (null);
    const [loading, setLoading] = useState(false);
    const [OK, setOK] = useState<boolean | null> (false);
    const [memo, setMemo] = useState<boolean | null> (false);

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

    return (
        <AccessContext.Provider value={{ setToken, token, login, setLoading, setOK, baseURL, OK, setMemo }}>
            {children}
        </AccessContext.Provider>
    );
}

export function useAccess() {
  const context = useContext(AccessContext);
  return context;
}

export default AccessProvider;