import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { csrfFetch } from './csrf';


export const createSousChef = createAsyncThunk(
	'sousChefs/create',
	async (sousChefData, { rejectWithValue }) => {
		try {
			const response = await csrfFetch('/api/souschefs', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(sousChefData),
			});
			if (!response.ok) {
				const errorData = await response.json();
				return rejectWithValue(errorData);
			}
			const data = await response.json();
			return data;
		} catch (error) {
			return rejectWithValue({
				message: 'Failed to create SousChef. Please try again.',
			});
		}
	}
);


export const getSousChef = createAsyncThunk(
	'sousChefs/get',
	async (_, { rejectWithValue }) => {
		try {
			const response = await csrfFetch('/api/souschefs');
			if (!response.ok) {
				return rejectWithValue('Failed to fetch SousChef.');
			}
			const data = await response.json();
			return data.sousChef;
		} catch (error) {
			return rejectWithValue('Failed to fetch SousChef.');
		}
	}
);


export const updateSousChef = createAsyncThunk(
	'sousChefs/update',
	async ({ sousChefId, sousChefData }, { rejectWithValue }) => {
		try {
			const response = await csrfFetch(`/api/souschefs/${sousChefId}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(sousChefData),
			});
			if (!response.ok) {
				const errorData = await response.json();
				return rejectWithValue(errorData);
			}
			const data = await response.json();
			return data;
		} catch (error) {
			return rejectWithValue({
				message: 'Failed to update SousChef. Please try again.',
			});
		}
	}
);

export const updateSousChefXP = createAsyncThunk(
	'sousChefs/updateXP',
	async ({ sousChefId, xp }, { rejectWithValue }) => {
		try {
			const response = await csrfFetch(`/api/souschefs/${sousChefId}/xp`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ xp }),
			});
			if (!response.ok) {
				const errorData = await response.json();
				return rejectWithValue(errorData);
			}
			const data = await response.json();
			return data;
		} catch (error) {
			return rejectWithValue('Failed to update XP in SousChef.');
		}
	}
);

const sousChefSlice = createSlice({
	name: 'sousChefs',
	initialState: { sousChef: null, status: 'idle', error: null },
	reducers: {
		setSousChef: (state, action) => {
			state.sousChef = action.payload;
		},
		clearSousChef: (state) => {
			state.sousChef = null;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(createSousChef.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(createSousChef.fulfilled, (state, action) => {
				state.status = 'succeeded';
				state.sousChef = action.payload;
			})
			.addCase(createSousChef.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.payload;
			})
			.addCase(getSousChef.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(getSousChef.fulfilled, (state, action) => {
				state.status = 'succeeded';
				state.sousChef = action.payload;
			})
			.addCase(getSousChef.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.payload;
			})
			.addCase(updateSousChef.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(updateSousChef.fulfilled, (state, action) => {
				state.status = 'succeeded';
				state.sousChef = action.payload;
			})
			.addCase(updateSousChef.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.payload;
			});
	},
});


export const { setSousChef, clearSousChef } = sousChefSlice.actions;
export default sousChefSlice.reducer;
