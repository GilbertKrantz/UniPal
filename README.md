# UniPal

**UniPal** is an innovative web application designed to assist students in finding relevant information about universities in Indonesia, currently focusing on Binus University. UniPal is built using React.js and Google Cloud APIs. The APIs used in this project are the Google Cloud Generative AI API, the Google Cloud Speech-to-Text API, and the ElevenLabs Text-to-Speech API. In this project, we use the Generative AI API to generate a summary of the information about the university, the Speech-to-Text API to convert the user's speech into text, and the Text-to-Speech API to convert the generated summary into speech. In the future, we plan to add more universities to the application and introduce additional features.

## Features
- **Voice Input**: Accepts user voice input and converts it into text.
- **Text Input**: Allows users to enter questions in text form.
- **AI-Powered Responses**: Provides answers to user queries in both text and audio formats.
- **Account Management**: 
  - Create an account
  - Login and logout
  - Change password
  - Update profile (name and photo)

## Knowledge Base
UniPal's knowledge base consists of questions and answers related to Binus University, organized in a JSON file.

## Accessing UniPal
You can access UniPal from any browser at: [https://unipal.online/](https://unipal.online/). For a brief instructional video on how to navigate and interact with the application, please check out: [YouTube Video](https://youtu.be/a68_B3bTApo?si=qZQKZ0N3j87dqAoM).

## How to Run the Project
1. Clone the repository
2. Run `npm install` to install the dependencies
3. Set your Google Cloud API key in the `Key` folder
4. Start the server by running `npm start`
5. Run `npm run dev` to start the application
6. Open `http://localhost:XXXX` in your browser

## Team Members
- [GilbertKrantz] (Web Developer, API Integration, Designer)
- [ElTheHuman] (Web Developer, AI Integration, Designer)
- [elvinaben] (Project Manager, Data Curator)


## License
This project is licensed under the MIT License - see the LICENSE file for details.

