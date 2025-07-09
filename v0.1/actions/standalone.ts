"use server";
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";


export async function getStandAloneQs(question: string){
    console.log("question", question);
    const openaiKey = process.env.OPENAI_API_KEY;
    const llm = new ChatOpenAI({openAIApiKey: openaiKey})
    
    const template = "Generate a standalone question from this follwing question: {question}";
    const prompt = PromptTemplate.fromTemplate(template);

    const promptChain = prompt.pipe(llm);

    const response = await promptChain.invoke({question: question});
    console.log(response.content);
    return response.content;

}