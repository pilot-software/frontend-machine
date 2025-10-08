"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@/components/providers/AuthContext";
import { apiClient } from "@/lib/api";

interface Branch {
  id: string;
  name: string;
  code: string;
  isMain: boolean;
}

interface BranchContextType {
  branches: Branch[];
  selectedBranch: string;
  selectBranch: (branchId: string) => void;
  isLoading: boolean;
  hasBranches: boolean;
}

const BranchContext = createContext<BranchContextType | undefined>(undefined);

export function BranchProvider({ children }: { children: React.ReactNode }) {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(false);
  const { user, token } = useAuth();

  useEffect(() => {
    if (user && token) {
      fetchBranches();
    }
  }, [user, token]);

  const fetchBranches = async () => {
    setIsLoading(true);
    try {
      const branchData = await apiClient.getBranches();
      setBranches(branchData);
      // Auto-select single branch for branch managers
      if (branchData.length === 1) {
        setSelectedBranch(branchData[0].id);
      }
    } catch {
      // Orgs without branches (like PedCare) return empty array
      setBranches([]);
    } finally {
      setIsLoading(false);
    }
  };

  const selectBranch = (branchId: string) => {
    setSelectedBranch(branchId);
  };

  const hasBranches = branches.length > 0;

  return (
    <BranchContext.Provider
      value={{ branches, selectedBranch, selectBranch, isLoading, hasBranches }}
    >
      {children}
    </BranchContext.Provider>
  );
}

export function useBranch() {
  const context = useContext(BranchContext);
  if (!context) {
    throw new Error("useBranch must be used within BranchProvider");
  }
  return context;
}
