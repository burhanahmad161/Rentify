import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGO_URI);
const dbName = "BidGO";

export const createAuction = async ({ title, description, currentBid, timeRemaining, image }) => {
    try {
        console.log("Connecting to DB...");
        await client.connect();
        console.log("Connected to DB");

        const db = client.db(dbName);
        const auctionsCollection = db.collection("AuctionItems");

        // Generate unique auction ID
        const auctionId = Math.floor(1000000000 + Math.random() * 9000000000).toString();
        const createdAt = new Date().toISOString();

        const newAuction = {
            auctionId,
            title,
            description,
            currentBid,
            timeRemaining,
            image,
            createdAt,
            approvalStatus: "Pending",
            // Add an array to store registered users for this
            RegisteredUsers: [],
        };

        console.log("New Auction Data:", newAuction);

        // Insert auction into MongoDB
        const result = await auctionsCollection.insertOne(newAuction);

        if (result.acknowledged) {
            console.log("Auction Created Successfully:", result.insertedId);
            return { ...newAuction, _id: result.insertedId };
        } else {
            throw new Error("Failed to create auction");
        }

    } catch (error) {
        console.error("Error creating auction:", error);
        throw new Error(error.message || "Database error");
    } finally {
        await client.close();
    }
};


export const getAuctions = async () => {
    try {
      await client.connect(); // Make sure to connect to MongoDB
  
      const db = client.db(dbName); // Get the database
      const auctionItems = await db
        .collection('AuctionItems') // Ensure this matches your actual MongoDB collection name
        .find() // Find all items
        .toArray();
      return auctionItems;
    } 
    catch (error) {
        console.error('Error fetching auctions:', error);
      throw new error('Error fetching auctions');
    } finally {
      await client.close(); // Close the connection when done
    }
  };

  export const updateAuctionStatus = async ({ auctionId }) => {
    try {
      await client.connect(); // Make sure to connect to MongoDB
  
      const db = client.db(dbName); // Get the database
      console.log("Updating Auction:", auctionId);
  
      const result = await db.collection("AuctionItems").updateOne(
        { auctionId }, 
        { $set: { approvalStatus: "Accepted" } } // Use $set to update approvalStatus
      );
  
      console.log("Auction Updated:", result);
      return result;
    } catch (error) {
      console.error("Error updating Auction:", error);
      throw new Error("Error updating Auction");
    } finally {
      await client.close(); // Close the connection when done
    }
  };
  