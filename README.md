# recommendedProducts
Main repository for recommended products module for FEC project

On load, this repository opens some sample data for recommended products for a Target web app. When running through the included Express server and properly seeded with data, it will query a MongoDB database (created through the Mongoose ODM) for specific product departments.

To properly start up this service, run the following commands from the root directory:
- `npm install`
- `npm run seed`

The following commands should be run from their own terminals to render the app:
- `npm run build`
- `npm start`

To run the provided tests using Jest, use the following command from its own terminal:
- `npm test`

Note: continuous integration has been implemented with CircleCI. Any pull requests to the master branch will be tested.
