/*
# Add map_embed_url to company_settings

1. Modified Tables
- `company_settings` — adds `map_embed_url` text column for Google Maps embed URL

2. Notes
- This stores the full embed URL (e.g. https://www.google.com/maps/embed?pb=...)
- The admin can set this later from the dashboard settings page
- Default is empty string (no map shown until configured)
*/

ALTER TABLE company_settings
ADD COLUMN IF NOT EXISTS map_embed_url text DEFAULT '';
