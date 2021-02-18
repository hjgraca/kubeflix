const basicFecth = async (endpoint) => {
    return (await fetch(endpoint)).json();
}

const moviesApiUri = process.env.MoviesApiUri;
const recommendationApiUri = process.env.RecommendationApiUri;
const internalBasketApi = "/api/basket";
const basketApiUri = process.env.BasketApiUri;

export default {
    getHomeList: async () => {
        return [
            {
                slug: 'popular',
                title: "Popular",
                items: await basicFecth(`${moviesApiUri}/movies`)
            },
            {
                slug: 'recommended',
                title: "Recommended for you",
                items: await basicFecth(`${recommendationApiUri}/recommendations`)
            }
        ]
    },

    getMovieInfo: async (movieId) => {
        if (movieId) {
            return await basicFecth(`${moviesApiUri}/movies/${movieId}`)
        }
        return {};
    },
    getBasket: async (basketId) => {
        if (basketId) {
            return await fetch(`${internalBasketApi}/${basketId}`)
        }
    },
    addToBasket: async (basketId, item) => {
        if (basketId) {
            let firstDate = new Date(item.release_date);
            return await fetch(`${internalBasketApi}/${basketId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ MovieID: item.id, PosterPath: item.poster_path, Title: item.title, Date: firstDate.getFullYear(), Quantity: 1 })
            })
        }
    },
    getBasketFromApi: async (basketId) => {
        if (basketId) {
            return await fetch(`${basketApiUri}/basket/${basketId}`)
        }
    },
    addToBasketToApi: async (basketId, item) => {
        if (basketId) {
            return await fetch(`${basketApiUri}/basket/${basketId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(item)
            })
        }
    },
    deleteBasketItem: async (basketId, movieId) => {
        if (basketId) {
            return await fetch(`${internalBasketApi}/${basketId}?movieId=${movieId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
        }
    },
    deleteBasketItemFromApi: async (basketId, movieId) => {
        if (basketId) {
            return await fetch(`${basketApiUri}/basket/${basketId}/${movieId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
        }
    }
}