-- Set a user to business plan (run this after replacing the email with the real one).

-- Option 1: Update existing user by email
UPDATE User SET plan = 'business' WHERE email = 'your-email@example.com';

-- Option 2: Update existing user by username
-- UPDATE User SET plan = 'business' WHERE username = 'yourusername';
