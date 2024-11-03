import React, { useState, useEffect } from 'react';
import { Button, Card, CardContent, CardMedia, Typography, BottomNavigation, BottomNavigationAction, Menu, Box } from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import DessertIcon from '@mui/icons-material/Cake';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import GroupIcon from '@mui/icons-material/Group';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import { useNavigate, useParams } from 'react-router-dom';
import Slider from 'react-slick';
import { getMenusBackend } from '../formatter/MenuFormatter';
import {  MenuBackend, MenuCategoryEnumBackend } from '../interfaces/Menu';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { table } from 'console';

export default function PersonalPage() {
  const { tableNumber, customerName } = useParams<Record<string, string | undefined>>();

  const tablenumber = tableNumber ? parseInt(tableNumber, 10) : null;
  const client = customerName ? customerName : "";
  
  const [menuItems, setMenuItems] = useState<(MenuBackend)[]>([]);
  const [cart, setCart] = useState<(MenuBackend)[]>([]);
  const [total, setTotal] = useState(0);
  const [navValue, setNavValue] = useState(MenuCategoryEnumBackend.STARTER);
  const [scrollPositions, setScrollPositions] = useState<{ [key: string]: number }>({
    BEVERAGE: 0,
    STARTER: 0,
    MAIN: 0,
    DESSERT: 0,
  });
  const [showNames, setShowNames] = useState(false);
  const [isRotated, setIsRotated] = useState(false);

  /////////////////////////////////////////////////////////////////////////////

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

  // use effect to get menu items from the backend instead of the hardcoded ones
  // using getMenus from menuFormatter into genericMenuItem
  const [menuItemsBack, setMenuItemsBack] = useState<MenuBackend[]>([]);
  useEffect(() => {

    const fetchMenus = async () => {
      const menus = await getMenusBackend();
      //console.log("menus backend", menus);
      setMenuItemsBack(menus);
    };
    fetchMenus();
  }, [totalOrders]);

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

  const handleSelfBill = async (orderId: string) => {
    // localhost:3005/orders/billOrder/:orderId
    const response = await fetch(`http://localhost:3005/orders/billOrder/${orderId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      console.log('Personal bill sent successfully');
    } else {
      console.error('Failed to send personal bill');
    }
  };

  const getSelfOrderId = () => {
    return totalOrders.find(order => order.tableNumber === tablenumber && order.customerName === client)?._id;
  }

  // lis le json de retour et vérifie par rapport au champ customerName
  const getOrderIdByClient = (clientName: string) => {
    //console.log("clientName", clientName);
    //console.log("order by name", totalOrders.find(order => order.customerName === clientName));
    return totalOrders.find(order => order.customerName === clientName && order.tableNumber === tablenumber)?._id;
  }

  const getOrderForTable = (tableNumber: number) => {
    //console.log("tableNumber", tableNumber);
    //console.log("order by table", totalOrders.find(order => order.tableNumber === tableNumber));
    //console.log("order by table", totalOrders.find(order => order.tableNumber === tableNumber)?._id);
    return totalOrders.find(order => order.tableNumber === tableNumber && order.customerName === undefined)?._id;
  }
  
  // itérer sur tous les menusItemBack pour récupérer uniquement ceux dont leur id est dans les préparations de l'order
  const getPreparationsByOrderId = () => {
    const preparations = totalOrders.find(order => order.tableNumber === tablenumber && order.customerName === client)?.preparations;
    // TODO CHANGE id
    //  console.log("info", totalOrders.find(order => order.tableNumber === 5 && order._id === "67260377865ddc8ab26116d8")?.preparations);
    const preparationsMenuItems = preparations?.map(preparation => {
      const menuItem = menuItemsBack.find(menuItem => menuItem._id == preparation);
      return menuItem;
    });
    return preparationsMenuItems;
  }

  useEffect(() => {
    if (!totalOrders.length) return;

    const preparations = getPreparationsByOrderId();

    if (preparations) {
      setMenuItems(preparations as (MenuBackend)[]);
    }
  }, [totalOrders]);

    

  /////////////////////////////////////////////////////////////////////////////////

  const navigate = useNavigate();

  const getItemCountByCategory = (category: MenuCategoryEnumBackend) => {
    //console.log("menuItems", menuItems);
    //console.log("fnejfenojzf" + menuItems.filter(item => item.category === category).reduce((sum, item) => sum, 0));
    return menuItems.filter(item => item.category === category).length;
  };

  const addToCart = (item: MenuBackend) => {
    // remove item from menuItems
    setMenuItems(menuItems.filter(menuItem => menuItem._id !== item._id));
    setCart([...cart, item]);
    setTotal(total + item.price);
    // faire cette requete : localhost:3005/orders/billOrder/:orderId
  }

  /*
  const addToCart = (item: { id: number; name: string; price: number; img: string; type: string; quantity: number }) => {
    setCart([...cart, { ...item, quantity: item.quantity }]);
    setTotal(total + item.price * item.quantity);
    setMenuItems(menuItems.map((menuItem: MenuBackend & { quantity: number }) =>
      menuItem._id === item.id.toString() ? { ...menuItem, quantity: 0 } : menuItem
    ));
  };
  */

  const handlePayment = () => {
    setTotal(0);
    setCart([]);
    let count: number = 0;
    for (const enumContent in MenuCategoryEnumBackend) {
      count += getItemCountByCategory(MenuCategoryEnumBackend[enumContent as keyof typeof MenuCategoryEnumBackend]);
    }
     if (count === 0) {
      const selfOrderId = getSelfOrderId();
      if (selfOrderId) {
        handleSelfBill(selfOrderId);
      } else {
        console.error('Self order ID not found');
      }
     }
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
      if (navValue) {
        setScrollPositions(prev => ({ ...prev, [navValue]: currentSlide }));
      }
    },
    initialSlide: navValue ? scrollPositions[navValue] || 0 : 0,
  };

  // Handle page rotation
  const toggleRotation = () => {
    setIsRotated(!isRotated);
  };

  /*
  const [order, setOrder] = useState<Order>({total: 0, items: {}, itemsEvent: {}, datetime: new Date()});
  const [tip, setTip] = useState<number>(0);

  useEffect(() => {
        
  }   , [order]);
  const [paying, setPaying] = useState<Order>({
      total: 0,
      items: {},
      itemsEvent: {},
      datetime: new Date()
  });
  const [paid, setPaid] = useState<Order>({
      total: 0,
      items: {},
      itemsEvent: {},
      datetime: new Date()

  });

  const card: React.ReactNode = (
    <Box display={"flex"} flexDirection={"column"} justifyContent={"center"} alignItems={"center"} height={"100%"}>
        <ActionCardGeneric
            title={'Table ' + tablenumber}
            rightTitle={`right title €`}
            mainContent={<PaymentList order={order} paying={paying} changePayingQuantity={changePayingQuantity}
                                      addAllToPaying={addAllToPaying} paid={paid} tip={0} changeTip={setTip}/>}
            buttons={
                <Button onClick={handlePayment} variant={"contained"} sx={{width: "200px"}}>
                    Payer {paying.total + (isNaN(tip) ? 0 : tip)} €
                </Button>
            }
            minWidth={"95%"}
            minHeight={"95%"}
        />
    </Box>
);
*/

  let filteredMenuItems = menuItems.filter(menuItem => menuItem.category === navValue);

  return (
    <div style={{ padding: '20px', transform: isRotated ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.5s' }}>

      {/* Container for centered buttons */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>

        {/* Button to show/hide names on hover or click */}
        <Button
          variant="outlined"
          startIcon={<GroupIcon />}
        >
          {client}
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
      {(
        <div style={{ textAlign: 'center', marginBottom: '10px', color: 'gray' }}>
          <Typography variant="body2">{client}</Typography>
        </div>
      )}
      {filteredMenuItems.length > 0 ? (
        <Slider {...settings} key={navValue}>
          {filteredMenuItems.map((item: MenuBackend) => (
            <div key={item._id} style={{ padding: '10px' }}>
              <Card style={{ backgroundColor: '#f5a623', padding: '10px', textAlign: 'center', color: 'white' }}>
                <Typography variant="body1">{}×</Typography>
                <CardMedia component="img" height="100" image={""} alt={item.fullName} style={{ objectFit: 'contain' }} />
                <CardContent>
                  <Typography variant="h6" style={{ color: 'white' }}>{item.fullName}</Typography>
                  <Typography variant="body2" style={{ color: 'white' }}>{item.price}€</Typography>
                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                    <Button
                      variant="contained"
                      style={{ marginTop: '10px', color: 'black' }}
                      onClick={() => {
                        const fromOrderId = getOrderIdByClient(client);
                        console.log("fromOrderId", fromOrderId);

                        const toOrderId = tablenumber !== null ? getOrderForTable(tablenumber) : null;
                        console.log("toOrderId", toOrderId);

                        console.log("item._id", item._id);  

                        if (fromOrderId && toOrderId) {
                          handleSendMenuItem(fromOrderId, toOrderId, item._id);
                        } else {
                          console.error('Order ID not found');
                        }
                      }} // Fonction pour ouvrir le menu
                    >
                      Send to table
                    </Button>
                  </div>

                  <Button
                    variant="contained"
                    color="primary"
                    style={{ marginTop: '10px' }}
                    onClick={() => addToCart(item)}
                  >
                    {item && `Add ${item.price}€`}
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
        <BottomNavigationAction label={`Starters ${getItemCountByCategory(MenuCategoryEnumBackend.STARTER)}`} icon={<FastfoodIcon />} value="STARTER" />
        <BottomNavigationAction label={`Mains ${getItemCountByCategory(MenuCategoryEnumBackend.MAIN)}`} icon={<RestaurantIcon />} value="MAIN" />
        <BottomNavigationAction label={`Desserts ${getItemCountByCategory(MenuCategoryEnumBackend.DESSERT)}`} icon={<DessertIcon />} value="DESSERT" />
        <BottomNavigationAction label={`Drinks ${getItemCountByCategory(MenuCategoryEnumBackend.DESSERT)}`} icon={<LocalBarIcon />} value="BEVERAGE" />
      </BottomNavigation>
    </div>
  );
}