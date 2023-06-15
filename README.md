This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

# recommen.do

Welcome to the recommen.do GitHub repository!

## Introduction

recommen.do is a web application and browser extension developed for the Appwrite x Hashnode Hackathon. It aims to simplify the overwhelming task of selecting the right product from a sea of search results on platforms like Amazon, Newegg, and eBay. Leveraging the power of Next.js, Appwrite, OpenAI, and Plasmo, recommen.do acts as your personal shopping advisor, providing tailored recommendations based on your inputs.

## Features

- **Unified Authentication**: Seamlessly authenticate across the website and extension.
- **Subscription/Payment Management**: Manage your subscriptions, gain access to premium features with the ability to upgrade, downgrade, or cancel.
- **Custom API Key Integration**: Utilize your own API key with OpenAI.

## Tech Stack

- **Next.js**: Front-end framework for building the web application with server-side rendering and improved performance.
- **Appwrite Cloud**: Handles user authentication, authorization, and database storage.
- **Plasmo**: Framework used for the browser extension.
- **Stripe**: Payment processing platform integrated into the application.
- **Vercel**: Deployment and hosting platform for the web application.

## Prerequisites

1. Stripe account (you need secret_key and webhook_key)
2. Appwrite Cloud account with 1 Project:

- 2 Web Platforms (AuthUI and Extension)
- Auth methods enabled: Email/Password, Phone, Magic URL, JWT, GitHub
- Database:

```
database: "main",
collection: "profile"
```

- Attributes:

```
userId: string,
name: string,
email: string,
credits: integer,
usage: integer,
stripeCurrentPeriodEnd: datetime,
stripeCustomerId: string,
stripePriceId: string,
stripeStatus: string,
stripeStatusLastUpdated: datetime,
stripeSubscriptionId: string,
stripeSubscriptionName: string
```

- Indexes:

```
userId_1: unique ASC
credits_1: key ASC
stripCustomerId_1: key ASC
```

- Document security ON

3. Functions: check https://github.com/alexbacanu/recommen.do-functions
4. Webhooks:

```
name: create-user
update-events: databases.main.collections.profile.documents.*.create
post-url: /api/stripe/customer
```

## Getting Started

To get started with recommen.do, follow these steps:

1. Clone the repository: `git clone https://github.com/alexbacanu/recommen.do`
2. Install the dependencies using pnpm: `pnpm i`
3. Configure the necessary environment variables. You can check `.env.example` for inspiration.
4. Run the development server: `pnpm dev`
5. Open the web application in your browser: `http://localhost:1947`

## Contributing

Contributions are welcome! If you encounter any issues or have suggestions for improvements, please feel free to open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).

## Demo

Check out the live demo of recommen.do at [recommen.do](recommendo.vercel.app/)

## Video

Watch this [demo video](https://www.youtube.com/watch?v=your-video-id) to see recommen.do in action.

## Hashtags

#Appwrite #AppwriteHackathon #Next.js #OpenAI #Plasmo #ChatGPT #Stripe #Vercel
