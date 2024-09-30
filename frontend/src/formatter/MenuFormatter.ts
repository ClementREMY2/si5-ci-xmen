import { GenericMenuItem, MenuBackend, MenuBackendNoId } from "../interfaces/Menu";
import { addMenu as addMenuBackend, getMenusGateway } from "../services/MenuService";

// Return a table from a backend table
const transformTableData = (dto: MenuBackend[]): GenericMenuItem[] => {
        return dto.map((menuDto) => {
                        const table: GenericMenuItem = {
                                id: menuDto._id,
                                fullName: menuDto.fullName,
                                shortName: menuDto.shortName,
                                price: menuDto.price,                
                        };

                return table;
        });
};

// Get all the menus from the backend
export const getMenus = async (): Promise<GenericMenuItem[]> => {
        const tables: MenuBackend[] = await getMenusGateway();
        return transformTableData(tables);
};

// Add a menu to the backend
export const addMenu = async (newMenuItem: MenuBackendNoId) => {
        return await addMenuBackend(newMenuItem);
};


