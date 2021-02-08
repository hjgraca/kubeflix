const basicFecth = async (endpoint) => {
    return (await fetch(endpoint)).json();
}

const moviesApiUri = process.env.MoviesApiUri;
const recommendationApiUri = process.env.RecommendationApiUri;

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
    }
}