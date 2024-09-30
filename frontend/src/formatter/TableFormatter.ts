import { GenericMenuItem } from "../interfaces/Menu";
import { Table, TableBackend, TableStatusEnum } from "../interfaces/Table";
import { getTables as getTablesGateway } from "../services/DiningService";
import { getMenus } from "./MenuFormatter";

// Return a color for a selected color
export const applyTableColors = (table: Table) => {
        if (table.status === TableStatusEnum.ORDER_IN_PROGRESS) {
                return "var(--waiting-table)";
        } else if (table.status === TableStatusEnum.RESERVED) {
                return "var(--booked-table)";
        } else if (table.status === TableStatusEnum.OCCUPIED) {
                return "var(--in-use-table)";
        } else if (table.status === TableStatusEnum.AVAILABLE) {
                return "var(--free-table)";
        } else if (table.status === TableStatusEnum.ORDER_READY) {
                return "var(--ready-table)";
        } else {
                return "#9e9e9e";
        }
};


// Return a table from a backend table
const transformTableData = (dto: TableBackend[]): Table[] => {
        return dto.map((tableDto) => {
                let status: TableStatusEnum;
                // TODO: get the status info from the backend
                status = tableDto.taken ? TableStatusEnum.OCCUPIED : TableStatusEnum.AVAILABLE;

                const table: Table = {
                        id: "" + tableDto.number,
                        table: tableDto.number ?? 0,
                        nbPeople: 4,
                        status: status
                };

                return table;
        });
};

// Update the tables with the informations stored in the backend (menus)
const updateTableWithInfosInMenus = async (tables: Table[]): Promise<Table[]> => {
        const menus: GenericMenuItem[] = await getMenus();

        for (let table of tables) {
                for (let menuItem of menus) {
                        const tablesInfos = menuItem.fullName.split("|");
                        if (tablesInfos[0] === table.table.toString()) {
                                table.nbPeople = parseInt(tablesInfos[1]);
                                table.event = tablesInfos[2];
                                table.status = tablesInfos[3] as TableStatusEnum;
                        }       
                }
        }
        return tables;
};


// Get all the tables from the backend
export const getTables = async (): Promise<Table[]> => {
        let tablesBackend: TableBackend[] = await getTablesGateway();
        let tablesFrontend: Table[] = transformTableData(tablesBackend);
        return await updateTableWithInfosInMenus(tablesFrontend);
};

// Check if a table has an order
const doesMyTableHaveAnOrder = async (table: Table): Promise<string> => {
        const tables: TableBackend[] = await getTablesGateway();
        for (const tableBackend of tables) {
                if (tableBackend.number === table.table) {
                        return tableBackend._id;
                }
        }
        return "";
}