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
    paymentEvent: "/payment/event/:event",
    event: "/event/:id",
    multiPage: "/table/:tableNumber",
    personalPage: "/client/:tableNumber/:customerName",
    sideGroup: "/sideGroup",
    paymentPoc: "/payment/poc/:orderId",
    table: "/table/:tableNumber/:customerName",
};