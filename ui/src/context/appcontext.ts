import { createContext } from "react"

export interface AppContextType {
    darkmode: boolean,
    setDarkmode: (darkmode: boolean) => void,
}

export const AppContext = createContext<AppContextType>({} as any)