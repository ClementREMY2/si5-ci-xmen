import { useEffect } from "react";
import { useState} from "react";
import "../index.css";
import { getTables } from "../services/DiningService.ts"
import { Table, TableStatusEnum, TableWithOrderDto } from "../interfaces/Table.ts"

/*
const tablesData = [
    {id: 101, seats: 2, status: "En cours", event: "Avisto", color: ""},
    {id: 102, seats: 4, status: "Réservée", event: "Avisto", color: ""},
    {id: 103, seats: 5, status: "Réservée", event: "Avisto", color: ""},
    {id: 104, seats: 5, status: "Réservée", event: "Avisto", color: ""},
    {id: 105, seats: 6, status: "Occupée", event: "Aucun", color: ""},
    {id: 106, seats: 2, status: "Occupée", event: "Aucun", color: ""},
    {id: 107, seats: 6, status: "Occupée", event: "SAP", color: ""},
    {id: 108, seats: 4, status: "Libre", event: "Avisto", color: ""},
    {id: 109, seats: 8, status: "Prête", event: "SAP", color: ""}
];
*/

const transformTableData = (dto: TableWithOrderDto[]): Table[] => {
        return dto.map((tableDto) => {
                let status: TableStatusEnum;
                if (!tableDto.taken) {
                        status = TableStatusEnum.AVAILABLE;
                } else if (tableDto.tableOrderId) {
                        status = TableStatusEnum.ORDER_IN_PROGRESS;
                } else {
                        status = TableStatusEnum.OCCUPIED;
                }

                const table: Table = {
                        id: "" + tableDto.number,          
                        table: tableDto.number ?? 0,     
                        nbPeople: 4,               
                        status: status,             
                        event: ''
                };

                return table;
        });
};

const useFetchTables = () => {
        const [tables, setTables] = useState<Table[]>([]);
        const [error, setError] = useState<string | null>(null);
        const [loading, setLoading] = useState<boolean>(true);
      
        useEffect(() => {
          const fetchTables = async () => {
            try {
              const dataDTO = await getTables();  // Récupère les données brutes
              const dataFront = transformTableData(dataDTO);  // Transforme les données en format front
              setTables(dataFront);  // Met à jour l'état des tables
            } catch (error: any) {
              setError('Erreur lors de la récupération des tables.');
              console.error(error.message);
            } finally {
              setLoading(false);  // Indique que le chargement est terminé
            }
          };
      
          fetchTables();
        }, []);  // Exécute au montage du composant
      
        return { tables, error, loading };  // Retourne les états pour les utiliser dans le composant
};


export default useFetchTables;