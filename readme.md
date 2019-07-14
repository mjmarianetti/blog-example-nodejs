# Blog Platform example

## Description

This is an example of an API for a blogging platform implemented with NodeJS and MongoDB.

Main functionalities:

- Register a new user
- Login with a registered user
- Get a list of posts, paginated, with a search functionality
- Get a single post by its ID
- Create a new post
- Edit a post
- Delete a post
- Set the status of a post to be either private, public or draft.

## Requirements

The following packages are required by this package

| Package Name | Description |
| ------------ |  ------------------------ |
| MochaJS |  6.1.4+ |
| NodeJS |  10.15.3+ |
| Docker | https://www.docker.com/ | latest |
| Docker-Compose | https://docs.docker.com/compose/ | latest |


## <a name="setup"></a> Setup

1. Clone this repository
2. Run `$ cd blog-example-nodejs` (if you used the default project name)
3. Run `$ cd src`
4. Copy the .env.example file to a new file called .env with `$ cp .env.example .env`
5. Configure envinronment variables in `.env` (see [env](#env))
6. Go back to the root directory (`$ cd ../`) and run `docker-compose up` to start the development server


## Tests

Go to the `application` directory using `$ cd src`

Configure envinronment variables in `.env.test` (see [env](#env))

Then you can run tests by simply running:

    npm run integration-tests


This will run integrations tests (you **must** have the server up and running)


## <a name="env"></a> Env variables

| Environment variable name | Description |
| ------------ | ------------------------ |
| APP_NAME | Name of our application |
| APP_ENV |  Environment name to use |
| APP_KEY |  base64 key generated |
| APP_URL | URL of the application (optional)
| APP_DEBUG | enable debug mode  |
| DB_HOST | database host  |
| DB_DATABASE | name of the database to use  |
| DB_USERNAME | username of the db  |
| DB_PASSWORD | password for the user  |


## Endpoints available

The following endpoints are available

| URL | Description | Authentication |
| ------------ |  ------------------------ | ------------------------ |
| GET /posts |  get a list of public posts  | not required  |
| GET /posts/{id} | get a public post, or get a private post for the authenticated user  | not required |
| POST /posts | create a new post  | required |
| PUT /posts/{id} | update a post, you can only update posts made by the current user  | required |
| DELETE /posts/{id} | delete a post, you can only delete posts made by the current user  | required |
| POST /users/login |  allows the user to login and obtain a JWT  | not required |
| POST /users/signup | allows the user to signup to the application  | not required |

## Notes - Improvements

If this was intended to be deployed to production we should:
- Improve the logging solution to keep all the log information centralized and easy to query if needed.
- Add a Swagger documentation and/or postman collection to help the frontend and QA to test and use this API.
- Use kubernetes and terraform to deploy.
- Add unit tests for every class and function.
- Improve request validation, separate the entities from the mongoose library. Add a DAO layer to make it easier to switch the database engine.
- Use Redis or another key/value database to manage JWT validation and allow us to invalidate tokens from the server-side.

## License

The Blog Example NodeJS is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).