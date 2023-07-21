import express from 'express';
import * as dotenv from 'dotenv';
import { Configuration,OpenAIApi } from 'openai';

dotenv.config();

const router = express.Router();

const configuration = new Configuration({
    apiKey: process.env['OPENAI_API_KEY'],
})

// creation dune instance de openAi
const openai = new OpenAIApi(configuration);

//pour tester il nous faut un router
router.route('/').get((req,res) => {
    res.send('Hello from Dalle-E');
});

router.route('/').post(async(req,res) => {
    try {
        const {prompt} = req.body; //le prompt c'est ce qui va taper dans createPoste 
        const aiResponse = await openai.createImage({
            prompt,
            n: 1,
            size:'1024x1024',
            response_format:'b64_json',
        });
        //to get the image we ..
        const image = aiResponse.data.data[0].b64_json;
        // console.log(image);

        res.status(200).json({photo: image});
    } catch (error) {
        console.log(error);
        res.status(500).send(error?.response.data.error.message);
    }
    //wmnt on a besoin de pull ce backend dans le front end
})

export default router;