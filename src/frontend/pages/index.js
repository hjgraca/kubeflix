import Backend from '../components/Backend';
import Body from '../components/Body';

export default function Home(props) {
  return (
    <Body movieList={props.movieList} featuredData={props.featuredData} ads={props.ads} ></Body>
  )
}

export async function getServerSideProps() {

  const movieList = await Backend.getHomeList();

  let popular = movieList.filter(i => i.slug === 'popular');
  let randomChosen = Math.floor(Math.random() * (popular[0].items.length - 1));
  let chosen = popular[0].items[randomChosen]

  const featuredData = await Backend.getMovieInfo(chosen.id);

  const ads = await Backend.getAds();

  return {
    props: { movieList, featuredData, ads }
  }
}
