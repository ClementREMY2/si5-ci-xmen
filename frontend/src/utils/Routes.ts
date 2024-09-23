export const publicRoutes = {
    all: "*",
    login: "/login",
    notFound: "/notFound"
};

export const privateRoutes = {
    main: "/",
    home: "/home",
    events: "/events",
    profile: "/profile",
    reserveTable: "/reservation/:table",
    orderTable: "/order/:table",
    payment: "/payment/:table",
    event: "/event:id"
};