# OSHA Letters of Interpretation Crawler & API

A web crawler that automatically collects OSHA regulatory letters and provides a REST API to access them. Built for reliability and easy deployment.

## Key Features

- 🕷️ **Automated Crawling**: Daily updates from OSHA's website
- 🗄️ **Database Storage**: MongoDB for structured data storage
- 📡 **Simple API**: REST endpoints to access letters
- ☁️ **Serverless**: Deploys to AWS Lambda automatically
- 🔒 **Security**: Protected database connections & rate limiting

## Tech Stack

- **Crawling**: `Crawlee`, `Cheerio`
- **Database**: `MongoDB`
- **Cloud**: `AWS Lambda`, `API Gateway`
- **Tools**: `Serverless Framework`, `Docker` (local DB)

## Setup Guide

## Crawler Working

## How the Scraping Works

The crawler works like a careful librarian that organizes OSHA letters step by step:

1. **Start at the Main Page**  
   Begins with OSHA's main interpretations page:  
   `https://www.osha.gov/laws-regs/standardinterpretations/publicationdate`

2. **Find All Year Pages**  
   Discovers pages for different years (like 2023, 2022, etc.) automatically

3. **Go Through Each Year**  
   For each year:

   - Opens every monthly section (March, April, etc.)
   - Finds all listed letters
   - Checks if we already have the letter in our database

4. **Save New Letters**  
   For new letters:

   - Records the date
   - Saves the title
   - Stores the official OSHA link
   - Notes which regulation it applies to

5. **Handle Errors Gently**  
   If something goes wrong:

   - Tries again 3 times
   - Skips problematic pages after trying
   - Logs errors for later review

6. **Daily Updates**  
   Runs automatically every morning to check for new letters

### 1. Prerequisites

- Node.js 18+
- MongoDB (Local or Atlas)
- AWS Account (for deployment)

### 2. Install Dependencies

```bash
npm install
```
