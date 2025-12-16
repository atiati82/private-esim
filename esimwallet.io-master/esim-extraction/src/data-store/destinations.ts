import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { routeChangedAction, RouterState } from '@/data-store/router/router';
import { RootState } from '@/data-store/store';

export interface DestinationsState {
  searchQuery: string;
  /**
   * List of recently visited destinations (as destination slugs).
   * Can be used to move these to the top of destinations list on home page.
   */
  recentDestinations: string[];
}
const initialState: DestinationsState = {
  searchQuery: '',
  recentDestinations: [],
};

export const destinationsSlice = createSlice({
  name: 'destinations',
  initialState,
  reducers: {
    searchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    addRecentDestination: (state, action: PayloadAction<string>) => {
      state.recentDestinations = reduceToRecentDestinations(
        action.payload,
        state.recentDestinations,
      );
    },
  },
  extraReducers: (builder) => {
    // Listen to router change and extract recently visited destination there
    builder.addCase(routeChangedAction, (state, action: PayloadAction<RouterState>) => {
      const visitedDestination = action.payload.params.destination;
      if (visitedDestination) {
        state.recentDestinations = reduceToRecentDestinations(
          visitedDestination,
          state.recentDestinations,
        );
      }
    });
  },
});

const MaxRecentDestinations = 3;
const reduceToRecentDestinations = (
  newDestination: string | string[],
  currentRecentDestinations: string[],
): string[] => {
  // Put most recent destination to the top
  const newRecentDestinations = [
    ...((Array.isArray(newDestination) && newDestination) || [newDestination]),
    ...currentRecentDestinations,
  ];
  // Remove duplicated destinations, only store last X num of destinations
  return [...new Set(newRecentDestinations)].slice(0, MaxRecentDestinations);
};

export const selectSearchQuery = (state: RootState): string => {
  return state.destinations.searchQuery;
};
export const selectRecentDestinations = (state: RootState): string[] => {
  return state.destinations.recentDestinations;
};

export const { addRecentDestination, searchQuery } = destinationsSlice.actions;
export const { reducer: destinationsReducer } = destinationsSlice;
