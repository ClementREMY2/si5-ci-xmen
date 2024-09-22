import {MenuCategoryEnum, MenuItem} from "../interfaces/Menu.ts";

export const menuNormal: MenuItem[] = [
    {
        id: "1",
        fullName: "Coca-cola",
        shortName: "Coca-cola",
        price: 3,
        category: MenuCategoryEnum.BEVERAGE
    },
    {
        id: "2",
        fullName: "Ice Tea",
        shortName: "Ice Tea",
        price: 3,
        category: MenuCategoryEnum.BEVERAGE
    },
    {
        id: "3",
        fullName: "Orangina",
        shortName: "Orangina",
        price: 3,
        category: MenuCategoryEnum.BEVERAGE
    },
    {
        id: "4",
        fullName: "Eau minérale",
        shortName: "Eau M",
        price: 2,
        category: MenuCategoryEnum.BEVERAGE
    },

    {
        id: "5",
        fullName: "Salade César",
        shortName: "S César",
        price: 7,
        category: MenuCategoryEnum.STARTER
    },
    {
        id: "6",
        fullName: "Charcuterie",
        shortName: "Charcut",
        price: 8,
        category: MenuCategoryEnum.STARTER
    },
    {
        id: "7",
        fullName: "Toasts au saumon",
        shortName: "T saumon",
        price: 10,
        category: MenuCategoryEnum.STARTER
    },

    {
        id: "8",
        fullName: "Pizza Reine",
        shortName: "Pi Reine",
        price: 13,
        category: MenuCategoryEnum.MAIN
    },
    {
        id: "9",
        fullName: "Pizza Margherita",
        shortName: "Pi Margherita",
        price: 13,
        category: MenuCategoryEnum.MAIN
    },
    {
        id: "10",
        fullName: "Pâtes bolognaise",
        shortName: "Pa Bolo",
        price: 12,
        category: MenuCategoryEnum.MAIN
    },
    {
        id: "11",
        fullName: "Pâtes carbonara",
        shortName: "Pa Carbo",
        price: 12,
        category: MenuCategoryEnum.MAIN
    },
    {
        id: "12",
        fullName: "Escalope de veau",
        shortName: "E Veau",
        price: 14,
        category: MenuCategoryEnum.MAIN
    },
    {
        id: "13",
        fullName: "Loup + frites",
        shortName: "Loup + F",
        price: 15,
        category: MenuCategoryEnum.MAIN
    },

    {
        id: "14",
        fullName: "Tiramisu",
        shortName: "Tiramisu",
        price: 7,
        category: MenuCategoryEnum.DESSERT
    },
    {
        id: "15",
        fullName: "2 boules de glace",
        shortName: "2 glaces",
        price: 6,
        category: MenuCategoryEnum.DESSERT
    },
    {
        id: "16",
        fullName: "Fondant au chocolat",
        shortName: "F Choco",
        price: 7,
        category: MenuCategoryEnum.DESSERT
    }
];