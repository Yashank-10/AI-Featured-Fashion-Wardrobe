# CLOTHY BUDDY: PROJECT REPORT

## TABLE OF CONTENTS

1. INTRODUCTION  
1.1 Problem Statement: The Challenge of Personal Wardrobe Management and Outfit Selection  
1.2 Motivation and Project Rationale  
1.3 Aim and Objectives of the Project  
1.4 Scope of the Application  
1.5 Limitations of the Current Prototype  
1.6 Organization of the Report  

2. LITERATURE REVIEW  
2.1 Overview of Existing Fashion and Wardrobe Management Applications  
2.2 Common Features in Digital Wardrobe Systems  
2.3 Limitations of Existing Solutions  
2.4 Fundamentals of Rule-Based Recommendation Systems  
2.5 UI/UX Design Principles for Fashion Applications  
2.6 Research Gap and Opportunity for Improvement  

3. REQUIREMENTS ANALYSIS AND PROJECT PLANNING  
3.1 Problem Analysis  
3.2 Functional Requirements  
3.2.1 User Registration and Login  
3.2.2 Wardrobe Item Management  
3.2.3 Outfit Recommendation Generation  
3.2.4 Feedback Collection on Recommendations  
3.2.5 User Profile and Preference Management  
3.3 Non-Functional Requirements  
3.3.1 Usability  
3.3.2 Performance  
3.3.3 Security  
3.3.4 Maintainability  
3.4 Feasibility of the Proposed Solution  

4. SYSTEM DESIGN AND ARCHITECTURE  
4.1 Overview of the Clothy Buddy Prototype  
4.2 High-Level System Architecture  
4.2.1 Frontend Layer  
4.2.2 Backend API Layer  
4.2.3 Database Layer  
4.2.4 Image Storage Layer  
4.3 Core Modules of the Application  
4.3.1 Authentication Module  
4.3.2 User Profile Module  
4.3.3 Wardrobe Management Module  
4.3.4 Recommendation Module  
4.3.5 Feedback Module  
4.3.6 Upload Module  
4.4 Technology Stack Selection  
4.4.1 Frontend: React with Vite  
4.4.2 Backend: FastAPI  
4.4.3 Database: SQLite with SQLAlchemy ORM  
4.4.4 Authentication: JWT-Based Access and Refresh Tokens  
4.4.5 Image Handling: Pillow  
4.5 Database and Data Model Design  
4.5.1 User Model  
4.5.2 Wardrobe Item Model  
4.5.3 Outfit Model  
4.5.4 Recommendation Feedback Model  
4.6 API Design and Route Organization  
4.6.1 Authentication Routes  
4.6.2 User Routes  
4.6.3 Wardrobe Routes  
4.6.4 Upload Routes  
4.6.5 Recommendation Routes  

5. IMPLEMENTATION DETAILS  
5.1 Frontend Implementation  
5.1.1 Application Structure and Component Organization  
5.1.2 Login and Registration Interface  
5.1.3 Wardrobe Dashboard and Item Cards  
5.1.4 Recommendation View and Feedback UI  
5.1.5 API Service Layer Integration  
5.2 Backend Implementation  
5.2.1 FastAPI Application Setup and Middleware  
5.2.2 Database Initialization and ORM Integration  
5.2.3 Schema Validation with Pydantic  
5.2.4 User-Scoped Route Protection  
5.3 Wardrobe Management Logic  
5.3.1 Creating Wardrobe Items Manually  
5.3.2 Uploading Wardrobe Images and Resizing with Pillow  
5.3.3 Updating, Soft Deleting, and Viewing Wardrobe Items  
5.3.4 Marking Items as Favorite and Tracking Usage  
5.3.5 Wardrobe Statistics Generation  
5.4 Recommendation Engine Implementation  
5.4.1 Rule-Based Recommendation Strategy  
5.4.2 Item Categorization into Tops, Bottoms, and Dresses  
5.4.3 Color Harmony Scoring  
5.4.4 Body Shape Compatibility Scoring  
5.4.5 Undertone Compatibility Scoring  
5.4.6 Weighted Outfit Score Formula  
5.4.6.1 Formula: outfit score = 0.4 * color harmony + 0.4 * body-shape score + 0.2 * undertone score  
5.4.6.2 Top-K Recommendation Selection  
5.5 Authentication and Security Implementation  
5.5.1 Password Hashing  
5.5.2 Access Token Creation  
5.5.3 Refresh Token Generation  
5.5.4 Protected Routes and Current User Resolution  
5.5.5 Ownership Checks for User Data Isolation  
5.6 Feedback and Personalization Support  
5.6.1 Recommendation Feedback Submission  
5.6.2 Rating and Helpfulness Capture  
5.6.3 Role of Feedback in Future System Improvement  

