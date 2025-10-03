import {useState} from 'react';

export type ModalMode = 'add' | 'edit' | 'view' | 'schedule' | 'reschedule';

export function useModal<T = string>(initialMode: ModalMode = 'add') {
    const [isOpen, setIsOpen] = useState(false);
    const [mode, setMode] = useState<ModalMode>(initialMode);
    const [selectedId, setSelectedId] = useState<T | undefined>();

    const openModal = (modalMode: ModalMode = 'add', id?: T) => {
        setMode(modalMode);
        setSelectedId(id);
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
        setSelectedId(undefined);
    };

    return {
        isOpen,
        mode,
        selectedId,
        openModal,
        closeModal,
        setMode,
        setSelectedId
    };
}
