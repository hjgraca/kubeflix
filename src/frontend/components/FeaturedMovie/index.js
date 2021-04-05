import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Backend from '../Backend';

export default function FeaturedMovie({ item, updateBasket, ads }) {

    let firstDate = new Date(item.release_date);

    let genres = [];
    for (let i in item.genres) {
        genres.push(item.genres[i].name);
    }

    let descr = item.overview;
    if (descr.length > 300) {
        descr = descr.substring(0, 300) + '...';
    }

    let cast = [];
    for (let i in item.cast) {
        cast.push({
            name: item.cast[i].name,
            picture: item.cast[i].profile_path,
            character: item.cast[i].character
        });
    }

    if (process.browser) {
        if (!document.cookie.split(';').some((item) => item.trim().startsWith('basketId='))) {
            var uid = new Date().getUTCMilliseconds();
            document.cookie = "basketId=" + uid;
        }
    }

    const addToBasket = async (event) => {
        event.preventDefault();
        const cookieValue = document.cookie
            .split('; ')
            .find(row => row.startsWith('basketId='))
            .split('=')[1];

        await Backend.addToBasket(cookieValue, item).then(response => response.json())
            .then(data => {
                updateBasket(data)
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    return (
        <section className="featured" style={{
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundImage: `url(https://image.tmdb.org/t/p/original${item.backdrop_path})`
        }}>
            <div className="featured--vertical">
                <div className="featured--horizontal">
                    <div className="featured--name">{item.title}</div>
                    <div className="featured--info">
                        <div className="featured--points">{item.vote_average} votes</div>
                        <div className="featured--year">{firstDate.getFullYear()}</div>
                        <div className="featured--seasons">{item.tagline}</div>
                    </div>
                    <div className="featured--description">{descr}</div>
                    <div className="featured--buttons">
                        <a href={`/movie/${item.id}`} className="featured--watchbutton">► Rent now</a>
                        {/* <a href={`/list/add/${item.id}`} className="featured--mylistbutton">+ Add to cart</a> */}
                        <button onClick={addToBasket} className="featured--mylistbutton">+ Add to basket</button>
                    </div>
                    {ads.desc != undefined &&
                        <div className="featured--info"><strong>🎁 {ads.desc}</strong></div>
                    }
                    <div className="featured--genres">Genre: <strong> {genres.join(', ')} </strong></div>
                    <div className="featured--cast">
                        {cast.length > 0 && cast.map((item, key) => (
                            <div key={key}>
                                <Avatar alt={item.id} src={`https://image.tmdb.org/t/p/original${item.picture}`} />
                                <p className="cast--name">{item.name}</p>
                                <p className="cast--character">{item.character}</p>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    )
}