6. TESTING AND EVALUATION  
6.1 Testing Objectives  
6.2 Functional Testing of Authentication Features  
6.3 Functional Testing of Wardrobe CRUD Operations  
6.4 Testing Image Upload and File Validation  
6.5 Testing Recommendation Generation  
6.6 Testing Feedback Submission  
6.7 Security and Access Control Validation  
6.8 Evaluation of the Prototype  
6.8.1 Strengths of the Current System  
6.8.2 Observed Limitations  

7. CHALLENGES, SOLUTIONS, AND LESSONS LEARNED  
7.1 Designing a Practical Rule-Based Recommendation Engine  
7.1.1 Problem Description  
7.1.2 Solution Implemented  
7.1.3 Lessons Learned  
7.2 Managing Image Uploads and Storage in a Prototype Environment  
7.2.1 Problem Description  
7.2.2 Solution Implemented  
7.2.3 Lessons Learned  
7.3 Ensuring Secure Access to User-Specific Data  
7.3.1 Problem Description  
7.3.2 Solution Implemented  
7.3.3 Lessons Learned  
7.4 Balancing Simplicity and Scalability in the Technology Stack  
7.4.1 Problem Description  
7.4.2 Solution Implemented  
7.4.3 Lessons Learned  
7.5 General Reflections from Development  

8. PRODUCT WALKTHROUGH  
8.1 User Registration and Login Flow  
8.2 Adding Wardrobe Items with and without Images  
8.3 Viewing Wardrobe Collection and Statistics  
8.4 Marking Favorites and Managing Items  
8.5 Generating Outfit Recommendations  
8.6 Viewing Recommendation Scores  
8.7 Submitting Feedback on Recommendations  

9. CONCLUSION AND FUTURE WORK  
9.1 Summary of Accomplishments  
9.2 Contribution of the Project  
9.3 Current Limitations of the Prototype  
9.4 Future Enhancements  
9.4.1 Advanced Machine Learning-Based Recommendations  
9.4.2 Automatic Clothing Attribute Detection from Images  
9.4.3 Saved Outfit Collections and Outfit History  
9.4.4 Shopping Suggestion Module  
9.4.5 Discard Recommendation Module  
9.4.6 Production Database and Cloud Image Storage  
9.4.7 Background Processing for Heavy Tasks  

---

# CHAPTER 1: INTRODUCTION

## 1.1 Problem Statement: The Challenge of Personal Wardrobe Management and Outfit Selection

Clothy Buddy is a smart web-based application developed to simplify personal wardrobe management and assist users in selecting suitable outfits from their existing clothing collection. In daily life, many users face difficulty organizing clothes, remembering what they own, choosing matching outfits, and maintaining a clear view of frequently used or favorite items. These problems become more noticeable when wardrobes grow larger and decisions must be made quickly for different occasions and seasons.

Traditional wardrobe management is usually manual and unstructured. People often rely on memory, physical inspection of clothes, or trial-and-error while selecting outfits. This process can be time-consuming and inefficient, especially when users want combinations that are visually balanced and aligned with personal attributes such as body shape and undertone. In addition, without a digital system, it is difficult to track item usage, manage favorites, and maintain organized clothing records.

## 1.2 Motivation and Project Rationale

The motivation behind Clothy Buddy comes from the growing need for a simple digital assistant that helps users make practical use of the clothes they already own. Many people buy new clothing items despite underusing existing ones simply because they cannot easily visualize combinations or remember their full wardrobe.

Clothy Buddy addresses this by providing a centralized digital platform where users can register securely, maintain wardrobe items, upload clothing images, and receive outfit recommendations through a rule-based recommendation engine. The application allows users to add garment details such as category, color, season, occasion, material, and subcategory. It also supports image upload and resizing so that wardrobe items can be stored with visual references.

## 1.3 Aim and Objectives of the Project

