import { TextLoader } from "langchain/document_loaders/fs/text";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { createClient } from "@supabase/supabase-js";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { OpenAIEmbeddings } from "@langchain/openai";




try{
    const loader = new TextLoader("data/data.txt");
    const docs = await loader.load();
    // console.log(docs);
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 500,
    });
    const output = await splitter.splitDocuments(docs);
    // console.log(output);

    const spbUrl = process.env.SUPABASE_URL;
    const spbKey = process.env.SUPABASE_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;

    if(!spbUrl || !spbKey || !openaiKey){
        throw new Error("Missing environment variables");
    }

    const supabaseClient = createClient(spbUrl, spbKey);



    await SupabaseVectorStore.fromDocuments(output, new OpenAIEmbeddings({openAIApiKey: openaiKey}), {
        client: supabaseClient,
        tableName: "documents",
    })

    console.log("Data loaded successfully");
}catch(error){
    console.log(error);
}