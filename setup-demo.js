#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 AutoBiz AI Demo Setup');
console.log('========================\n');

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
const envExamplePath = path.join(process.cwd(), 'env.example');

if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env.local file...');
  
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ .env.local created from env.example');
  } else {
    // Create a basic .env.local file
    const envContent = `# AutoBiz AI Demo Environment Variables
# Replace these with your actual API keys for full functionality

# Clerk Authentication (Optional for demo)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_demo_key
CLERK_SECRET_KEY=sk_test_demo_key

# Supabase Database (Optional for demo)
NEXT_PUBLIC_SUPABASE_URL=https://demo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=demo_anon_key
SUPABASE_SERVICE_ROLE_KEY=demo_service_key

# Stripe Payments (Optional for demo)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_demo_key
STRIPE_SECRET_KEY=sk_test_demo_key
STRIPE_WEBHOOK_SECRET=whsec_demo_key

# OpenAI (Required for AI features)
OPENAI_API_KEY=your_openai_api_key_here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
`;
    
    fs.writeFileSync(envPath, envContent);
    console.log('✅ .env.local created with demo configuration');
  }
  
  console.log('\n📋 Next steps:');
  console.log('1. Get your OpenAI API key from https://platform.openai.com/api-keys');
  console.log('2. Update OPENAI_API_KEY in .env.local');
  console.log('3. Run "npm run dev" to start the application');
  console.log('\n💡 Note: Other API keys are optional for demo purposes');
} else {
  console.log('✅ .env.local already exists');
}

console.log('\n🎉 Setup complete! Run "npm run dev" to start the application.'); 