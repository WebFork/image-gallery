import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
import { decode } from "base64-arraybuffer";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL || '',
            process.env.SUPABASE_SERVICE_ROLE_KEY || ''
        );
        await supabaseAdmin
            .storage
            .from('images')
            .upload(`public/${req.body.filename}`, decode(req.body.file), {
                contentType: req.body.filetype,
            }).then((response) => {
                console.log(response);
            }).catch((error) => {
                console.log(error);
                res.status(500).json({ message: 'Error uploading image', time: new Date() });
            });
        const { data } = await supabaseAdmin
            .storage
            .from('images')
            .getPublicUrl(`public/${req.body.filename}`);
        await supabaseAdmin
            .from('images')
            .insert({ name: req.body.name, comment: req.body.comment, imageSrc: data.publicUrl })
            .then((response) => {
                res.status(200).json({ message: 'Image added successfully', time: new Date() });
            });
    }
}

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '100mb',
        }
    }
};

export default handler;
