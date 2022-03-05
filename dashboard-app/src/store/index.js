import { createStore } from "vuex";

export default createStore({
  state: {
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
    addFilters(state, payload) {
      state.filters = state.filters.filter((row) => row.id !== payload.id);
      state.filters.push(payload);
    },
    removeFilters(state) {
      state.filters = [];
    }
  },
  actions: {
    setOptions(context, payload) {
      context.commit("setOptions", payload);
    },
    addFilters(context, payload) {
      context.commit("addFilters", payload);
    },
    removeFilters(context) {
      context.commit("removeFilters");
    }
  }
});
