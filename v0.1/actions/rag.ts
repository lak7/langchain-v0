"use server";
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { retriever } from "./retreiver";

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


export async function retrieveFunc(question: string){
    console.log("question", question);
    const openaiKey = process.env.OPENAI_API_KEY;
    const llm = new ChatOpenAI({openAIApiKey: openaiKey})
    
    const template = "Generate a standalone question from this follwing question: {question}";
    const prompt = PromptTemplate.fromTemplate(template);

    const chain = prompt.pipe(llm).pipe(new StringOutputParser()).pipe(retriever);

    const response = await chain.invoke({question: question});
    console.log(response);
    return response;
 
}


export async function getRAGResponse(question: string){
    const template = "You are a helpful assistant that can answer questions based on the follwing context: {context}. The question is: {question}. Answer the question based on the context.";
    const prompt = PromptTemplate.fromTemplate(template);
    const context = await retrieveFunc(question);
    const llm = new ChatOpenAI({openAIApiKey: process.env.OPENAI_API_KEY});
    const chain = prompt.pipe(llm).pipe(new StringOutputParser());
    const response = await chain.invoke({context: context, question: question});
    return response;
}