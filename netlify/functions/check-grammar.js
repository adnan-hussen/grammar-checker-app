import {GoogleGenAI} from "@google/genai"
import sanitizeHtml from 'sanitize-html'
const GEMINI_API_KEY=process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY){
    console.error("GEMINI_API_KEY is not defined in environment variables.")
    throw new Error("API key not found.")
}

const ai= new GoogleGenAI({apiKey:GEMINI_API_KEY})

export const handler = async (event)=>{

    try{

        const {text}=JSON.parse(event.body);

        const response=await ai.models.generateContent({
            model:"gemini-2.0-flash",
            contents:text,
            config:{
                systemInstruction:`You are a grammar checker ai, your job is to provide grammatical corrections for the input text and you should strictly follow the following instructions.
Your response should include the grammatical corrections, short explanation about why and the corrected sentence/text and should strictly follow the following format and shouldn't include anything else:

<span class="explanations">Grammatical Correction:</span>
<span>grammatical correction goes here...</span>
<br>
<span class="explanations">Explanation:</span>
<span> explanation goes here... </span>
<br> 
<span class="explanations">Corrected sentence:</span>
<span> corrected sentence goes here...</span>

if the sentence is grammatical, just respond with:
<span class="explanations">Your sentence is grammatical.</span>

You should never reply in a different format or add any other text, follow the instructions strictly.`
            }
        });

        const clean=sanitizeHtml(response.text,
            {
                allowedTags:['b','i','em','strong','br','p','span'],
                allowedAttributes:{
                    span:['class'],
                    p:['class']
                    
                }
            }
        )

        return {
            statusCode:200,
            body:JSON.stringify({response:clean})
        }
    }

    catch(error){
        console.log("Error calling Google GenAI API: ",error.message, error.stack)
        return {
            statusCode:500,
            body:JSON.stringfy({error:'Failed to process request', details:error.message})
        }
    }

}