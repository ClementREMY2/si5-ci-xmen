import React, { useState } from 'react';
import { Button, Card, CardContent, CardMedia, Typography, BottomNavigation, BottomNavigationAction } from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import DessertIcon from '@mui/icons-material/Cake';
import StarIcon from '@mui/icons-material/Star';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';

const initialMenuItems = [
  { id: 1, name: 'Salade César', price: 8, img: 'https://www.academiedugout.fr/images/6205/1200-auto/focus.jpg', type: 'starters', quantity: 1 },
  { id: 2, name: 'Soupe à l’oignon', price: 7, img: 'https://assets.afcdn.com/recipe/20211006/123278_w1024h576c1cx2781cy1854cxt0cyt0cxb5562cyb3708.webp', type: 'starters', quantity: 1 },
  { id: 3, name: 'Pâtes bolo', price: 12, img: 'https://www.regal.fr/sites/art-de-vivre/files/pates-bolognaise.jpg', type: 'mains', quantity: 1 },
  { id: 4, name: 'Pâtes carbo', price: 12, img: 'https://www.unileverfoodsolutions.fr/dam/global-ufs/mcos/WEU/unilever-food-solutions/fr/recipes/recette-de-spaghetti-carbonara/main-header.jpg', type: 'mains', quantity: 1 },
  { id: 5, name: 'Escalope de veau', price: 14, img: 'https://img.cuisineaz.com/660x660/2016/11/17/i120668-escalope-de-veau-a-la-creme.jpeg', type: 'mains', quantity: 1 },
  { id: 6, name: 'Coca-Cola', price: 3, img: 'https://laquintessence-traiteur.fr/cdn/shop/files/COCA_1000x.jpg?v=1699890087', type: 'drinks', quantity: 1 },
  { id: 7, name: 'Eau Minérale', price: 2, img: 'https://www.evian.com/fileadmin/user_upload/fr/hero-bottle-fr_new.png', type: 'drinks', quantity: 1 },
  { id: 8, name: 'Tiramisu', price: 6, img: 'https://www.schaer.com/sites/default/files/2022-02/Tiramisu_0.jpg', type: 'desserts', quantity: 1 },
  { id: 9, name: 'Crème Brûlée', price: 6, img: 'https://www.lacuisinedelidl.be/img/recipes/3887/3887_l.jpg', type: 'desserts', quantity: 1 },
  { id: 10, name: 'Plat du Jour', price: 16, img: 'https://www.cuisineactuelle.fr/assets/var/cuisineactuelle/storage/images/article/plat-du-jour-205065/8840404-1-fre-FR/plat-du-jour.jpg', type: 'specials', quantity: 1 },
  
  // Nouvelles boissons
  { id: 11, name: 'Ice Tea', price: 3, img: 'https://www.lipton.com/content/dam/unilever/lipton/fr/fr/homepage/Product_Shots/ice_tea_peche_1l_bouteille.png', type: 'drinks', quantity: 1 },
  { id: 12, name: 'Orangina', price: 3, img: 'https://www.orangina.com/sites/default/files/2019-07/bottle-visual.png', type: 'drinks', quantity: 1 },
  { id: 13, name: 'Sprite', price: 3, img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Sprite_330ml_Can.jpg/1200px-Sprite_330ml_Can.jpg', type: 'drinks', quantity: 1 },
  { id: 14, name: 'Fanta', price: 3, img: 'https://images.ctfassets.net/f5u4m4d1h98w/4BhEcAzpt3e68Swo28A44g/31bfa2364f1e44e4e5a6d8cb6eb4e156/Fanta_Orange_Flavor_1.5L.jpg', type: 'drinks', quantity: 1 },
  { id: 15, name: 'Red Bull', price: 4, img: 'https://www.ledrinks.com/media/catalog/product/cache/1/image/850x850/9df78eab33525d08d6e5fb8d27136e95/r/e/redbull_canette_25cl.jpg', type: 'drinks', quantity: 1 },
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

  const navigate = useNavigate();

  const addToCart = (item: { id: number; name: string; price: number; img: string; type: string; quantity: number }) => {
    setCart([...cart, { ...item, quantity: item.quantity }]);
    setTotal(total + item.price * item.quantity);
    setMenuItems(menuItems.map(menuItem => 
      menuItem.id === item.id ? { ...menuItem, quantity: 0 } : menuItem
    ));
  };

  const incrementQuantity = (id: number) => {
    setMenuItems(menuItems.map(item =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    ));
  };

  const decrementQuantity = (id: number) => {
    setMenuItems(menuItems.map(item =>
      item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
    ));
  };

  const filteredItems = menuItems.filter(item => item.type === navValue && item.quantity > 0);

  const handlePayment = () => {
    setTotal(0);
    setCart([]);
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

  return (
    <div style={{ padding: '20px' }}>
      {filteredItems.length > 0 ? (
        // Ajout de la clé pour forcer la réinitialisation du slider
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

      <Button variant="outlined" style={{ marginTop: '20px' }}>
        Samuel 
      </Button>

      <BottomNavigation
        value={navValue}
        onChange={(event, newValue) => setNavValue(newValue)}
        showLabels
        style={{ marginTop: '20px' }}
      >
        <BottomNavigationAction label="Starters" icon={<FastfoodIcon />} value="starters" />
        <BottomNavigationAction label="Mains" icon={<RestaurantIcon />} value="mains" />
        <BottomNavigationAction label="Desserts" icon={<DessertIcon />} value="desserts" />
        <BottomNavigationAction label="Drinks" icon={<LocalBarIcon />} value="drinks" />
        <BottomNavigationAction label="Specials" icon={<StarIcon />} value="specials" />
      </BottomNavigation>
    </div>
  );
}