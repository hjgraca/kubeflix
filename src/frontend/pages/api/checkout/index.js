import Backend from '../../../components/Backend';

export default async (req, res) => {

    if (req.method === 'POST') {

        await Backend.checkout(req.body, true)
            .then(response => response.text())
            .then(data => {
                res.status(200).end(data);
            })
            .catch((error) => {
                res.status(500).end('Error:', error);
            });

    } else {
        res.statusCode = 405
    }
}