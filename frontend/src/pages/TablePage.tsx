import React from 'react';
import { useParams } from 'react-router-dom';
import TableMainCard from '../components/generics/TableMainCard';

const TablePage: React.FC = () => {
    const { tableNumber, customerName } = useParams<{ tableNumber: string; customerName: string }>();

    return (
        <>  
        <TableMainCard>
            <h1>Table Page</h1>
            <p>Welcome to the Table Page!</p>
            <p>Table Number: {tableNumber}</p>
            <p>Customer Name: {customerName}</p>
        </TableMainCard>
        </>
    );
};

export default TablePage;