// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import Backend from '../../../components/Backend';

export default async (req, res) => {

  const {
    query: { basketId, movieId },
  } = req

  if (req.method === 'POST') {

    await Backend.addToBasketToApi(basketId, req.body)
      .then(response => response.json())
      .then(data => {
        res.status(200).json(data);
      })
      .catch((error) => {
        res.status(500).end('Error:', error);
      });


  } else if (req.method === 'GET') {

    await Backend.getBasketFromApi(basketId)
      .then(response => response.json())
      .then(data => {
        res.status(200).json(data);
      })
      .catch((error) => {
        res.status(404).end('Error:', error);
      });

  }
  else if (req.method === 'DELETE') {

    await Backend.deleteBasketItemFromApi(basketId, movieId)
      .then(response => response.json())
      .then(data => {
        res.status(200).json(data);
      })
      .catch((error) => {
        res.status(500).end('Error:', error);
      });

  } else {
    res.statusCode = 405
  }
}