import React, { useState, useEffect } from 'react';
import { Button, Card, CardContent, CardMedia, Typography, BottomNavigation, BottomNavigationAction } from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import DessertIcon from '@mui/icons-material/Cake';
import StarIcon from '@mui/icons-material/Star';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import { get } from 'http';
import { getMenus, getMenusBackend } from '../formatter/MenuFormatter';
import { GenericMenuItem, MenuBackend } from '../interfaces/Menu';


const initialMenuItems = [
  { id: 1, name: 'Salade César', price: 8, img: '', type: 'starters', quantity: 1 },
  { id: 2, name: 'Soupe à l’oignon', price: 7, img: '', type: 'starters', quantity: 1 },
  { id: 3, name: 'Pâtes bolo', price: 12, img: '', type: 'mains', quantity: 1 },
  { id: 4, name: 'Pâtes carbo', price: 12, img: '', type: 'mains', quantity: 1 },
  { id: 5, name: 'Escalope de veau', price: 14, img: '', type: 'mains', quantity: 1 },
  { id: 6, name: 'Coca-Cola', price: 3, img: 'https://laquintessence-traiteur.fr/cdn/shop/files/COCA_1000x.jpg?v=1699890087', type: 'drinks', quantity: 1 },
  { id: 7, name: 'Eau Minérale', price: 2, img: 'https://www.evian.com/fileadmin/user_upload/fr/hero-bottle-fr_new.png', type: 'drinks', quantity: 1 },
  { id: 8, name: 'Tiramisu', price: 6, img: '', type: 'desserts', quantity: 1 },
  { id: 9, name: 'Crème Brûlée', price: 6, img: '', type: 'desserts', quantity: 1 },
  { id: 10, name: 'Plat du Jour', price: 16, img: '', type: 'specials', quantity: 1 },

  // Nouvelles boissons
  { id: 11, name: 'Ice Tea', price: 3, img: '', type: 'drinks', quantity: 1 },
  { id: 12, name: 'Orangina', price: 3, img: '', type: 'drinks', quantity: 1 },
  { id: 13, name: 'Sprite', price: 3, img: '', type: 'drinks', quantity: 1 },
  { id: 14, name: 'Fanta', price: 3, img: '', type: 'drinks', quantity: 1 },
  { id: 15, name: 'Red Bull', price: 4, img: '', type: 'drinks', quantity: 1 },
];

