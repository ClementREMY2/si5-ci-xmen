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
  { id: 11, name: 'Ice Tea', price: 3, img: 'data:image/jpeg;base64,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', type: 'drinks', quantity: 1 },
  { id: 12, name: 'Orangina', price: 3, img: 'https://www.orangina.com/sites/default/files/2019-07/bottle-visual.png', type: 'drinks', quantity: 1 },
  { id: 13, name: 'Sprite', price: 3, img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Sprite_330ml_Can.jpg/1200px-Sprite_330ml_Can.jpg', type: 'drinks', quantity: 1 },
  { id: 14, name: 'Fanta', price: 3, img: 'https://images.ctfassets.net/f5u4m4d1h98w/4BhEcAzpt3e68Swo28A44g/31bfa2364f1e44e4e5a6d8cb6eb4e156/Fanta_Orange_Flavor_1.5L.jpg', type: 'drinks', quantity: 1 },
  { id: 15, name: 'Red Bull', price: 4, img: 'https://www.ledrinks.com/media/catalog/product/cache/1/image/850x850/9df78eab33525d08d6e5fb8d27136e95/r/e/redbull_canette_25cl.jpg', type: 'drinks', quantity: 1 },
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



  const [selectedMenuItem, setSelectedMenuItem] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [totalOrders, setTotalOrders] = useState([]);
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

  const handleSendMenuItem = async () => {
    const fromOrderId = '672509396388a8b6f6269350';
    const toOrderId = '6724ff526388a8b6f6269336';

    const response = await fetch('http://localhost:3005/orders/sendMenuItem', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        menuItemId: selectedMenuItem,
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
                            onClick={() => handleSendMenuItem()}
                            style={{
                              cursor: 'pointer',
                              padding: '5px',
                              margin: '2px 0',
                              transition: 'background-color 0.3s', // Transition pour l'effet de survol
                            }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#e0e0e0'} // Couleur de fond au survol
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'} // Réinitialisation de la couleur
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