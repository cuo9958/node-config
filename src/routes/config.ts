import Home from "../pages/home";
import Detail from "../pages/detail";
import Channel from "../pages/channel";
import Login from "../pages/login";
import Record from "../pages/record";
import Test from "../pages/test";

export default [
    {
        name: "home",
        path: "/",
        exact: true,
        component: Home
    },
    {
        name: "detail",
        path: "/detail",
        component: Detail
    },
    {
        name: "edit",
        path: "/edit/:id",
        component: Detail
    },
    {
        name: "channel",
        path: "/channel",
        component: Channel
    },
    {
        name: "record",
        path: "/record/:id",
        component: Record
    },
    {
        name: "login",
        path: "/login",
        component: Login
    },
    {
        name: "test",
        path: "/test",
        component: Test
    }
];
