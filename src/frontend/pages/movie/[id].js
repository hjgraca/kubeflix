import Tmdb from '../../components/Backend';
import Body from '../../components/Body';

export default function Home({ movieList, featuredData }) {
    return (
        <Body movieList={movieList} featuredData={featuredData} ></Body>
    )
}

export async function getServerSideProps(context) {
    const { id } = context.query;

    const movieList = await Tmdb.getHomeList();
    const featuredData = await Tmdb.getMovieInfo(id);

    return { props: { movieList, featuredData } }
}