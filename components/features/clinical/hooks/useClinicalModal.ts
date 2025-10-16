import { useState, useCallback } from "react";
import { ClinicalModalState, ClinicalModalType, VitalSigns, LabResult, Diagnosis, TreatmentPlan } from "../types/clinical.types";

export function useClinicalModal() {
  const [modal, setModal] = useState<ClinicalModalState>({
    isOpen: false,
    type: null,
    data: null,
  });

  const openModal = useCallback((
    type: ClinicalModalType,
    data: VitalSigns | LabResult | Diagnosis | TreatmentPlan
  ) => {
    setModal({ isOpen: true, type, data });
  }, []);

  const closeModal = useCallback(() => {
    setModal({ isOpen: false, type: null, data: null });
  }, []);

  return { modal, openModal, closeModal };
}
