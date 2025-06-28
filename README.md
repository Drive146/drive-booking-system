# Drive by Talrop - Automated Booking System

This guide will walk you through deploying your application to Vercel and setting up the required environment variables to make it fully functional.

## Step 1: Deploy to Vercel

1.  **Go to Vercel:** Open your web browser and go to [vercel.com](https://vercel.com). Sign in with your GitHub account.
2.  **Import Project:** On your Vercel dashboard, click the **"Add New..."** button and select **"Project"**.
3.  **Import GitHub Repository:** Find your `drive-booking-system` repository in the list and click the **"Import"** button next to it.
4.  **Configure Project:** Vercel will automatically detect that it's a Next.js project. You don't need to change any build settings. The most important part is adding the Environment Variables.

## Step 2: Add Environment Variables in Vercel

Before you deploy, you must add your secret keys.

1.  On the "Configure Project" screen, expand the **"Environment Variables"** section.
2.  Add each of the variables below, one by one. Copy the **Name** and **Value** carefully.
3.  **Crucially**, for the `GOOGLE_PRIVATE_KEY`, copy the *entire* key from your service account JSON file. It's a very long block of text that starts with `-----BEGIN PRIVATE KEY-----` and ends with `-----END PRIVATE KEY-----`.

<img src="https://placehold.co/800x250.png" alt="Vercel Environment Variables" data-ai-hint="vercel environment variables" />

### Required Variables

| Name                          | Value                      | Description                                        |
| :---------------------------- | :------------------------- | :------------------------------------------------- |
| `GOOGLE_SHEET_ID`             | Your sheet ID              | From the URL of your Google Sheet.                 |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL`| The `client_email`         | From your service account JSON file.               |
| `GOOGLE_PRIVATE_KEY`          | The entire `private_key`   | From your service account JSON file.               |
| `GOOGLE_CALENDAR_ID`          | Your calendar ID           | From your Google Calendar settings.                |
| `ADMIN_PASSWORD`              | A secure password          | The password for the `/settings` page.             |
| `SMTP_HOST`                   | e.g., `smtp.gmail.com`     | Your email provider's SMTP server.                 |
| `SMTP_PORT`                   | e.g., `465` or `587`       | Your email provider's SMTP port.                   |
| `SMTP_USER`                   | Your email address         | e.g., `you@example.com`.                           |
| `SMTP_PASS`                   | Your email app password    | **Important:** Use an "App Password".              |
| `SMTP_FROM_EMAIL`             | The "from" email address   | The email address that will send confirmations.    |


## Step 3: Deploy

1.  After adding all the environment variables, click the **"Deploy"** button.
2.  Vercel will build and deploy your project. This might take a few minutes.

Once it's done, you'll get a URL where you can see your live booking application. Congratulations!
