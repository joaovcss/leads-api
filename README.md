# Leads API

A RESTful API for managing leads, groups, and marketing campaigns. Built with Node.js, Express, TypeScript, and Prisma ORM, using PostgreSQL as the database.

## Features

- **Lead Management**: Create, read, update, and delete leads with contact information and status tracking.
- **Group Organization**: Organize leads into groups for better segmentation.
- **Campaign Management**: Create and manage marketing campaigns, associating leads with specific campaigns and tracking their engagement status.
- **Status Tracking**: Comprehensive status enums for leads and lead-campaign relationships.
- **RESTful API**: Clean, intuitive endpoints for all operations.

## Tech Stack

- **Backend**: Node.js with Express
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Validation**: Zod
- **CORS**: Enabled for cross-origin requests

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn package manager

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/leads-api.git
   cd leads-api
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   - Copy the `.env` file and update the `DATABASE_URL` with your PostgreSQL connection string:
     ```
     DATABASE_URL="postgresql://username:password@localhost:5432/leads_api?schema=public"
     ```

4. **Set up the database:**
   - Run Prisma migrations to create the database schema:
     ```bash
     npx prisma migrate dev
     ```
   - Generate the Prisma client:
     ```bash
     npx prisma generate
     ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```

   The API will be available at `http://localhost:3000` (or the port specified in your `.env`).

## Usage

The API provides endpoints for managing leads, groups, and campaigns. All endpoints are prefixed with `/api`.

### Leads

- `GET /api/leads` - Get all leads
- `GET /api/leads/:id` - Get a specific lead
- `POST /api/leads` - Create a new lead
- `PUT /api/leads/:id` - Update a lead
- `DELETE /api/leads/:id` - Delete a lead

### Groups

- `GET /api/groups` - Get all groups
- `GET /api/groups/:id` - Get a specific group
- `POST /api/groups` - Create a new group
- `PUT /api/groups/:id` - Update a group
- `DELETE /api/groups/:id` - Delete a group

### Group-Lead Associations

- `GET /api/groups/:groupId/leads` - Get leads in a group
- `POST /api/groups/:groupId/leads` - Add a lead to a group
- `DELETE /api/groups/:groupId/leads/:leadId` - Remove a lead from a group

### Campaigns

- `GET /api/campaigns` - Get all campaigns
- `GET /api/campaigns/:id` - Get a specific campaign
- `POST /api/campaigns` - Create a new campaign
- `PUT /api/campaigns/:id` - Update a campaign
- `DELETE /api/campaigns/:id` - Delete a campaign

### Campaign-Lead Associations

- `GET /api/campaigns/:campaignId/leads` - Get leads in a campaign
- `POST /api/campaigns/:campaignId/leads` - Add a lead to a campaign
- `PUT /api/campaigns/:campaignId/leads/:leadId` - Update lead status in campaign
- `DELETE /api/campaigns/:campaignId/leads/:leadId` - Remove a lead from a campaign

### Health Check

- `GET /api/status` - Check API status

### Request/Response Examples

**Create a Lead:**
```json
POST /api/leads
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890"
}
```

**Create a Campaign:**
```json
POST /api/campaigns
{
  "name": "Summer Sale 2024",
  "description": "Promotional campaign for summer products",
  "startDate": "2024-06-01T00:00:00Z",
  "endDate": "2024-08-31T23:59:59Z"
}
```

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the project for production
- `npm start` - Start the production server

## Database Schema

The API uses the following main entities:

- **Lead**: Contact information and status
- **Group**: Collections of leads
- **Campaign**: Marketing campaigns
- **LeadCampaign**: Junction table for lead-campaign relationships with status tracking

For detailed schema information, see `prisma/schema.prisma`.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.</content>
