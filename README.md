# Shop POS & Management System — Frontend

A modern, responsive web application for managing day-to-day shop operations, including POS sales, products, inventory, employees, customers, payments, reports, and shop settings.

## Live Demo

**Live Application:** https://shop-pos-xi.vercel.app

## Overview

The frontend provides a user-friendly interface for shop owners and employees to manage daily shop operations.

The application communicates with the backend through REST APIs and uses role-based access control to provide different functionality for owners and employees.

## Features

### Authentication

- User registration
- Email OTP verification
- Login and logout
- Access token authentication
- Refresh token handling
- Forgot password
- Password reset
- Protected routes

### Dashboard

- Today's sales
- Sales overview
- Profit overview
- Current stock
- Low-stock products
- Transaction statistics
- Recent sales
- Best-selling products
- Outstanding dues

### POS

- Product search and selection
- Cart management
- Multiple products per sale
- Quantity management
- Discounts
- Customer information
- Payment handling
- Due amount tracking
- Payment status
- Warranty information
- Printable receipts

### Product Management

- Create products
- View products
- Update products
- Delete products
- Product categories
- Purchase price
- Selling price
- Stock quantity
- Low-stock threshold
- Product status

### Category Management

- Create categories
- Update categories
- Delete categories
- Activate/deactivate categories

### Sales Management

- Sales history
- Sale details
- Invoice/receipt information
- Search and filtering
- Date-based filtering
- Payment status filtering
- Employee-based filtering
- Pagination
- Additional payment collection

### Reports & Statistics

- Daily sales
- Weekly sales
- Monthly sales
- Yearly sales
- Specific-year statistics
- Custom date range
- Gross profit
- Total paid amount
- Total due amount
- Transaction count
- Best-selling products
- Sales by employee

### Employee Management

- Employee information
- Employee role
- Employee status
- Contact information
- Designation
- Salary information
- Joining date

### Shop Settings

- Shop name
- Logo
- Phone number
- Alternative phone
- Email
- Address
- City
- Website
- Receipt footer

## Technology Stack

- Next.js
- React
- TypeScript
- REST API
- Responsive UI

## Project Structure

```text
src/
├── app/
├── components/
├── hooks/
├── lib/
├── services/
├── store/
├── types/
└── ...