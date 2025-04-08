import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGO_URI);
const dbName = "BidGO";

export const addRentalItem = async ({ title,image, description, category, price, priceUnit }) => {
    try {
        console.log("Connecting to DB...");
        await client.connect();
        console.log("Connected to DB");

        const db = client.db(dbName);
        const auctionsCollection = db.collection("AuctionItems");

        // Generate unique auction ID
        const rentalId = Math.floor(1000000000 + Math.random() * 9000000000).toString();
        const createdAt = new Date().toISOString();

        const newRental = {
            rentalId,
            title,
            description,
            category,
            image,
            createdAt,
            price,
            priceUnit
        };

        console.log("New Rental Item Data:", newRental);

        // Insert auction into MongoDB
        const result = await auctionsCollection.insertOne(newRental);

        if (result.acknowledged) {
            console.log("Rental Item Added Successfully:", result.insertedId);
            return { ...newRental, _id: result.insertedId };
        } else {
            throw new Error("Failed to add Rental Item");
        }

    } catch (error) {
        console.error("Error adding Rental Item:", error);
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

  export const registerForAuction = async ({ auctionId, name }) => {
    try {
      await client.connect(); // Make sure to connect to MongoDB
  
      const db = client.db(dbName); // Get the database
      console.log("Registering for Auction:", auctionId);
  
      const result = await db.collection("AuctionItems").updateOne(
        { auctionId }, 
        { $push: { RegisteredUsers: name } } // Use $push to add name to RegisteredUsers
      );
  
      console.log("Auction Updated:", result);
      return result;
    } catch (error) {
      console.error("Error registering for Auction:", error);
      throw new Error("Error registering for Auction");
    } finally {
      await client.close(); // Close the connection when done
    }
  };
  