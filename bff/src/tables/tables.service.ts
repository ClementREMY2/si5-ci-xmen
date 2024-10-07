import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { table } from 'console';
import { Menu, MenuBackendNoId } from 'src/interfaces/back/menu.interface';
import { TableBackend } from 'src/interfaces/back/table.interface';
import { GenericMenuItem } from 'src/interfaces/front/menu.interfaces';
import { Table, TableStatusEnum } from 'src/interfaces/front/table.interface';
import { findAllMenus } from 'src/utils/encode64-utils';
import { json } from 'stream/consumers';

@Injectable()
export class TablesService {
    private readonly tables = [];

    // méthode tableFromBackToFront qui retourne un tableau de Table[]
    tableFromBackToFront = async (data): Promise<Table[]> => {
        const backendTables: TableBackend[] = this.getBackendTableFromData(data);
        const tables: Table[] = this.transformTableData(backendTables);
        return await this.updateTableWithInfosInMenus(tables);
    };

    getBackendTableFromData = (data): TableBackend[] => {  
        return data.map((item: any) => ({
            _id: item._id,
            number: item.number,
            taken: item.taken,
            tableOrderId: item.tableOrderId,
          })) as TableBackend[];
    } 
        
    // Return a table from a backend table
    transformTableData = (dto: TableBackend[]): Table[] => {
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
    updateTableWithInfosInMenus = async (tables: Table[]): Promise<Table[]> => {
        let menus: Menu[] = await axios.get('http://localhost:9500/menu/menus').then(response => response.data);
        console.log("zzz" + menus);

        menus = menus.filter(m => m.fullName.charAt(0) === '_');

        for (let table of tables) {
            let copyMenus = menus;
            copyMenus = copyMenus.filter(m => m.fullName.split("|")[1] === table.table.toString());
            copyMenus.sort((a, b) => {
                const shortNameA = a.shortName.split("|");
                const shortNameB = b.shortName.split("|");
                return parseInt(shortNameB[0]) - parseInt(shortNameA[0]);
            });

            if (copyMenus[0] != undefined) {
                const fullName = copyMenus[0].fullName.split("|");

                table.nbPeople = parseInt(fullName[2]);
                table.event = fullName[3];
                table.status = fullName[4] as TableStatusEnum
            }
        }
        return tables;
    };

    // Return a table from a backend table
    transformMenuData = (dto: Menu[]): GenericMenuItem[] => {
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

    getTables = async () => {
        try {
                const response = await axios.get('http://localhost:9500/dining/tables');
                const data = response.data;

                return data.map((item: any) => ({
                        _id: item._id,
                        number: item.number,
                        taken: item.taken,
                        tableOrderId: item.tableOrderId,
                      })) as TableBackend[];
        } catch (error) {
                console.error('Erreur lors de la récupération des tables:', error);
                throw error;
        }
    };

    async findAll(): Promise<Table[]> {
        try {
            const response = await axios.get('http://localhost:9500/dining/tables');
            return this.tableFromBackToFront(response.data);
        } catch (error) {
            throw new Error(`Failed to fetch tables: ${error.message}`);
        }
    }

    async update(table: Table): Promise<Menu> {
        try {
            const modifiedTable = table;
            const menus = await axios.get('http://localhost:9500/menu/menus').then(response => response.data);

            const newMenu: MenuBackendNoId = {
                fullName: "_|" + modifiedTable.table + "|" + modifiedTable.nbPeople + "|" + modifiedTable.event + "|" + modifiedTable.status,
                shortName: menus.length + "|" + modifiedTable.table + "|" + modifiedTable.nbPeople + "|" + modifiedTable.event + "|" + modifiedTable.status,
                price: 1,
                category: "DESSERT",
                image: "https://cdn.pixabay.com/photo/2016/11/12/15/28/restaurant-1819024_960_720.jpg"
            }

            console.log(newMenu);
            const response = await axios.post(`http://localhost:9500/menu/menus`, newMenu);
            return response.data;
        } catch (error) {
            throw new Error(`Failed to update table: ${error.message}`);
        }
    }


}
