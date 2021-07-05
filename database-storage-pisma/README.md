# Database Storage with Prisma

- Create a postgresql database in Heroku
- Use an .env to set the `DATABASE_URL` variable
- Run `npx prisma db push` and the prisma schema will be replicated as a database schema

Since GraphQL schema and Prisma schema are quite similar, when you run the `npx prisma db push` command you might get an error message mentioning that you haven't defined the relations, and to run `npx prisma format` to fix your schema.