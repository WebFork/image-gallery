import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if(req.query.secret !== process.env.REVALIDATE_SECRET) {
        return res.status(401).json({message: 'Invalid secret'})
    }

    try {
        await res.revalidate('/');
        return res.status(200).json({ revalidated: true, time: new Date() });
    } catch (err) {
        return res.status(500).send('Error revalidating');
    }
}

export default handler;
