import { MenuItem } from './MenuItem';

export interface Menu {
    entree: MenuItem;
    mainCourse: MenuItem;
    dessert: MenuItem;
    drink1: MenuItem;
    drink2: MenuItem;
    price: number;
}