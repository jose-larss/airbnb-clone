import {create} from "zustand";

interface LoginModalStore {
    isOpen: boolean;
    onOpen: (onSuccess?: () => void) => void
    onClose: () => void;
    onSuccess?: () => void
}

const useLoginModal = create<LoginModalStore>((set) => ({
    onSuccess: undefined,
    isOpen: false,
    onOpen: (onSuccess) => set({isOpen:true, onSuccess }),
    onClose: () => set({isOpen:false, onSuccess: undefined }),
}))

export default useLoginModal