const clients = [
  { name: 'Alice' },
  { name: 'Bob' },
  { name: 'Charlie' },
  { name: 'David' }
];

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState(initialMenuItems);
  const [cart, setCart] = useState<{ id: number; name: string; price: number; img: string; type: string; quantity: number }[]>([]);
  const [total, setTotal] = useState(0);
  const [navValue, setNavValue] = useState('starters');
  const [scrollPositions, setScrollPositions] = useState<{ [key: string]: number }>({
    starters: 0,
    mains: 0,
    desserts: 0,
    drinks: 0,
    specials: 0,
  });
  const [showNames, setShowNames] = useState(false);
  const [isRotated, setIsRotated] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<{ [key: number]: string }>({});


  /////////////////////////////////////////////////////////////////////////////

  // use effect to get menu items from the backend instead of the hardcoded ones
  // using getMenus from menuFormatter into genericMenuItem
  const [menuItemsBack, setMenuItemsBack] = useState<MenuBackend[]>([]);
  useEffect(() => {
    const fetchMenus = async () => {
      const menus = await getMenusBackend();
      setMenuItemsBack(menus);
    };
    fetchMenus();
  }, []);


  const [selectedMenuItem, setSelectedMenuItem] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [totalOrders, setTotalOrders] = useState<{ tableNumber: number; customerName?: string; customersCount?: number; 
    opened: string; preparations: any[]; billed: string | null; _id: string }[]>([]);
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("http://localhost:3005/orders");
        if (response.ok) {
          const ordersData = await response.json();
          setTotalOrders(ordersData);
          console.log("Commandes récupérées :", ordersData);
        } else {
          console.error("Erreur lors de la récupération des commandes.");
        }
      } catch (error) {
        console.error("Erreur de connexion à l'API :", error);
      }
    };
    fetchOrders();
  }, []);

  const handleOpenMenu = () => {
    setIsMenuOpen(prev => !prev);
  };

  const handleSendMenuItem = async (fromOrderId: string, toOrderId: string, menuItemId: string) => {
    const response = await fetch('http://localhost:3005/orders/sendMenuItem', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        menuItemId: menuItemId,
        fromOrderId: fromOrderId,
        toOrderId: toOrderId,
      }),
    });

    if (response.ok) {
      console.log('Menu item sent successfully');
    } else {
      console.error('Failed to send menu item');
    }
  };

  // lis le json de retour et vérifie par rapport au champ customerName
  const getOrderIdByClient = (clientName: string) => {
    //console.log("clientName", clientName);
    //console.log("order by name", totalOrders.find(order => order.customerName === clientName));
    return totalOrders.find(order => order.customerName === clientName)?._id;
  }

  const getOrderForTable = (tableNumber: number) => {
    //console.log("tableNumber", tableNumber);
    //console.log("order by table", totalOrders.find(order => order.tableNumber === tableNumber));
    //console.log("order by table", totalOrders.find(order => order.tableNumber === tableNumber)?._id);
    return totalOrders.find(order => order.tableNumber === tableNumber)?._id;

  }

  /////////////////////////////////////////////////////////////////////////////////




  const navigate = useNavigate();

  const addToCart = (item: { id: number; name: string; price: number; img: string; type: string; quantity: number }) => {
    setCart([...cart, { ...item, quantity: item.quantity }]);
    setTotal(total + item.price * item.quantity);
    setMenuItems(menuItems.map(menuItem =>
      menuItem.id === item.id ? { ...menuItem, quantity: 0 } : menuItem
    ));
  };

  const filteredItems = menuItems.filter(item => item.type === navValue && item.quantity > 0);

  const handlePayment = () => {
    setTotal(0);
    setCart([]);
  };

  const getItemCountByCategory = (category: string) => {
    return initialMenuItems.filter(item => item.type === category).reduce((sum, item) => sum + item.quantity, 0);
  };

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    swipeToSlide: true,
    adaptiveHeight: true,
    afterChange: (currentSlide: number) => {
      setScrollPositions(prev => ({ ...prev, [navValue]: currentSlide }));
    },
    initialSlide: scrollPositions[navValue] || 0,
  };

  // Handle page rotation
  const toggleRotation = () => {
    setIsRotated(!isRotated);
  };

  return (
    <div style={{ padding: '20px', transform: isRotated ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.5s' }}>

      {/* Container for centered buttons */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>

        {/* Button to show/hide names on hover or click */}
        <Button
          variant="outlined"
          startIcon={<GroupIcon />}
          onMouseEnter={() => setShowNames(true)}
          onMouseLeave={() => setShowNames(false)}
          onClick={() => setShowNames(!showNames)}
        >
          Show Names
        </Button>

        {/* Button to rotate the page */}
        <Button
          variant="outlined"
          startIcon={<RotateLeftIcon />}
          onClick={toggleRotation}
        >
          Rotate Page
        </Button>
      </div>
      {showNames && (
        <div style={{ textAlign: 'center', marginBottom: '10px', color: 'gray' }}>
          <Typography variant="body2">{clients.map(client => client.name).join(', ')}</Typography>
        </div>
      )}

      {filteredItems.length > 0 ? (
        <Slider {...settings} key={navValue}>
          {filteredItems.map((item) => (
            <div key={item.id} style={{ padding: '10px' }}>
              <Card style={{ backgroundColor: '#f5a623', padding: '10px', textAlign: 'center', color: 'white' }}>
                <Typography variant="body1">{item.quantity}×</Typography>
                <CardMedia component="img" height="100" image={item.img} alt={item.name} style={{ objectFit: 'contain' }} />
                <CardContent>
                  <Typography variant="h6" style={{ color: 'white' }}>{item.name}</Typography>
                  <Typography variant="body2" style={{ color: 'white' }}>{item.price}€</Typography>
                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                    <Button
                      variant="contained"
                      style={{ marginTop: '10px', color: 'black' }}
                      onClick={handleOpenMenu} // Fonction pour ouvrir le menu
                    >
                      Send to person
                    </Button>
                    <div style={{ position: 'relative' }}>
                      <ul style={{
                        display: isMenuOpen ? 'block' : 'none',
                        position: 'absolute',
                        backgroundColor: '#f9f9f9', // Couleur de fond pour la visibilité
                        listStyle: 'none',
                        padding: '10px',
                        border: '1px solid gray',
                        marginTop: '5px',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.2)', // Ombre pour un effet de profondeur
                        zIndex: 1000 // Assurez-vous que la liste soit au-dessus des autres éléments
                      }}>
                        {clients.map(client => (
                          <li
                            key={client.name}
                            onClick={() => {
                              console.log('XXX',client.name);
                              const fromOrderId = getOrderIdByClient(client.name);
                              const toOrderId = getOrderForTable(5);
                              if (fromOrderId && toOrderId) {
                                handleSendMenuItem(fromOrderId, toOrderId, item.id.toString());
                              } else {
                                console.error('Order ID not found');
                              }
                            }}
                            style={{
                              cursor: 'pointer',
                              padding: '5px',
                              margin: '2px 0',
                              transition: 'background-color 0.3s', 
                            }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#e0e0e0'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            {client.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <Button
                    variant="contained"
                    color="primary"
                    style={{ marginTop: '10px' }}
                    onClick={() => addToCart(item)}
                  >
                    Add {item.price * item.quantity}€
                  </Button>
                </CardContent>
              </Card>
            </div>
          ))}
        </Slider>
      ) : (
        <Typography variant="body1" style={{ color: 'gray', textAlign: 'center', marginTop: '20px' }}>
          Aucun article disponible dans cette catégorie.
        </Typography>
      )}

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <Typography variant="h5">Total: {total}€</Typography>
        <Button variant="contained" color="primary" onClick={handlePayment}>
          Pay {total}€
        </Button>
      </div>

      <BottomNavigation
        value={navValue}
        onChange={(event, newValue) => setNavValue(newValue)}
        showLabels
        style={{ marginTop: '20px' }}
      >
        <BottomNavigationAction label={`Starters ${getItemCountByCategory('starters')}`} icon={<FastfoodIcon />} value="starters" />
        <BottomNavigationAction label={`Mains ${getItemCountByCategory('mains')}`} icon={<RestaurantIcon />} value="mains" />
        <BottomNavigationAction label={`Desserts ${getItemCountByCategory('desserts')}`} icon={<DessertIcon />} value="desserts" />
        <BottomNavigationAction label={`Drinks ${getItemCountByCategory('drinks')}`} icon={<LocalBarIcon />} value="drinks" />
        <BottomNavigationAction label={`Specials ${getItemCountByCategory('specials')}`} icon={<StarIcon />} value="specials" />
      </BottomNavigation>
    </div>
  );
}