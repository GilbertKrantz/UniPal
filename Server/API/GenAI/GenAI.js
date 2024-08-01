import { GoogleGenerativeAI } from "@google/generative-ai";
import { readFileSync } from "fs";

class GenAIService {
    constructor() {
        this.model = null;
        this.chat = null;
    }

    async send(msg) {
        try {
            const result = await this.chat.sendMessage(msg);
            const response = result.response;
            return response.text().trim();
        } catch (error) {
            console.error('Error sending message:', error);
            return 'Internal Server Error';
        }
    }

    async initialize(credentialsPath) {
        const apiKey = readFileSync(credentialsPath, 'utf-8').trim();

        const  generativeAI = new GoogleGenerativeAI(apiKey);
        console.log('Initializing generative AI...');

        const getData = JSON.parse(readFileSync('./API/GenAI/knowledge_clean.json', 'utf-8'));
        const initializerPrompt = JSON.parse(readFileSync('./API/GenAI/initializer.json', 'utf-8'));

        const trainData = [];
        trainData.push(getData.slice(0, Math.floor(0.5 * getData.length)));
        trainData.push(getData.slice(Math.floor(0.5 * getData.length)));

        this.model = generativeAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        this.chat = this.model.startChat({ history: [] });

        for(let i = 0; i < 2; i++){
            await this.chat.sendMessage(initializerPrompt[i][Object.keys(initializerPrompt[i])].replace('{}', JSON.stringify(trainData[i])));
        }

        console.log('Generative AI initialized');
    }
}

export default GenAIService;

