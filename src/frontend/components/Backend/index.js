const basicFecth = async (endpoint) => {
    return (await fetch(endpoint)).json();
}

const moviesApiUri = process.env.MoviesApiUri;
const recommendationApiUri = process.env.RecommendationApiUri;
const internalBasketApi = "/api/basket";
const basketApiUri = process.env.BasketApiUri;
const adsApiUri = process.env.AdsApiUri;
const checkoutApiUri = process.env.CheckoutApiUri + "/checkout";
const internalCheckoutApiUri = "/api/checkout";

export default {
    getHomeList: async () => {
        return [
            {
                slug: 'popular',
                title: "Popular",
                items: await basicFecth(`${moviesApiUri}/movies`).catch(() => { return []; })
            },
            {
                slug: 'recommended',
                title: "Recommended for you",
                items: await basicFecth(`${recommendationApiUri}/recommendations`).catch(() => { return []; })
            }
        ]
    },
    getMovieInfo: async (movieId) => {
        if (movieId) {
            return await basicFecth(`${moviesApiUri}/movies/${movieId}`)
        }
        return {};
    },
    getAds: async () => {
        return await basicFecth(`${adsApiUri}`).catch(() => { return {}; })
    },
    getBasket: async (basketId) => {
        if (basketId) {
            return await fetch(`${internalBasketApi}/${basketId}`)
        }
    },
    checkout: async (basketId, api) => {
        if (basketId) {
            return await fetch(api ? checkoutApiUri : internalCheckoutApiUri, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(basketId)
            })
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