The main aim of Clothy Buddy is to develop an intelligent wardrobe management application that helps users organize clothing items and receive useful outfit recommendations based on their own collection.

The major objectives of the system are as follows:

- To provide secure user registration and login functionality
- To allow users to create and manage a digital wardrobe
- To support clothing item upload with image storage and metadata capture
- To organize wardrobe items based on category, color, season, occasion, and related attributes
- To generate outfit recommendations using a rule-based recommendation engine
- To evaluate outfits using color harmony, body-shape fit, and undertone fit
- To enable users to mark favorite items and track clothing usage
- To collect user feedback on recommendations for future improvement
- To implement a modular and maintainable full-stack architecture
- To provide a practical base for future expansion into more advanced AI-powered fashion assistance

## 1.4 Scope of the Application

The scope of Clothy Buddy includes the design and development of a complete prototype web application for personal wardrobe digitization and outfit recommendation.

The application currently covers the following functionality:

- User registration, login, and authenticated access
- User profile management
- Creation of wardrobe items manually or through image upload
- Storage of item details such as category, subcategory, color, pattern, material, season, and occasion
- Image upload and resizing for wardrobe item photographs
- Viewing, updating, deleting, and filtering wardrobe items
- Marking wardrobe items as favorites
- Tracking usage-related details such as times worn
- Displaying wardrobe statistics
- Generating outfit recommendations from stored items
- Displaying recommendation scores for color harmony, body-shape compatibility, and undertone compatibility
- Submitting feedback on recommended outfits

## 1.5 Limitations of the Current Prototype

The present scope is limited to a working prototype with a rule-based recommendation model and local development-oriented storage. Features such as advanced machine learning recommendations, automated clothing recognition from images, shopping suggestions, discard recommendations, cloud deployment, and large-scale analytics are not part of the current implemented system and are considered future enhancements.

## 1.6 Organization of the Report

This report is organized into nine chapters. Chapter 1 introduces the project background, objectives, and scope. Chapter 2 presents the literature review and contextual background. Chapter 3 discusses requirements analysis and planning. Chapter 4 explains the system architecture and design. Chapter 5 covers implementation details. Chapter 6 presents testing and evaluation. Chapter 7 discusses challenges and lessons learned. Chapter 8 provides a product walkthrough. Chapter 9 concludes the report and presents future work.

---

# CHAPTER 2: LITERATURE REVIEW

## 2.1 Overview of Existing Fashion and Wardrobe Management Applications

The rapid growth of digital lifestyle applications has significantly changed the way users manage personal information and make everyday decisions. In the area of fashion technology, wardrobe management applications have emerged as useful tools for organizing clothing collections, planning outfits, and improving personal styling efficiency. Earlier systems in this domain were mostly limited to simple catalog-style storage, where users could save clothing items and manually browse them later.

## 2.2 Common Features in Digital Wardrobe Systems

Modern wardrobe platforms commonly include:

- Clothing item storage
- Image-based cataloging
- Category-based organization
- Season and occasion labeling
- Basic favorite or collection marking
- Style inspiration boards

These features improve visibility, but many systems still focus more on display than on actionable outfit recommendation.

## 2.3 Limitations of Existing Solutions

Several existing systems still have important limitations:

- Lack of intelligent outfit recommendation based on wardrobe contents
- Heavy dependence on manual browsing and manual outfit selection
- Limited personalization using user-related attributes such as undertone or body shape
- Weak integration of usage tracking and favorites into recommendation workflows
- Insufficient feedback capture for improving future recommendations
- Limited transparency in how suggested outfits are formed

## 2.4 Fundamentals of Rule-Based Recommendation Systems

Research in recommendation systems suggests that personalized suggestions improve user engagement, decision confidence, and perceived usefulness of digital platforms. In the fashion domain, recommendation quality depends not only on user taste but also on visual harmony and practical context. For this reason, explainable and rule-based recommendation strategies remain highly relevant, especially in prototype systems where interpretability, speed, and ease of implementation are important.

Clothy Buddy uses a transparent scoring approach based on:

- Color harmony
- Body-shape compatibility
- Undertone compatibility

This makes the recommendation process understandable and academically explainable.

## 2.5 UI/UX Design Principles for Fashion Applications

Fashion-related applications require visually clear and pleasant interfaces because users rely on image display and quick visual comparison. Good UI/UX principles for this domain include:

