-- Remove the single stale profile record identified during the 2026-11-02 review.
DELETE FROM member_introductions WHERE user_id = '900777841464061992';
DELETE FROM member_display_names WHERE user_id = '900777841464061992';
DELETE FROM member_avatars WHERE user_id = '900777841464061992';
