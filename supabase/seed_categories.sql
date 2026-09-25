-- Seed Initial Craft Categories Taxonomy
INSERT INTO public.categories (name, slug, description, image) VALUES
('Home Decor', 'home-decor', 'Handcrafted interior accents, cushion covers, trays, and table highlights for warm spaces.', 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80'),
('Handmade Art', 'handmade-art', 'Folk paintings, canvas artworks, and traditional Indian heritage motifs created by hand.', 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80'),
('Gifts', 'gifts', 'Thoughtfully selected handmade gift sets, jewelry boxes, and decorative keepsakes.', 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80'),
('Traditional Crafts', 'traditional-crafts', 'Time-honored metal castings, wooden heritage toys, and regional Indian crafts.', 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=800&q=80'),
('Wall Decor', 'wall-decor', 'Hand-carved wooden jharokhas, brass wall hangings, and artisanal tapestry pieces.', 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=800&q=80'),
('Decorative Items', 'decorative-items', 'Solid brass urlis, ceramic pottery, and handpainted planters.', 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80')
ON CONFLICT (slug) DO NOTHING;