- Clear item presentation
- Minimal navigation complexity
- Responsive layouts
- Readable tags and labels
- Visually consistent card-based displays
- Simple interaction flows for upload and recommendation review

Clothy Buddy follows these principles through a lightweight React interface styled with Tailwind CSS.

## 2.6 Research Gap and Opportunity for Improvement

Many available solutions do not adequately connect wardrobe organization with recommendation scoring, user profile factors, and feedback collection within a single integrated system. Clothy Buddy addresses this gap by combining digital wardrobe management, image-based clothing records, rule-based outfit recommendation, and feedback capture within one application.

---

# CHAPTER 3: REQUIREMENTS ANALYSIS AND PROJECT PLANNING

## 3.1 Problem Analysis

The core problem addressed by Clothy Buddy is the difficulty many users face in managing personal wardrobes and selecting outfits efficiently. People often own more clothing items than they can easily remember or organize. As a result, they may repeatedly wear the same combinations, forget useful garments they already own, or struggle to decide what to wear for a specific season or occasion.

Choosing an outfit requires considering multiple factors such as clothing category, color compatibility, occasion suitability, season, and personal appearance-related factors like body shape or undertone. Without a digital system, users usually make these decisions manually through memory and trial-and-error, which is time-consuming and inconsistent.

## 3.2 Functional Requirements

Functional requirements define the specific actions and services that the Clothy Buddy system must provide.

### 3.2.1 User Registration and Login

The system should:

- Register a new user with full name, username, email, and password
- Prevent duplicate email or username registration
- Authenticate users during login
- Generate access and refresh tokens after successful login
- Allow authenticated users to access protected routes

### 3.2.2 Wardrobe Item Management

The system should:

- Add wardrobe items manually
- Upload wardrobe items with clothing images
- Store item attributes such as category, color, material, season, and occasion
- Retrieve all active wardrobe items for the logged-in user
- Update an existing wardrobe item
- Soft delete wardrobe items instead of permanently removing them
- Toggle favorite status on wardrobe items
- Track usage-related values such as times worn and last worn
- Generate wardrobe statistics

### 3.2.3 Outfit Recommendation Generation

The system should:

- Filter wardrobe items by current user
- Group clothing items into meaningful outfit combinations
- Score recommendations using rule-based logic
- Return top-ranked recommendations
- Provide score breakdowns for recommendation transparency

### 3.2.4 Feedback Collection on Recommendations

The system should:

- Allow helpful or unhelpful recommendation feedback
- Accept user rating values
- Accept optional textual comments
- Store feedback records for later review or future enhancement

### 3.2.5 User Profile and Preference Management

The system should:

- Store body shape details
- Store undertone information
- Store style-related preferences
- Allow users to retrieve and update profile information

## 3.3 Non-Functional Requirements

### 3.3.1 Usability

The system should:

- Provide a clear and responsive interface
- Support straightforward navigation
- Present readable item and recommendation information
- Keep interaction flows short and intuitive

### 3.3.2 Performance

The system should:

- Load wardrobe data within reasonable time
- Handle recommendation requests without excessive delay
- Process image uploads efficiently for prototype-scale usage
- Avoid unnecessary reloads in the frontend

### 3.3.3 Security

The system should:

- Hash passwords before storage
- Use JWT-based authentication
- Restrict protected routes to authenticated users
- Ensure that users can access only their own wardrobe and feedback data
- Keep configuration secrets outside hardcoded source logic

### 3.3.4 Maintainability

The system should:

- Separate frontend and backend concerns
- Organize backend routes by domain
- Use model and schema layers for structured backend logic
- Support easy extension of recommendation features and storage models

## 3.4 Feasibility of the Proposed Solution

The proposed Clothy Buddy solution is feasible from academic, technical, and operational perspectives.

### 3.4.1 Technical Feasibility

The project is technically feasible because it uses well-established web technologies that are appropriate for prototype development. React, FastAPI, SQLite, SQLAlchemy, and Pillow are lightweight, accessible, and reliable for the scale of this project.

### 3.4.2 Economic Feasibility

The project is economically feasible because it relies mainly on open-source tools and local development infrastructure.

### 3.4.3 Operational Feasibility

The project is operationally feasible because the expected user workflow is simple: register, log in, add items, request recommendations, and give feedback.

---

