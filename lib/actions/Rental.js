import { MongoClient,ObjectId } from "mongodb";

const client = new MongoClient(process.env.MONGO_URI);
const dbName = "BidGO";

export const addRentalItem = async ({ title,image, description, category, price, priceUnit,owner }) => {
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
            priceUnit,
            owner,
            approvalStatus: "Pending",
            isRented: false,
            rentedBy: "None"
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

  export const updateAuctionStatus = async ({ rentalId }) => {
    try {
      await client.connect(); // Make sure to connect to MongoDB
  
      const db = client.db(dbName); // Get the database
      console.log("Updating Approval Status:", rentalId);
  
      const result = await db.collection("AuctionItems").updateOne(
        { rentalId }, 
        { $set: { approvalStatus: "Accepted" } } // Use $set to update approvalStatus
      );
  
      console.log("Approval Status Updated:", result);
      return result;
    } catch (error) {
      console.error("Error updating Approval Status:", error);
      throw new Error("Error updating Approval Status");
    } finally {
      await client.close(); // Close the connection when done
    }
  };

  export const deleteMyItem = async ({ _id }) => {
    try {
      await client.connect(); // Make sure to connect to MongoDB
      const db = client.db(dbName); // Get the database
      console.log("Deleting item:", _id);
  
      const objectId = new ObjectId(_id);

      // Delete the item with the matching rentalId
      const result = await db.collection("AuctionItems").deleteOne(
        { _id: objectId } // Filter by rentalId
      );
  
      console.log("Delete result:", result);
      
      if (result.deletedCount === 0) {
        throw new Error("No item found with that ID");
      }
  
      return { success: true, deletedCount: result.deletedCount };
    } catch (error) {
      console.error("Error deleting item:", error);
      throw new Error("Error deleting item: " + error.message);
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
  
  export const rentItem = async ({ rentalId, userId }) => {
    try {
      await client.connect();
      const db = client.db(dbName);
      console.log("Renting item:", rentalId);
  
      const _id = new ObjectId(rentalId);

      const item = await db.collection("AuctionItems").findOne({ _id });
      if (!item) throw new Error("Item not found");
      if (item.isRented) throw new Error("Item is already rented");
  
      const result = await db.collection("AuctionItems").updateOne(
        { _id },
        {
          $set: {
            isRented: true,
            rentedBy: userId,
          }
        }
      );
  
      console.log("Item rented successfully:", result);
      return result;
    } catch (error) {
      console.error("Error renting item:", error);
      throw new Error("Error renting item: " + error.message);
    } finally {
      await client.close();
    }
  };
  