"use client"

import { createContext, use, useContext, useEffect, useLayoutEffect, useState } from "react";
import { useRouter, usePathname } from 'next/navigation';
import Header from "@/src/components/ui/header"
import Loader from "../ui/loader";
import { Vertex } from "@/src/types/vertex";

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
    setLoading: (load: boolean) => void;
    setOK: (OK: boolean) => void;
    baseURL: string;
    OK: null | boolean;
    setMemo: (memo: boolean) => void;
    setPoints: (points: Vertex[]) => void,
    points: Vertex[];
};

export const AccessContext = createContext <access> ({
    setToken: () => {},
    token: null,
    setLoading: () => {},
    setOK: () => {},
    baseURL: "",
    OK: null,
    setMemo: () => {},
    setPoints: () => {},
    points: [],
});

function AccessProvider({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState <string | null> (null);
    const [points, setPoints] = useState<Vertex[]>([]);
    const [loading, setLoading] = useState(false);
    const [OK, setOK] = useState<boolean | null> (null); 
    const [memo, setMemo] = useState<boolean | null> (false);

    const router = useRouter();
    const pathname = usePathname();
    useLayoutEffect(() => {
        if (localStorage.getItem("Token") !== null && localStorage.getItem("Token") !== "") {
            console.log(localStorage.getItem("Token"))
            setOK(true)
            setToken(localStorage.getItem("Token"))
        }
    }, [])
    useLayoutEffect(() => { 
        if (!OK && pathname !== "/discovery" && pathname !== "/register" && pathname !== "/login") {
            router.push("/login")
        }
    }, [pathname, OK, router])
    useEffect(() => {
        if (memo && token !== null) {
            localStorage.setItem("Token", token)
        }
    }, [memo])
    if (OK) {
        return (
            <AccessContext.Provider value={{ setToken, token, setLoading, setOK, baseURL, OK, setMemo, points, setPoints }}>
                <Header />
                {children}
            </AccessContext.Provider>
        );
    } else {
        return (
            <AccessContext.Provider value={{ setToken, token, setLoading, setOK, baseURL, OK, setMemo, points, setPoints }}>
                {children}
            </AccessContext.Provider>
        );
    }
}

export function useAccess() {
  const context = useContext(AccessContext);
  return context;
}

export default AccessProvider;