# CHAPTER 4: SYSTEM DESIGN AND ARCHITECTURE

## 4.1 Overview of the Clothy Buddy Prototype

Clothy Buddy follows a modern full-stack client-server architecture designed to provide modularity, maintainability, secure access, and smooth interaction between the user interface and the backend services.

## 4.2 High-Level System Architecture

### 4.2.1 Frontend Layer

The frontend is developed using React with Vite. It provides screens and components for:

- User registration and login
- Wardrobe item listing
- Add-item form submission
- Recommendation display
- Feedback submission
- Logout and session flow

### 4.2.2 Backend API Layer

The backend is implemented in FastAPI and organized through route modules. It handles:

- User authentication and authorization
- API request routing
- Business logic implementation
- Wardrobe item management
- Recommendation generation
- Feedback storage
- User profile access
- Image upload handling

### 4.2.3 Database Layer

SQLite is used as the development database, while SQLAlchemy models define the structure of the main entities used in the project.

### 4.2.4 Image Storage Layer

Uploaded images are stored in a local uploads folder and served as static files by the backend.

## 4.3 Core Modules of the Application

### 4.3.1 Authentication Module

This module manages user registration, login, password verification, and token generation.

### 4.3.2 User Profile Module

This module stores and manages user-specific profile details such as full name, body shape, height, weight, undertone, and style preferences.

### 4.3.3 Wardrobe Management Module

This module enables users to create, view, update, and remove wardrobe items.

### 4.3.4 Recommendation Module

This module generates outfit recommendations from wardrobe items and evaluates them using predefined scoring rules.

### 4.3.5 Feedback Module

This module records user responses on recommendations, including helpfulness, ratings, and comments.

### 4.3.6 Upload Module

This module supports image uploads, file validation, resizing, unique naming, and storage-path generation.

## 4.4 Technology Stack Selection

### 4.4.1 Frontend: React with Vite

React supports component-based interface development, while Vite provides fast frontend setup and builds.

### 4.4.2 Backend: FastAPI

FastAPI supports structured RESTful APIs and lightweight backend development.

### 4.4.3 Database: SQLite with SQLAlchemy ORM

SQLite provides simple relational storage, while SQLAlchemy improves maintainability through ORM-based models.

### 4.4.4 Authentication: JWT-Based Access and Refresh Tokens

JWT is used for secure authentication and protected route access.

### 4.4.5 Image Handling: Pillow

Pillow supports image validation and resizing during upload.

## 4.5 Database and Data Model Design

The main database entities are:

- users
- wardrobe_items
- outfits
- recommendation_feedback

### 4.5.1 User Model

Stores account information and profile data.

### 4.5.2 Wardrobe Item Model

Stores user-specific clothing records and their metadata.

### 4.5.3 Outfit Model

Supports outfit-related metadata and possible saved outfit structures.

### 4.5.4 Recommendation Feedback Model

Stores helpfulness, ratings, and comments on recommendations.

## 4.6 API Design and Route Organization

