## Getting Started

requirement for starting the project
node 18 or higher
dbeaver 24.0.0 or higher
postgres server 16 or higher

install node 18 or higher 

install postgres server 16 or higher 

install dbeaver 24.0.0 or higher

create a new database and connect it with backend

run "npx sequelize-cli db:migrate" for migration

run npm i 

run npm run dev

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.



Architectural choice:
I have structured my architecture using the MVC pattern. Most of the components are reusable, and I have separate folders for API, interface, and database models.

Additional features with more time :
If I had more time, I would add functionality for setting meeting dates and meeting expiration.

Decision-Making Insights:
Frontend Framework: Selected Next.js for the frontend due to its server-side rendering capabilities, which improves performance and SEO. Additionally, its built-in routing and API routes feature simplified backend integration.

Backend Framework: Chose Node.js with Express for the backend for its lightweight and flexible nature, allowing for easy integration with PostgreSQL and Sequelize.

Database Choice: Opted for PostgreSQL as the relational database for its robust features, ACID compliance, and scalability. Sequelize was chosen as the ORM for its compatibility with PostgreSQL and ease of use.

User Authentication: It was assumed that user authentication would be handled internally using cookies for session management. This assumption was based on the decision to implement a custom authentication system for simplicity and control over user authentication processes.

Database Schema: It was assumed that the database schema would remain relatively stable throughout the development process. Any major changes to the schema were not anticipated, and the application was designed with this assumption in mind.


Application Flow:



Signup Page:

User enters their name, email, and password to sign up.
Upon successful signup, the user is redirected to the availability page.

Login Page:

User enters their email and password to log in.
Upon successful login, the user is redirected to the meeting schedule page.


Availability Page:

User selects their availability by choosing the start and end days, time range, buffer time, and maximum number of meetings.
User can add their availability.
The page displays the user's weekly availability and allows them to delete existing availability.


Meeting Page: 

User selects another user.
User selects the days the other user is available and the time slot for the meeting.
User can schedule a meeting.
User can also cancel a scheduled meeting.






























<!-- This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
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

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details. -->
