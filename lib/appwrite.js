import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
  Storage,
} from "react-native-appwrite";

export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.sena.geo",
  projectId: "66cc8d2c000d3335fd3d",
  databaseId: "66cc8f28002240054e44",
  userCollectionId: "66cc8f98000395ea7171",
  restaurantCollectionId: "66df52ee001bf89cc217",
  reviewsCollectionId: "66dfc280001113492c6f",
  itinerariesCollectionId: "66fdbc250014e8bebee6",
  storageId: "66cc90d0000c80983b59",
};

const client = new Client();

client
  .setEndpoint(config.endpoint)
  .setProject(config.projectId)
  .setPlatform(config.platform);

const account = new Account(client);
const storage = new Storage(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

// Register user
export async function createUser(email, password, username, role) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(username);

    await signIn(email, password);

    const newUser = await databases.createDocument(
      config.databaseId,
      config.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email: email,
        username: username,
        avatar: avatarUrl,
        role: role,
      }
    );

    return newUser;
  } catch (error) {
    throw new Error(error);
  }
}

// Sign In
export async function signIn(email, password) {
  try {
    const session = await account.createEmailSession(email, password);

    return session;
  } catch (error) {
    throw new Error(error);
  }
}

// Get Current User
export async function getCurrentUser() {
  try {
    const currentAccount = await getAccount();
    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      config.databaseId,
      config.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
    return null;
  }
}

// Sign Out
export async function signOut() {
  try {
    const session = await account.deleteSession("current");

    return session;
  } catch (error) {
    throw new Error(error);
  }
}

// Get Account
export async function getAccount() {
  try {
    const currentAccount = await account.get();

    return currentAccount;
  } catch (error) {
    throw new Error(error);
  }
}

// Create Restaurant
export async function createRestaurant(form) {
  try {
    const [imageUrl] = await Promise.all([uploadFile(form.image, "image")]);

    const restaurantId = ID.unique();

    const newRestaurant = await databases.createDocument(
      config.databaseId,
      config.restaurantCollectionId,
      restaurantId,
      {
        restaurantId: restaurantId,
        name: form.name,
        direction: form.direction,
        menu: form.menu,
        type: form.type,
        image: imageUrl,
        creator: form.userId,
      }
    );

    return newRestaurant;
  } catch (error) {
    throw new Error(error.message);
  }
}

// Get all restaurants
export async function getAllRestaurants(userId) {
  try {
    const posts = await databases.listDocuments(
      config.databaseId,
      config.restaurantCollectionId,
      [Query.equal("creator", userId), Query.limit(10), Query.offset(0)]
    );

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}

//Search Restaurant
export async function searchRestaurants(query) {
  try {
    const restaurants = await databases.listDocuments(
      config.databaseId,
      config.restaurantCollectionId,
      [Query.search("name", query)]
    );

    if (!restaurants) throw new Error("Something went wrong");

    return restaurants.documents;
  } catch (error) {
    throw new Error(error);
  }
}

// Upload File
export async function uploadFile(file, type) {
  if (!file) return;

  const { mimeType, ...rest } = file;
  const asset = { type: mimeType, ...rest };

  console.log(file);

  try {
    const uploadedFile = await storage.createFile(
      config.storageId,
      ID.unique(),
      asset
    );

    console.log("UPLOADED", uploadedFile);

    const fileUrl = await getFilePreview(uploadedFile.$id, type);
    return fileUrl;
  } catch (error) {
    throw new Error(error);
  }
}

// Get latest created Restaurants
export async function getLatestRestaurants() {
  try {
    const posts = await databases.listDocuments(
      config.databaseId,
      config.restaurantCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(7)]
    );

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}

// Get File Preview
export async function getFilePreview(fileId, type) {
  let fileUrl;

  try {
    if (type === "image") {
      fileUrl = storage.getFilePreview(
        config.storageId,
        fileId,
        2000,
        2000,
        "top",
        100
      );
    } else {
      throw new Error("Invalid file type");
    }

    if (!fileUrl) throw Error;

    return fileUrl;
  } catch (error) {
    throw new Error(error);
  }
}

// Get restaurants created by user
export async function getRestaurantsByOwner(userId) {
  try {
    const posts = await databases.listDocuments(
      config.databaseId,
      config.restaurantCollectionId,
      [Query.equal("creator", userId)]
    );

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}

// Get Restaurant by ID
export async function getRestaurantById(restaurantId) {
  try {
    const restaurant = await databases.getDocument(
      config.databaseId,
      config.restaurantCollectionId,
      restaurantId
    );

    if (!restaurant) throw new Error("Restaurant not found");

    return restaurant;
  } catch (error) {
    console.error("Error getting restaurant:", error);
    throw new Error(error);
  }
}

// Create Review
export async function createReview(form, restaurantId, userId) {
  try {
    const newReview = await databases.createDocument(
      config.databaseId,
      config.reviewsCollectionId,
      ID.unique(),
      {
        restaurantId: restaurantId,
        userId: userId,
        ratingPlace: form.ratingPlace,
        ratingDish: form.ratingDish,
        ratingService: form.ratingService,
        writeReview: form.writeReview,
        recommendation: form.recommendation,
      }
    );

    return newReview;
  } catch (error) {
    console.error("Error creating review:", error);
    throw new Error(error);
  }
}

// Get Reviews by Restaurant ID
export async function getReviewsByRestaurantId(restaurantId) {
  try {
    const reviews = await databases.listDocuments(
      config.databaseId,
      config.reviewsCollectionId,
      [Query.equal("restaurantId", restaurantId), Query.orderDesc("$createdAt")]
    );

    return reviews.documents;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw new Error(error);
  }
}

// Crear un itinerario
export async function createItinerary(form, restaurantId, userId) {
  try {
    const newItinerary = await databases.createDocument(
      config.databaseId,
      config.itinerariesCollectionId,
      ID.unique(),
      {
        restaurantId: restaurantId,
        userId: userId,
        numberOfPeople: form.numberOfPeople,
        visitDate: form.visitDate,
      }
    );

    return newItinerary;
  } catch (error) {
    console.error("Error creating itinerary:", error);
    throw new Error(error);
  }
}

// Obtener itinerarios por ID de usuario
export async function getItinerariesByUserId(userId) {
  try {
    const itineraries = await databases.listDocuments(
      config.databaseId,
      config.itinerariesCollectionId,
      [Query.equal("userId", userId), Query.orderDesc("$createdAt")]
    );

    return itineraries.documents;
  } catch (error) {
    console.error("Error fetching itineraries:", error);
    throw new Error(error);
  }
}

export async function searchRestaurantByName(name) {
  try {
    const result = await databases.listDocuments(
      config.databaseId,
      config.restaurantCollectionId,
      [Query.equal("name", name)]
    );

    if (result.documents.length > 0) {
      return result.documents[0]; // Devuelve el primer restaurante encontrado con todos sus detalles
    } else {
      throw new Error("No restaurant found with that name");
    }
  } catch (error) {
    console.error("Error searching restaurant by name:", error);
    throw new Error(error.message);
  }
}