### 4.6.1 Authentication Routes

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`

### 4.6.2 User Routes

- `GET /users/me`
- `PUT /users/me`
- `GET /users/{user_id}`

### 4.6.3 Wardrobe Routes

- `POST /wardrobe/items`
- `GET /wardrobe/items`
- `GET /wardrobe/items/{item_id}`
- `PUT /wardrobe/items/{item_id}`
- `DELETE /wardrobe/items/{item_id}`
- `POST /wardrobe/items/{item_id}/wear`
- `POST /wardrobe/items/{item_id}/favorite`
- `GET /wardrobe/stats`

### 4.6.4 Upload Routes

- `POST /upload/wardrobe-item`

### 4.6.5 Recommendation Routes

- `GET /recommendations/outfits`
- `POST /recommendations/feedback`
- `GET /recommendations/feedback`

---

# CHAPTER 5: IMPLEMENTATION DETAILS

## 5.1 Frontend Implementation

### 5.1.1 Application Structure and Component Organization

The frontend of Clothy Buddy is organized around a focused set of components that support the main user journey. The main application component manages authentication state, token persistence in local storage, view switching between wardrobe and recommendation screens, data loading after login, and error or loading state handling.

### 5.1.2 Login and Registration Interface

The login component provides both registration and sign-in modes. It allows users to create a new account, enter login credentials, submit authentication forms, and view API error messages.

### 5.1.3 Wardrobe Dashboard and Item Cards

The wardrobe component provides:

- Item upload form
- Manual clothing entry
- Wardrobe gallery display
- Favorite toggling
- Item deletion
- Wardrobe statistics display

### 5.1.4 Recommendation View and Feedback UI

The recommendation component provides:

- Recommendation loading
- Filter selection for season and occasion
- Outfit card display
- Score display for recommendation quality
- Feedback submission controls

### 5.1.5 API Service Layer Integration

The frontend uses the browser Fetch API through a centralized helper layer for:

- Registration and login requests
- Profile retrieval
- Wardrobe item retrieval and updates
- Image upload
- Recommendation loading
- Feedback submission

## 5.2 Backend Implementation

### 5.2.1 FastAPI Application Setup and Middleware

The backend application is initialized through FastAPI and configured with middleware such as CORS handling. The application also mounts the uploads directory for serving static images.

### 5.2.2 Database Initialization and ORM Integration

The backend uses SQLAlchemy models and creates database tables during startup through the configured database engine.

### 5.2.3 Schema Validation with Pydantic

Pydantic is used for structured request and response validation across authentication, wardrobe, user, recommendation, and feedback flows.

### 5.2.4 User-Scoped Route Protection

Protected routes use current-user dependency handling so that wardrobe and recommendation data remain user-specific.

## 5.3 Wardrobe Management Logic

### 5.3.1 Creating Wardrobe Items Manually

Users can add wardrobe items by providing clothing metadata without requiring an image.

### 5.3.2 Uploading Wardrobe Images and Resizing with Pillow

When users upload an image, the backend validates the file type, generates a unique filename, resizes the image using Pillow, and stores it in the uploads directory.

### 5.3.3 Updating, Soft Deleting, and Viewing Wardrobe Items

The system supports update operations on wardrobe items and uses soft deletion by marking items inactive instead of removing them permanently.

### 5.3.4 Marking Items as Favorite and Tracking Usage

Users can toggle favorite status, and the system also supports usage-related fields such as `times_worn` and `last_worn`.

### 5.3.5 Wardrobe Statistics Generation

The backend calculates:

- Total items
- Items by category
- Items by season
- Favorite count
- Total wear count

## 5.4 Recommendation Engine Implementation

### 5.4.1 Rule-Based Recommendation Strategy

The recommendation engine is based on a rule-based scoring model chosen for explainability and practicality.

### 5.4.2 Item Categorization into Tops, Bottoms, and Dresses

Wardrobe items are grouped into tops, bottoms, and dresses before outfit candidates are generated.

### 5.4.3 Color Harmony Scoring

Color harmony is evaluated using predefined color relationships and simplified color wheel logic.

### 5.4.4 Body Shape Compatibility Scoring

The algorithm checks whether item subcategories align with rules associated with different body shapes.

### 5.4.5 Undertone Compatibility Scoring

The algorithm compares clothing colors with warm, cool, and neutral undertone rules.

### 5.4.6 Weighted Outfit Score Formula

#### 5.4.6.1 Formula

`outfit score = 0.4 * color harmony + 0.4 * body-shape score + 0.2 * undertone score`

#### 5.4.6.2 Top-K Recommendation Selection

The system sorts generated outfit candidates by score and returns the top-ranked results.

## 5.5 Authentication and Security Implementation

### 5.5.1 Password Hashing

Passwords are hashed using Passlib before being stored in the database.

### 5.5.2 Access Token Creation

Access tokens are generated after successful login and used for protected requests.

### 5.5.3 Refresh Token Generation

Refresh tokens are also generated during login to support session extension in the current design.

### 5.5.4 Protected Routes and Current User Resolution

The backend resolves the current user from the token before processing protected requests.

### 5.5.5 Ownership Checks for User Data Isolation

Wardrobe item operations and recommendation-related data access are filtered by the authenticated user identity.

## 5.6 Feedback and Personalization Support

### 5.6.1 Recommendation Feedback Submission

Users can submit feedback on recommendations through the frontend, which is then stored by the backend.

### 5.6.2 Rating and Helpfulness Capture

The feedback structure includes:

- Helpfulness response
- Rating
- Optional comments

### 5.6.3 Role of Feedback in Future System Improvement

Feedback provides a useful foundation for future personalization and refinement of recommendation quality.

---

# CHAPTER 6: TESTING AND EVALUATION

## 6.1 Testing Objectives

The purpose of testing in Clothy Buddy is to verify that the system behaves correctly, securely, and consistently across its main workflows.

## 6.2 Functional Testing of Authentication Features

Authentication testing covered:

- Successful registration with valid data
- Rejection of duplicate email addresses
- Rejection of duplicate usernames
- Successful login with correct credentials
- Rejection of invalid credentials
- Access to protected routes only after valid authentication

## 6.3 Functional Testing of Wardrobe CRUD Operations

Wardrobe CRUD testing covered:

- Creating wardrobe items manually
- Viewing all active wardrobe items
- Retrieving a single wardrobe item by identifier
- Updating wardrobe item details
- Soft deleting wardrobe items
- Toggling favorite status
- Marking items as worn
- Viewing updated wardrobe statistics

## 6.4 Testing Image Upload and File Validation

Image upload testing covered:

- Uploading a valid image file
- Rejecting non-image files
- Confirming image resizing during upload
- Confirming path generation and storage
- Confirming image display in the frontend

## 6.5 Testing Recommendation Generation

Recommendation testing covered:

- Recommendation generation when valid wardrobe items exist
- Proper handling when too few wardrobe items are available
- Correct grouping into outfit candidates
- Score generation for color harmony, body-shape fit, and undertone fit
- Returning top-ranked results

## 6.6 Testing Feedback Submission

Feedback testing covered:

- Submission of helpful and unhelpful responses
- Submission of numeric rating values
- Submission of optional comments
- Retrieval of submitted feedback records

## 6.7 Security and Access Control Validation

Security testing covered:

- Accessing protected endpoints without a token
- Accessing protected endpoints with a valid token
- Attempting to fetch another user’s wardrobe item
- Attempting to update another user’s wardrobe item
- Attempting to delete another user’s wardrobe item

## 6.8 Evaluation of the Prototype

### 6.8.1 Strengths of the Current System

- Clean and focused user workflow
- Secure user authentication
- Organized wardrobe item management
- Practical image-supported wardrobe storage
- Transparent rule-based recommendation scoring
- Simple feedback collection for future enhancement
- Modular backend and frontend structure

### 6.8.2 Observed Limitations

- Recommendations are based on fixed rules rather than adaptive learning
- Clothing image understanding is manual rather than automatic
- Local file storage is suitable for development but not ideal for production scale
- Outfit persistence and outfit history are limited
- Large-scale performance testing is not included in the current version

---

# CHAPTER 7: CHALLENGES, SOLUTIONS, AND LESSONS LEARNED

## 7.1 Designing a Practical Rule-Based Recommendation Engine

### 7.1.1 Problem Description

One of the main challenges in Clothy Buddy was building an outfit recommendation system that feels useful without depending on a complex machine learning pipeline.

### 7.1.2 Solution Implemented

The project uses a rule-based recommendation engine. Wardrobe items are grouped into tops, bottoms, and dresses, and candidate outfits are generated from these groups. Each outfit is then scored using color harmony, body-shape compatibility, and undertone compatibility.

### 7.1.3 Lessons Learned

A well-designed rule-based system can deliver meaningful value in an early-stage product and provides a solid baseline for future ML-based enhancement.

## 7.2 Managing Image Uploads and Storage in a Prototype Environment

### 7.2.1 Problem Description

Image uploads create issues related to file validation, inconsistent sizes, storage overhead, and frontend display reliability.

### 7.2.2 Solution Implemented

The project validates uploaded files as images, generates unique filenames, resizes the images through Pillow, and stores them in a local uploads directory.

### 7.2.3 Lessons Learned

Basic image handling adds significant practical value, but local storage is best suited for development and demonstration.

## 7.3 Ensuring Secure Access to User-Specific Data

### 7.3.1 Problem Description

Since Clothy Buddy stores personal wardrobe data, a major challenge was ensuring that each user could access only their own records.

### 7.3.2 Solution Implemented

This challenge was addressed through JWT-based authentication and user-scoped database queries.

### 7.3.3 Lessons Learned

Authentication alone is not sufficient; route-level ownership validation is equally necessary.

## 7.4 Balancing Simplicity and Scalability in the Technology Stack

### 7.4.1 Problem Description

Choosing a technology stack for an academic prototype involves balancing simplicity with future extensibility.

### 7.4.2 Solution Implemented

The project uses a lightweight but structured stack:

- React with Vite for the frontend
- FastAPI for the backend
- SQLite for development storage
- SQLAlchemy for database abstraction
- Pillow for image handling

### 7.4.3 Lessons Learned

The best prototype stack is not the most feature-rich one, but the one that supports clarity, maintainability, and steady progress.

## 7.5 General Reflections from Development

The development of Clothy Buddy highlighted several broader lessons:

- Clear scope control is essential in academic projects
- A modular design helps avoid confusion during implementation
- User experience matters even in technically focused systems
- Security and validation should be handled from the beginning
- Simple logic can still be effective when it is designed carefully

---

# CHAPTER 8: PRODUCT WALKTHROUGH

## 8.1 User Registration and Login Flow

The user journey in Clothy Buddy begins at the authentication screen. New users can create an account by entering their full name, username, email address, and password. Once registration is completed successfully, the user can log in and receive secure access to the application.

## 8.2 Adding Wardrobe Items with and without Images

After logging in, the user reaches the wardrobe dashboard, where new clothing items can be added with or without an image. The user fills in values such as category, subcategory, primary color, brand, pattern, material, season, and occasion.

## 8.3 Viewing Wardrobe Collection and Statistics

Once items are added, they appear as item cards with visual and textual summaries. The dashboard also shows:

- Total number of active items
- Number of favorite items
- Total wear count

## 8.4 Marking Favorites and Managing Items

Users can mark items as favorite and delete items through the dashboard. The delete operation is implemented as a soft delete.

## 8.5 Generating Outfit Recommendations

When the user has added enough wardrobe items, the recommendation feature can be used. The frontend requests ranked outfit suggestions from the backend.

## 8.6 Viewing Recommendation Scores

Each recommended outfit includes:

- Overall score
- Color harmony score
- Body-shape compatibility score
- Undertone compatibility score

## 8.7 Submitting Feedback on Recommendations

After viewing a recommendation, the user can:

- Mark the recommendation as helpful or unhelpful
- Submit a rating value
- Add a short comment

---

# CHAPTER 9: CONCLUSION AND FUTURE WORK

## 9.1 Summary of Accomplishments

The development of Clothy Buddy successfully demonstrates the design and implementation of a practical digital wardrobe management and outfit recommendation system. The project brings together secure authentication, wardrobe organization, image-assisted item storage, recommendation logic, and feedback collection in a single full-stack web application.

## 9.2 Contribution of the Project

The main contribution of Clothy Buddy lies in combining wardrobe organization and outfit recommendation into a lightweight and explainable prototype.

## 9.3 Current Limitations of the Prototype

The current limitations include:

- Recommendations rely on fixed rules rather than adaptive learning
- Clothing attributes must be entered manually by the user
- Image uploads are stored locally instead of in production-scale cloud storage
- Outfit history and saved outfit workflows are limited
- The system is optimized for prototype use rather than high-scale deployment

## 9.4 Future Enhancements

### 9.4.1 Advanced Machine Learning-Based Recommendations

A future version can replace or augment the rule-based engine with machine learning models.

### 9.4.2 Automatic Clothing Attribute Detection from Images

Computer vision techniques can be introduced to automatically identify clothing attributes from uploaded images.

### 9.4.3 Saved Outfit Collections and Outfit History

The system can be extended to allow users to save recommended outfits and maintain outfit history.

### 9.4.4 Shopping Suggestion Module

A future module can recommend missing wardrobe pieces that complement the user’s current collection.

### 9.4.5 Discard Recommendation Module

The application can later analyze item usage trends and inactivity periods to suggest underused items for removal.

### 9.4.6 Production Database and Cloud Image Storage

The system can move from SQLite and local image storage to more scalable infrastructure in production.

### 9.4.7 Background Processing for Heavy Tasks

If future versions introduce computer vision or more advanced recommendation pipelines, background task processing can be added.

## 9.5 Final Conclusion

Clothy Buddy demonstrates that a useful and user-friendly wardrobe recommendation prototype can be built using modern full-stack technologies and explainable scoring logic. The project successfully converts a common everyday problem into a structured digital solution and lays the foundation for more advanced personalized fashion assistance systems in the future.
