import mongoose from 'mongoose';

export const initMongoConnection = async () => {
  const { MONGODB_USER, MONGODB_PASSWORD, MONGODB_URL, MONGODB_DB } =
    process.env;

  if (!MONGODB_USER || !MONGODB_PASSWORD || !MONGODB_URL || !MONGODB_DB) {
    console.error('MongoDB connection failed: Missing environment variables');
    process.exit(1);
  }

  const connectionString = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_URL}/${MONGODB_DB}?retryWrites=true&w=majority`;

  try {
    console.log('Connecting to MongoDB:', connectionString);
    await mongoose.connect(`mongodb+srv://slavnyunstoppable22:ROT0XkSaC5HYQdbZ@cluster0.tp1wo.mongodb.net/contacts?retryWrites=true&w=majority&appName=Cluster0`);
    console.log('MongoDB connection successfully established!');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};
