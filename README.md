# Card Box - Digital Warranty System

**Card Box** is a Next.js application designed to replace traditional paper warranty cards with a secure, digital alternative. It connects Sellers and Buyers through a seamless platform for issuing, tracking, and transferring product warranties.

## Features

### 🌍 Public Portal
-   **Homepage**: Marketing landing page with bilingual support (Bangla/English).
-   **Verification**: Publicly verifiable warranty status using unique codes.
-   **Information**: 'About Us' and 'Contact Us' pages.

### 🏪 Seller Portal
-   **Dashboard**: Analytics on issued warranties (Active vs Expired).
-   **Issue Warranty**: Form to generate tamper-proof digital warranties linked to unique serial numbers.
-   **Inventory**: Complete history of issued warranties.

### 👤 Buyer Portal
-   **My Warranties**: Centralized wallet for all purchased products.
-   **Claim Warranty**: Activate warranties using the code provided by the seller.
-   **Transfer Ownership**: "Release" a warranty to transfer it to a new owner (e.g., when selling a used device).

## Tech Stack
-   **Framework**: Next.js 16 (App Router)
-   **Styling**: Tailwind CSS v4 + Shadcn UI
-   **Auth**: Firebase Authentication (Email/Password for Sellers, Google for Buyers)
-   **Database**: Cloud Firestore
-   **Fonts**: Hind Siliguri (Bangla) & Poppins (English)

## Getting Started

### Prerequisites
-   Node.js 18+
-   Firebase Project with Authentication & Firestore enabled

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/Shuvo-2525/cardbox.git
    cd cardbox
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Set up Environment Variables:
    Create a `.env.local` file in the root directory:
    ```env
    NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
    NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
    ```

4.  Run the development server:
    ```bash
    npm run dev
    ```

## License
MIT