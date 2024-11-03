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

const clients: string[] = [];

let canGetNames = true;

export default function MenuPage() {
  const { tableNumber } = useParams<Record<string, string | undefined>>();
  const tablenumber = tableNumber ? parseInt(tableNumber, 10) : null;
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

   useEffect(() => {
    if (!canGetNames) return;
    const getAllCustomersNameByTableNumber = (tableNumber: number | null) => {
      if (canGetNames && tableNumber !== null) {
        clients.push(...totalOrders.filter(order => order.tableNumber === tableNumber && order.customerName !== undefined)
          .map(order => order.customerName as string));
        canGetNames = false;
      }
    };

    getAllCustomersNameByTableNumber(tablenumber);

  }, [totalOrders, tablenumber]);



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

  const handleGroupBill = async (orderId: string) => {
    // localhost:3005/orders/billOrder/:orderId
    const response = await fetch(`http://localhost:3005/orders/billOrder/${orderId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      console.log('Group bill sent successfully');
    } else {
      console.error('Failed to send group bill');
    }
  };

  // lis le json de retour et vérifie par rapport au champ customerName
  const getOrderIdByClient = (clientName: string) => {
    //console.log("clientName", clientName);
    //console.log("order by name", totalOrders.find(order => order.customerName === clientName));
    return totalOrders.find(order => order.customerName === clientName && order.tableNumber === tablenumber)?._id;
  }

  const getOrderForTable = (tableNumber: number | null) => {
    //console.log("tableNumber", tableNumber);
    //console.log("order by table", totalOrders.find(order => order.tableNumber === tableNumber));
    //console.log("order by table", totalOrders.find(order => order.tableNumber === tableNumber)?._id);
    return totalOrders.find(order => order.tableNumber === tableNumber && order.customerName === undefined)?._id;
  }


  // itérer sur tous les menusItemBack pour récupérer uniquement ceux dont leur id est dans les préparations de l'order
  const getPreparationsByOrderId = () => {
    const preparations = totalOrders.find(order => order.tableNumber === tablenumber && order.customerName === undefined)?.preparations;
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


    if (!totalOrders.some(order => order.tableNumber === tablenumber && order.customerName === undefined)) {
      const createOrder = async () => {
        const response = await fetch('http://localhost:9500/dining/tableOrders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            tableNumber: tablenumber,
            customersCount: 2
          }),
        });

        if (response.ok) {
          const newOrder = await response.json();
          setTotalOrders(prevOrders => [...prevOrders, newOrder]);
          console.log('New order created:', newOrder);
        } else {
          console.error('Failed to create new order');
        }
      };

      createOrder();
    }

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
      const orderId = getOrderForTable(tablenumber);
      if (orderId) {
        handleGroupBill(orderId);
      } else {
        console.error('Order ID not found');
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
      setScrollPositions(prev => ({ ...prev, [navValue]: currentSlide }));
    },
    initialSlide: scrollPositions[navValue] || 0,  // Utilise la position mémorisée pour chaque catégorie
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
    <div style={{ padding: '20px', transform: isRotated ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.5s', height: "100vh" }}>

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
          Show Name
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
          <Typography variant="body2">{clients.map(client => client).join(', ')}</Typography>
        </div>
      )}
      {filteredMenuItems.length > 0 ? (
        <Slider {...settings} key={navValue}>
          {filteredMenuItems.map((item: MenuBackend) => (
            <div key={item._id} style={{ padding: '10px' }}>
              <Card style={{ backgroundColor: '#f5a623', padding: '10px', textAlign: 'center', color: 'white' }}>
                <Typography variant="body1">{}×</Typography>
                <CardMedia component="img" height="100" image={item.image} alt={item.fullName} style={{ objectFit: 'contain' }} />
                <CardContent>
                  <Typography variant="h6" style={{ color: 'white' }}>{item.fullName}</Typography>
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
                            key={client}
                            onClick={() => {
                              const fromOrderId = getOrderForTable(tablenumber);
                              console.log("fromOrderId", fromOrderId);
                              const toOrderId = getOrderIdByClient(client);
                              console.log("toOrderId", toOrderId);
                              console.log("item._id", item._id);
                              if (fromOrderId && toOrderId) {
                                handleSendMenuItem(fromOrderId, toOrderId, item._id);
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
                            {client}
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

      <div style={{ marginTop: '20px', textAlign: 'center', position: 'fixed', bottom:"10vh", left: 0,
          right: 0, }}>
        <Typography variant="h5">Total: {total}€</Typography>
        <Button variant="contained" color="primary" onClick={handlePayment}>
          Pay {total}€
        </Button>
      </div>
      <BottomNavigation
        value={navValue}
        onChange={(event, newValue) => setNavValue(newValue)}
        showLabels
        style={{ marginTop: '20px',
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
         }}
      >
        <BottomNavigationAction label={`Starters ${getItemCountByCategory(MenuCategoryEnumBackend.STARTER)}`} icon={<FastfoodIcon />} value="STARTER" />
        <BottomNavigationAction label={`Mains ${getItemCountByCategory(MenuCategoryEnumBackend.MAIN)}`} icon={<RestaurantIcon />} value="MAIN" />
        <BottomNavigationAction label={`Desserts ${getItemCountByCategory(MenuCategoryEnumBackend.DESSERT)}`} icon={<DessertIcon />} value="DESSERT" />
        <BottomNavigationAction label={`Drinks ${getItemCountByCategory(MenuCategoryEnumBackend.DESSERT)}`} icon={<LocalBarIcon />} value="BEVERAGE" />
      </BottomNavigation>
    </div>
  );
}