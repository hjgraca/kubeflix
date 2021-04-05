import MovieRow from '../MovieRow';
import FeaturedMovie from '../FeaturedMovie';
import Header from '../Header';
import React, { useEffect, useState } from 'react';

export default function Body(props) {

    const [blackHeader, setblackHeader] = useState(false);
    const [basket, updateBasket] = useState(null);

    useEffect(() => {
        const scrollListener = () => {
            if (window.scrollY > 10) {
                setblackHeader(true);
            } else {
                setblackHeader(false);
            }
        }

        window.addEventListener('scroll', scrollListener);

        return () => {
            window.removeEventListener('scroll', scrollListener);
        }
    }, []);

    return (
        <div className="page">

            <Header black={blackHeader} basket={basket} updateBasket={updateBasket} />

            {props.featuredData &&
                <FeaturedMovie item={props.featuredData} updateBasket={updateBasket} ads={props.ads} />
            }

            <section className="lists">
                {props.movieList.map((item, key) => (
                    item.items.length > 0 &&
                    <MovieRow key={key} title={item.title} items={item.items}></MovieRow>
                ))}
            </section>
            <footer>
                <p>Movie data powered by <a href="https://www.themoviedb.org/"> <img src="/tmdb.svg" style={{ width: "140px" }}></img></a></p>
                <p>Server: {process.env.HOSTNAME}</p>
            </footer>

            {props.movieList.length <= 0 &&
                <div className="loading">
                    <img src="https://cdn.lowgif.com/small/0534e2a412eeb281-the-counterintuitive-tech-behind-netflix-s-worldwide.gif" alt="loading"></img>
                </div>
            }

        </div>
    )
}