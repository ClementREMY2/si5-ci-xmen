import React, { createContext, useState, useContext } from 'react';

interface PopupContextType {
    message: string;
    showPopup: boolean;
    setPopup: (message: string) => void;
    hidePopup: () => void;
}

const PopupContext = createContext<PopupContextType | undefined>(undefined);

interface PopupProviderProps {
    children: React.ReactNode;
}

export const PopupProvider: React.FC<PopupProviderProps> = ({ children }) => {
    const [message, setMessage] = useState<string>('');
    const [showPopup, setShowPopup] = useState<boolean>(false);

    const setPopup = (message: string) => {
        setMessage(message);
        setShowPopup(true);
    };

    const hidePopup = () => {
        setShowPopup(false);
    };

    return (
        <PopupContext.Provider value={{ message, showPopup, setPopup, hidePopup }}>
            {children}
        </PopupContext.Provider>
    );
};

export const usePopup = () => {
    const context = useContext(PopupContext);
    if (!context) {
        throw new Error('usePopup must be used within a PopupProvider');
    }
    return context;
};