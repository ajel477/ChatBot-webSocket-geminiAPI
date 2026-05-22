const { Pinecone } = require('@pinecone-database/pinecone')

// Initialize a Pinecone client with your API key
const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });

//where we store the vectors for our messages
const vector1 = pc.Index('vector1');

//Stores meaning of messages
async function createMemory({ vectors, metadata, messageId }) {

    console.log("VECTOR TYPE:", typeof vectors);
    console.log("VECTOR LENGTH:", vectors?.length);

    if (!vectors || !Array.isArray(vectors) || vectors.length === 0) {
        throw new Error("Invalid vector");
    }

await vector1.upsert({
    records: [
        {
            id: String(messageId),
            values: vectors,
            metadata: metadata || {}
        }
    ]
});

    console.log("Vector stored successfully in Pinecone");
}

//Finds similar past messages
async function queryMemory({ queryVector, limit = 5, metadata }) {

    console.log("Query metadata filter:", metadata);
    console.log("Query vector length:", queryVector?.length);

    const data = await vector1.query({
        vector: queryVector,
        topK: limit,
        filter: metadata ? metadata : undefined,
        includeMetadata: true
    });

    console.log("Query returned matches:", data?.matches?.length || 0);
    if (data?.matches?.length > 0) {
        console.log("First match metadata:", data.matches[0].metadata);
    }

    return data?.matches || [];
}

async function deleteMemory(messageIds) {

    if (!messageIds || messageIds.length === 0) {
        console.log("No message IDs to delete from Pinecone");
        return;
    }

    try {
        // Use correct Pinecone SDK method for batch deletion
        await vector1.deleteMany(messageIds.map(id => ({ id })));
        console.log(
            "✅ Deleted vectors from Pinecone:",
            messageIds.length
        );
    } catch (error) {
        console.error("❌ Error deleting from Pinecone:", error.message);
        console.error("Full error:", error);
        // Don't throw - allow chat deletion to proceed even if Pinecone deletion fails
        console.log("⚠️ Continuing with MongoDB deletion despite Pinecone error");
    }
}

module.exports = { createMemory, queryMemory, deleteMemory };