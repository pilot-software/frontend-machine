'use client';

import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from './ui/select';
import {useBranch} from './BranchContext';
import {useAuth} from './AuthContext';

export function BranchSelector() {
  const { branches, selectedBranch, selectBranch, isLoading, hasBranches } = useBranch();
  const { user } = useAuth();

  // Hide selector if no branches or single branch
  if (!hasBranches || branches.length <= 1) return null;

  const isMainAdmin = user?.role === 'admin' && branches.length > 1;

  return (
    <Select value={selectedBranch} onValueChange={selectBranch} disabled={isLoading}>
      <SelectTrigger className="w-48">
        <SelectValue placeholder="Select branch" />
      </SelectTrigger>
      <SelectContent>
        {isMainAdmin && (
          <SelectItem value="all">All Branches</SelectItem>
        )}
        {branches.map(branch => (
          <SelectItem key={branch.id} value={branch.id}>
            {branch.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
