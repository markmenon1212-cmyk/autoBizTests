# 🚀 Deploy AutoBiz AI to Vercel - Complete Guide

This guide will walk you through deploying your AutoBiz AI project to Vercel, including environment setup, configuration, and deployment steps.

## 📋 Prerequisites

Before starting, ensure you have:

- ✅ A GitHub account with your AutoBiz AI repository
- ✅ A Vercel account (free tier available)
- ✅ All required API keys and service credentials
- ✅ Your project is working locally

## 🔑 Required API Keys & Services

### 1. OpenAI API Key
- **Required**: Yes (for AI features to work)
- **Get it from**: [platform.openai.com](https://platform.openai.com/api-keys)
- **Cost**: Pay-per-use (very affordable for testing)

### 2. Clerk Authentication (Optional but Recommended)
- **Required**: No (demo mode works without it)
- **Get it from**: [clerk.com](https://clerk.com)
- **Cost**: Free tier available

### 3. Supabase Database (Optional)
- **Required**: No (demo mode works without it)
- **Get it from**: [supabase.com](https://supabase.com)
- **Cost**: Free tier available

### 4. Stripe Payments (Optional)
- **Required**: No (demo mode works without it)
- **Get it from**: [stripe.com](https://stripe.com)
- **Cost**: Free to set up, fees on transactions

## 🚀 Step-by-Step Deployment

### Step 1: Prepare Your Repository

1. **Ensure your code is committed and pushed to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Verify your project structure matches the expected layout**
   - Ensure `next.config.js` exists
   - Verify `package.json` has correct scripts
   - Check that all dependencies are properly listed

### Step 2: Connect to Vercel

1. **Go to [vercel.com](https://vercel.com)**
2. **Sign in with GitHub** (recommended) or create an account
3. **Click "New Project"**
4. **Import your GitHub repository**
   - Select your AutoBiz AI repository
   - Vercel will automatically detect it's a Next.js project

### Step 3: Configure Project Settings

1. **Project Name**: Choose a name (e.g., `autobiz-ai`)
2. **Framework Preset**: Should auto-detect as Next.js
3. **Root Directory**: Leave as `./` (root of repository)
4. **Build Command**: Should auto-detect as `next build`
5. **Output Directory**: Should auto-detect as `.next`
6. **Install Command**: Try these alternatives if `npm install` fails:
   - `npm ci --only=production` (recommended)
   - `npm install --production`
   - `yarn install --production`
   - `pnpm install --prod`
   - Leave empty for auto-detection

### Step 4: Set Environment Variables

**⚠️ CRITICAL**: Set these environment variables in Vercel before deploying:

#### Required Environment Variables

```bash
# OpenAI API Key (REQUIRED for AI features)
OPENAI_API_KEY=sk-your-openai-api-key-here

# Next.js Environment
NODE_ENV=production
```

#### Optional Environment Variables (for full functionality)

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your-clerk-key
CLERK_SECRET_KEY=sk_test_your-clerk-secret-key

# Supabase Database
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Stripe Payments
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-key
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

### Step 5: Deploy

1. **Click "Deploy"**
2. **Wait for build to complete** (usually 2-5 minutes)
3. **Check for any build errors** in the logs
4. **Your app will be available at**: `https://your-project-name.vercel.app`

## 🔧 Post-Deployment Configuration

### Step 1: Verify Deployment

1. **Visit your deployed URL**
2. **Test the landing page**
3. **Try the demo mode** (should work without authentication)
4. **Check console for any errors**

### Step 2: Configure Custom Domain (Optional)

1. **Go to your project settings in Vercel**
2. **Navigate to "Domains"**
3. **Add your custom domain**
4. **Update DNS records** as instructed by Vercel

### Step 3: Set Up Webhooks (If using Stripe)

1. **Go to your Stripe Dashboard**
2. **Navigate to Webhooks**
3. **Add endpoint**: `https://your-domain.vercel.app/api/webhooks/stripe`
4. **Select events**: `checkout.session.completed`, `customer.subscription.created`, etc.

## 🚨 Troubleshooting Common Issues

### Build Failures

#### Issue: "npm install" fails during deployment

**Symptoms:**
- Build fails with "npm install" errors
- Dependencies not found
- Package installation timeout

**Solutions (try in order):**

1. **Use npm ci instead:**
   ```bash
   Install Command: npm ci --only=production
   ```

2. **Use production-only install:**
   ```bash
   Install Command: npm install --production
   ```

3. **Try yarn instead:**
   ```bash
   Install Command: yarn install --production
   ```

4. **Try pnpm instead:**
   ```bash
   Install Command: pnpm install --prod
   ```

5. **Clear Vercel cache:**
   - Go to Project Settings → General
   - Click "Clear Build Cache"
   - Redeploy

6. **Check package-lock.json:**
   - Ensure it's committed to git
   - Delete and regenerate: `rm package-lock.json && npm install`

7. **Use auto-detection:**
   - Leave Install Command empty
   - Vercel will auto-detect the best command

#### Issue: "Module not found" errors
**Solution**: Ensure all dependencies are in `package.json`
```bash
npm install
git add package.json package-lock.json
git commit -m "Update dependencies"
git push
```

#### Issue: TypeScript compilation errors
**Solution**: Fix TypeScript errors locally first
```bash
npm run build
# Fix any errors that appear
git add .
git commit -m "Fix TypeScript errors"
git push
```

### Runtime Errors

#### Issue: Environment variables not working
**Solution**: 
1. Check Vercel environment variables are set correctly
2. Ensure variable names match exactly (case-sensitive)
3. Redeploy after adding new environment variables

#### Issue: API routes returning 500 errors
**Solution**:
1. Check Vercel function logs
2. Verify API key permissions
3. Check rate limits on external services

### Performance Issues

#### Issue: Slow page loads
**Solution**:
1. Enable Vercel Analytics
2. Check image optimization
3. Verify code splitting is working

## 📊 Monitoring & Analytics

### Vercel Analytics
1. **Enable in project settings**
2. **Monitor Core Web Vitals**
3. **Track performance metrics**

### Error Tracking
1. **Check Vercel function logs**
2. **Monitor build success rates**
3. **Set up alerts for failures**

## 🔄 Continuous Deployment

### Automatic Deployments
- **Main branch**: Auto-deploys on every push
- **Preview deployments**: Created for pull requests
- **Manual deployments**: Available from Vercel dashboard

### Deployment Strategy
1. **Development**: Use feature branches
2. **Testing**: Create pull requests for preview deployments
3. **Production**: Merge to main branch for auto-deployment

## 💰 Cost Optimization

### Vercel Pricing
- **Hobby Plan**: Free (100GB bandwidth/month)
- **Pro Plan**: $20/month (1TB bandwidth/month)
- **Enterprise**: Custom pricing

### Cost-Saving Tips
1. **Use Hobby plan** for development and testing
2. **Monitor bandwidth usage**
3. **Optimize images and assets**
4. **Use edge functions sparingly**

## 🔒 Security Best Practices

### Environment Variables
- ✅ Never commit API keys to Git
- ✅ Use Vercel's encrypted environment variables
- ✅ Rotate API keys regularly

### API Security
- ✅ Implement rate limiting
- ✅ Validate all inputs
- ✅ Use HTTPS (automatic with Vercel)

## 📱 Testing Your Deployment

### Test Checklist
- [ ] Landing page loads correctly
- [ ] Demo mode works without authentication
- [ ] AI workflow execution works (if OpenAI key is set)
- [ ] All pages are accessible
- [ ] Mobile responsiveness works
- [ ] Performance is acceptable

### Performance Testing
1. **Use Lighthouse** in Chrome DevTools
2. **Test on different devices**
3. **Check Core Web Vitals**
4. **Monitor load times**

## 🆘 Getting Help

### Vercel Support
- **Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Community**: [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)
- **Support**: Available on Pro plans and above

### AutoBiz AI Support
- **GitHub Issues**: Report bugs in your repository
- **Documentation**: Check the main README.md
- **Community**: Join discussions in your repository

## 🎯 Next Steps After Deployment

1. **Set up monitoring and alerts**
2. **Configure custom domain**
3. **Set up staging environment**
4. **Implement CI/CD pipeline**
5. **Add performance monitoring**
6. **Set up backup strategies**

## 📋 Deployment Checklist

### Pre-Deployment
- [ ] Code is committed and pushed to GitHub
- [ ] All dependencies are in package.json
- [ ] Environment variables are documented
- [ ] Build passes locally (`npm run build`)

### During Deployment
- [ ] Connect repository to Vercel
- [ ] Set all required environment variables
- [ ] Configure build settings
- [ ] Deploy and verify build success

### Post-Deployment
- [ ] Test all functionality
- [ ] Verify environment variables work
- [ ] Check performance metrics
- [ ] Set up monitoring
- [ ] Configure custom domain (if needed)

---

## 🎉 Congratulations!

Your AutoBiz AI platform is now deployed on Vercel! 

**Your app is available at**: `https://your-project-name.vercel.app`

**Next steps**:
1. Test all features thoroughly
2. Set up monitoring and analytics
3. Configure your custom domain
4. Share your deployed application

---

**Need help?** Check the troubleshooting section above or reach out to the community for support. 