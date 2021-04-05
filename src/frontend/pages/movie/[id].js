import Backend from '../../components/Backend';
import Body from '../../components/Body';

export default function Home({ movieList, featuredData, ads }) {
    return (
        <Body movieList={movieList} featuredData={featuredData} ads={ads} ></Body>
    )
}

export async function getServerSideProps(context) {
    const { id } = context.query;

    const movieList = await Backend.getHomeList();
    const featuredData = await Backend.getMovieInfo(id);
    const ads = await Backend.getAds();

    return { props: { movieList, featuredData, ads } }
}