export enum MenuCategoryEnum {
    BEVERAGE = "BEVERAGE",
    STARTER = "STARTER",
    MAIN = "MAIN",
    DESSERT = "DESSERT",
    SPECIAL = "SPECIAL"
}

export interface MenuItem {
    id?: string;
    fullName: string;
    shortName: string;
    price: number;
    category: MenuCategoryEnum;
    image?: string;
}