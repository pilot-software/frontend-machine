import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

interface PermissionCatalogItem {
  id: number;
  permissionCode: string;
  permissionName: string;
  category: string;
  isSystem: boolean;
}

interface OrganizationPermission {
  id: number;
  permissionCode: string;
  permissionName: string;
  organizationId: string;
  isEnabled: boolean;
}

interface PermissionsState {
  catalog: PermissionCatalogItem[];
  organizationPermissions: OrganizationPermission[];
  loading: boolean;
  error: string | null;
}

const initialState: PermissionsState = {
  catalog: [],
  organizationPermissions: [],
  loading: false,
  error: null,
};

export const fetchPermissionCatalog = createAsyncThunk(
  'permissions/fetchCatalog',
  async () => {
    const response = await fetch('http://localhost:8080/api/permissions/catalog', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch permission catalog');
    }
    return response.json();
  }
);

export const fetchOrganizationPermissions = createAsyncThunk(
  'permissions/fetchOrganizationPermissions',
  async () => {
    const response = await fetch('http://localhost:8080/api/permissions/organization/permissions', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch organization permissions');
    }
    return response.json();
  }
);

const permissionsSlice = createSlice({
  name: 'permissions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPermissionCatalog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPermissionCatalog.fulfilled, (state, action) => {
        state.loading = false;
        state.catalog = action.payload;
      })
      .addCase(fetchPermissionCatalog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch permission catalog';
      })
      .addCase(fetchOrganizationPermissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrganizationPermissions.fulfilled, (state, action) => {
        state.loading = false;
        state.organizationPermissions = action.payload;
      })
      .addCase(fetchOrganizationPermissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch organization permissions';
      });
  },
});

export default permissionsSlice.reducer;