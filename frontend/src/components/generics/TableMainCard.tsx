import React, { useState } from 'react';
import { Card, CardContent, CardActions, Button, Icon } from '@mui/material';
import ReplayIcon from '@mui/icons-material/Replay';
import './TableMainCard.css';

// Accepte les props avec children
const TableMainCard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [flipped, setFlipped] = useState(false);

    const handleFlip = () => {
        setFlipped(!flipped);
    };
    
  return (
    <div className="card-container">
      <Card className={`main-card ${flipped ? 'flipped' : ''}`}>
          <CardContent>
            <CardActions>
                <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                    <Button variant="contained" color="primary" onClick={handleFlip} style={{ minWidth: 'auto', padding: '8px' }}>
                        <ReplayIcon />
                    </Button>
                </div>
            </CardActions>
            <div className="card-children-content" >
                {children}
            </div>
          </CardContent>
      </Card>
    </div>
  );
};

export default TableMainCard;
