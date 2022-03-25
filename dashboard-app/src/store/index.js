import { createStore } from "vuex";

export default createStore({
  state: {
    updated: false,
    limit: 50,
    page: 1,
    orderBy: "created_at",
    orderDirection: "desc",
    filters: []
  },
  getters: {
    optionsAndFilters(state) {
      return {
        limit: state.limit,
        page: state.page,
        orderBy: state.orderBy,
        orderDirection: state.orderDirection,
        filters: state.filters
      };
    },
    filters(state) {
      return { filters: state.filters };
    },
    lastFilter(state) {
      let max = "";
      state.filters.forEach((filter) => {
        max = filter.id > max ? filter.id : max;
      });
      return max;
    },
    updated(state) {
      return state.updated;
    }
  },
  mutations: {
    setOptions(state, payload) {
      if (payload.limit || payload.page) {
        if (payload.limit) {
          state.limit = payload.limit;
        }
        if (payload.page) {
          state.page = payload.page;
        }
      } else {
        if (payload.orderBy) {
          state.orderBy = payload.orderBy;
        } else {
          state.orderBy = "";
        }
        if (payload.orderDirection) {
          state.orderDirection = payload.orderDirection;
        } else {
          state.orderDirection = "";
        }
      }
    },
    setUpdated(state, payload) {
      state.updated = payload;
    },
    addFilters(state, payload) {
      state.filters = state.filters.filter((row) => row.id !== payload.id);
      state.filters.push(payload);
    },
    removeFilters(state, payload) {
      state.filters = state.filters.filter((row) => row.id < payload.id);
    }
  },
  actions: {
    setOptions(context, payload) {
      context.commit("setOptions", payload);
    },
    addFilters(context, payload) {
      context.commit("addFilters", payload);
    },
    removeFilters(context, payload) {
      context.commit("removeFilters", payload);
    },
    setUpdated(context) {
      context.commit("setUpdated", true);
    },
    unsetUpdated(context) {
      context.commit("setUpdated", false);
    }
  }
});
