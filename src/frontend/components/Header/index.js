import React from 'react';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';

export default function Header({ black }) {
    return (
        <header className={black ? "black" : ''}>
            <div className="header--logo">
                <a href="/"><span>KUBEFLIX</span></a>
            </div>
            <div className="header--user">
                <ShoppingBasketIcon style={{ fontSize: 35 }} />
            </div>
        </header>
    )
}