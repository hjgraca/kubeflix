import React, { useEffect, useState } from 'react';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import Badge from '@material-ui/core/Badge';
import Backend from '../../components/Backend';
import Drawer from '@material-ui/core/Drawer';
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import DeleteIcon from '@material-ui/icons/Delete';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';

export default function Header(props) {

    function getCookieBasket() {
        return document.cookie
            .split('; ')
            .find(row => row.startsWith('basketId='))
            .split('=')[1];
    }

    async function getbasket() {
        var basketId = getCookieBasket();
        if (basketId) {
            const response = await Backend.getBasket(basketId)
            const data = await response.json();
            props.updateBasket(data);
        }
    }

    async function deleteBasket(movieId) {
        var basketId = getCookieBasket();
        if (basketId) {
            const response = await Backend.deleteBasketItem(basketId, movieId)
            const data = await response.json();
            props.updateBasket(data);
        }
    }

    async function checktout() {
        var basketId = getCookieBasket();
        if (basketId) {
            await Backend.checkout(basketId)
            props.updateBasket({ basketItems: [] });
            setState({ ...state, ['right']: false });
        }
    }

    useEffect(function effectFunction() {
        getbasket();
    }, []);

    const [state, setState] = useState({
        right: false
    });

    const toggleDrawer = (anchor, open) => (event) => {
        if (
            event.type === "keydown" &&
            (event.key === "Tab" || event.key === "Shift")
        ) {
            return;
        }
        setState({ ...state, [anchor]: open });
    };

    const basket = (basket) => (
        <div style={{ width: 400 }}
            role="presentation">
            <h2 style={{ textAlign: 'center' }}>Your basket</h2>
            <div style={{ flexGrow: 1, width: "100%" }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={11}>
                        <List>
                            {basket != null && basket.basketItems.length > 0 ? basket.basketItems.map((item, key) => (
                                <div key={key}>
                                    <ListItem>
                                        <ListItemAvatar>
                                            <Avatar variant="square" src={`https://image.tmdb.org/t/p/w92/${item.posterPath}`} />
                                        </ListItemAvatar>
                                        <ListItemText primary={item.title} secondary={item.date} />
                                        <ListItemSecondaryAction>
                                            <IconButton edge="end" aria-label="delete" onClick={async () => { await deleteBasket(item.movieId) }}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                    <Divider />
                                </div>
                            )) : <h3 style={{ textAlign: 'center' }}>No movies in your basket</h3>}
                        </List>
                    </Grid>
                </Grid>
            </div>
        </div>
    );


    return (
        <header className={props.black ? "black" : ''}>
            <div className="header--logo">
                <a href="/"><span>KUBEFLIX</span></a>
            </div>
            <div className="header--basket" onClick={toggleDrawer("right", true)}>
                <Badge overlap="circle" badgeContent={props.basket == null ? 0 : props.basket.total} color="primary">
                    <ShoppingBasketIcon style={{ fontSize: 35 }} />
                </Badge>
            </div>
            <Drawer
                anchor="right"
                open={state["right"]}
                onClose={toggleDrawer("right", false)}>
                {basket(props.basket)}
                <Button
                    onClick={async () => { await checktout() }}
                    variant="contained"
                    color="secondary"
                    size="large"
                    endIcon={<ShoppingCartIcon />}
                    style={{ margin: 15, backgroundColor: '#333', visibility: props.basket != null && props.basket.basketItems.length > 0 ? 'visible' : 'hidden' }}
                >1 click checkout</Button>
            </Drawer>
        </header>
    )
}
