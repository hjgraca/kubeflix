import Tmdb from '../components/Backend';
import Body from '../components/Body';

export default function Home({ movieList, featuredData }) {
  return (
    <Body movieList={movieList} featuredData={featuredData} ></Body>
  )
}

export async function getServerSideProps() {

  const movieList = await Tmdb.getHomeList();

  let popular = movieList.filter(i => i.slug === 'popular');
  let randonChosen = Math.floor(Math.random() * (popular[0].items.length - 1));
  let chosen = popular[0].items[randonChosen]

  const featuredData = await Tmdb.getMovieInfo(chosen.id);

  return { props: { movieList, featuredData } }
}
