'use client'
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { toast } from "sonner";
import { Toaster } from 'sonner'


const SoonertToastProvider = ({ children }) => {
    const toastData = useSelector((state) => state.profiles.toast);
    console.log(toastData)
    useEffect(() => {
        if (toastData && toastData?.message) {
            switch (toastData?.type) {
                case "success":
                    toast.success(toastData?.message);
                    break;
                case "error":
                    toast.error(toastData?.message);
                    break;
                case "warning":
                    toast.warning(toastData?.message);
                    break;
                case "info":
                    toast.info(toastData?.message);
                    break;
                default:
                    toast(toastData?.message);
            }
        }
    }, [toastData]);
    return <><Toaster position="bottom-right" richColors />{children}</>;
};

export default SoonertToastProvider;