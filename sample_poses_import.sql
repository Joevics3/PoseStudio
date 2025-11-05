-- Sample SQL to import 20 test poses into Supabase
-- Copy and paste this into your Supabase SQL editor

INSERT INTO poses (id, title, description, "imageUrl", category) VALUES
('w1', 'Casual Standing', 'Relaxed standing pose with natural body position', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80', 'women-solo'),
('w2', 'Side Profile', 'Elegant side profile with head turned', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80', 'women-solo'),
('w3', 'Portrait Shot', 'Professional portrait with natural lighting', 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&q=80', 'women-solo'),
('w4', 'Editorial Pose', 'Stylish editorial pose with confident expression', 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800&q=80', 'women-solo'),
('w5', 'Lifestyle Moment', 'Natural lifestyle moment captured', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&q=80', 'women-solo'),
('m1', 'Confident Stand', 'Strong standing pose with good posture', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80', 'men-solo'),
('m2', 'Street Style', 'Casual street style pose', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&q=80', 'men-solo'),
('m3', 'Formal Portrait', 'Professional formal portrait pose', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&q=80', 'men-solo'),
('m4', 'Relaxed Casual', 'Comfortable relaxed casual pose', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80', 'men-solo'),
('c1', 'Forehead Touch', 'Intimate forehead to forehead pose', 'https://images.unsplash.com/photo-1518568814500-bf0f8d125f46?w=800&q=80', 'couples'),
('c2', 'Hand in Hand', 'Romantic hand holding pose', 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&q=80', 'couples'),
('c3', 'Back Hug', 'Affectionate embrace from behind', 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&q=80', 'couples'),
('kf1', 'Family Portrait', 'Happy family portrait moment', 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&q=80', 'kids-family'),
('kf2', 'Playful Kids', 'Natural playful kids moment', 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&q=80', 'kids-family'),
('gf1', 'Group of Friends', 'Fun group of friends together', 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80', 'group-friends'),
('gf2', 'Travel Group', 'Travel group photo pose', 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800&q=80', 'group-friends'),
('pd1', 'Sitting Pretty', 'Classic dog sitting pose', 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&q=80', 'pets-dogs'),
('pd2', 'Playful Dog', 'Happy playful dog moment', 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&q=80', 'pets-dogs'),
('pc1', 'Regal Cat', 'Elegant cat sitting pose', 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&q=80', 'pets-cats'),
('pp1', 'Professional Headshot', 'Professional business headshot pose', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&q=80', 'professional-portrait');


