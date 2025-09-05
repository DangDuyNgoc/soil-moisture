import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import CreateRequestView from "../views/CreateRequestView.vue";
import RequestView from "../views/RequestView.vue";
import EditRequestView from "../views/EditRequest.vue";


const routes = [
    { path: "/", component: HomeView },
    { path: "//create-soil-moisture", component: CreateRequestView },
    { path: "/soil-moisture-records", component: RequestView },
    { path: "/edit-request/:id", component: EditRequestView, props: true },
];

export const router = createRouter({
    history: createWebHistory(),
    routes
});
