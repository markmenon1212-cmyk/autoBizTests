const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/autobiz';

async function initializeDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    const client = await MongoClient.connect(uri);
    const db = client.db();
    
    console.log('Connected to database:', db.databaseName);
    
    // Create collections if they don't exist
    const collections = ['users', 'subscriptions', 'payments'];
    
    for (const collectionName of collections) {
      try {
        await db.createCollection(collectionName);
        console.log(`✅ Collection '${collectionName}' created`);
      } catch (error) {
        if (error.code === 48) { // Collection already exists
          console.log(`ℹ️  Collection '${collectionName}' already exists`);
        } else {
          console.error(`❌ Error creating collection '${collectionName}':`, error.message);
        }
      }
    }
    
    // Create indexes for better performance
    try {
      // Users collection indexes
      await db.collection('users').createIndex({ clerkUserId: 1 }, { unique: true });
      await db.collection('users').createIndex({ stripeCustomerId: 1 });
      console.log('✅ User indexes created');
      
      // Subscriptions collection indexes
      await db.collection('subscriptions').createIndex({ stripeSubscriptionId: 1 }, { unique: true });
      await db.collection('subscriptions').createIndex({ clerkUserId: 1 });
      await db.collection('subscriptions').createIndex({ stripeCustomerId: 1 });
      console.log('✅ Subscription indexes created');
      
      // Payments collection indexes
      await db.collection('payments').createIndex({ stripeInvoiceId: 1 }, { unique: true });
      await db.collection('payments').createIndex({ clerkUserId: 1 });
      await db.collection('payments').createIndex({ stripeSubscriptionId: 1 });
      console.log('✅ Payment indexes created');
      
    } catch (error) {
      console.error('❌ Error creating indexes:', error.message);
    }
    
    // List all collections
    const allCollections = await db.listCollections().toArray();
    console.log('\n📋 All collections in database:');
    allCollections.forEach(col => {
      console.log(`  - ${col.name}`);
    });
    
    await client.close();
    console.log('\n✅ Database initialization completed!');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

// Run the initialization
initializeDatabase(); 