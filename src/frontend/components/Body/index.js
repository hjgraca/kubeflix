import MovieRow from '../MovieRow';
import FeaturedMovie from '../FeaturedMovie';
import Header from '../Header';
import React, { useEffect, useState } from 'react';

export default function Body({ featuredData, movieList }) {
    const [blackHeader, setblackHeader] = useState(false);

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

            <Header black={blackHeader} />

            {featuredData &&
                <FeaturedMovie item={featuredData} />
            }

            <section className="lists">
                {movieList.map((item, key) => (
                    <MovieRow key={key} title={item.title} items={item.items}></MovieRow>
                ))

                }
            </section>
            <footer>
                <p>Movie data powered by <a href="https://www.themoviedb.org/"> <img src="/tmdb.svg" style={{ width: "140px" }}></img></a></p>
            </footer>

            {movieList.length <= 0 &&
                <div className="loading">
                    <img src="https://cdn.lowgif.com/small/0534e2a412eeb281-the-counterintuitive-tech-behind-netflix-s-worldwide.gif" alt="loading"></img>
                </div>
            }

        </div>
    )
}