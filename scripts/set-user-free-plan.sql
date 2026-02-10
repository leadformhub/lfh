-- Set a user's plan to free. Replace YOUR_USERNAME_OR_EMAIL (or email/id).
-- Run (1) and (2) so the app does not auto-upgrade them back. (Requires applied_at: run prisma db push first.)

-- (1) Set plan to free:
UPDATE User SET plan = 'free' WHERE username = 'YOUR_USERNAME_OR_EMAIL';

-- (2) Mark that user's captured payments as applied (use same username, or replace with user_id from User table):
UPDATE payments p
INNER JOIN User u ON p.user_id = u.id
SET p.applied_at = COALESCE(p.updated_at, NOW())
WHERE p.status = 'captured' AND p.applied_at IS NULL AND u.username = 'YOUR_USERNAME_OR_EMAIL';
