export interface Menu {
    _id: string;
    fullName: string;
    shortName: string;
    price: number;
    category: "STARTER" | "MAIN" | "DESSERT"; 
    image: string;
}

export interface MenuBackendNoId {
    fullName: string;
    shortName: string;
    price: number;
    category: string;
    image: string;
  }